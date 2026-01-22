//後台管理
import { useEffect, useState,useRef } from 'react';

import axios from "axios";
import * as bootstrap from 'bootstrap';
import "./assets/style.css";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

//modal預設資料
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};



function App(){
  //表單資料狀態(儲存使用者輸入的帳號密碼)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  //控制顯示登入頁或是產品頁,預設為登入頁
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //產品資料狀態
  const [products, setProducts] = useState([]);
  //目前選的商品
  //const [selectedProduct, setSelectedProduct] = useState(null);
  const [tempProduct, setTempProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType,setModalType] = useState(''); // 'create' or 'edit'  

  //modal用
  const productModalRef = useRef(null);
  const delProductModalRef = useRef(null);

  // useEffect
  useEffect(() => {
  //初始化 modal 第一次渲染初始化
  productModalRef.current = new bootstrap.Modal("#productModal");
  // 初始化刪除用的 Modal
  delProductModalRef.current = new bootstrap.Modal("#delProductModal");
  
  // Modal 關閉時，移除 focus 狀態
  document
    .querySelector("#productModal")
    .addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }, []);
  // 使用 ref 控制 Modal開啟和關閉
  const openModal = (type,product) => {
  console.log(product)
  setModalType(type); // 這裡設定'create' 還是 'edit'判斷modal是否要顯示既有資料
  if (type === 'create') {
    setTempProduct(INITIAL_TEMPLATE_DATA);
  } else {
    // 如果是編輯時，將產品資料完整帶入 tempProduct
    setTempProduct({ ...product });
  }
  productModalRef.current.show();
  };

  const closeModal = () => {
  productModalRef.current.hide();
  };
  //處理modal表單輸入變更
  const handleModalInputChange = (e) => {
    const { name, value ,checked,type} = e.target;
    setTempProduct({
      ...tempProduct,
     [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
     });
  };
  //處理modal表單的圖片輸入變更
  const handleModalImageChange=(index,value)=>{
  //const { value } = e.target;
  setTempProduct((prevData)=>{
    const newImages = prevData.imagesUrl ? [...prevData.imagesUrl] : [];
    newImages[index] = value;
    return {
      ...prevData,
      imagesUrl: newImages,
    }
  })
  };



  //處理登入表單輸入變更
  const handleInputChange = (e) => {
  const { name, value } = e.target;
    //console.log(name, value);
    setFormData((preData)=>({
      ...preData,
      [name]: value,
    }));
  };
 

  //新增商品圖片：在陣列加入空字串，產生新的輸入框
  const handleAddImage = () => {
  setTempProduct((prev) => ({
    ...prev,
    imagesUrl: prev.imagesUrl ? [...prev.imagesUrl, ""] : [""],
  }));
  };

  //刪除圖片：移除陣列中的最後一個元素
  const handleRemoveImage = () => {
  setTempProduct((prev) => {
    const newImages = prev.imagesUrl ? [...prev.imagesUrl] : [];
    newImages.pop(); // 移除最後一項
    return {
      ...prev,
      imagesUrl: newImages,
    };
  });
  };

  const onSubmit = async(e) => {
    //console.log('表單提交', formData);
    //送出登入請求
    try{
      e.preventDefault();
      const response = await axios.post(`${API_BASE}admin/signin`, formData);
      //console.log('登入成功', response.data) ;
      document.cookie = `hexToken=${response.data.token}; expires=${new Date(response.data.expired)};`;
      axios.defaults.headers.common['Authorization'] = `${response.data.token}`;
      setIsLoggedIn (true);
      //登入成功後渲染產品清單
      getProducts ();

    } catch (error) {
      //console.error('登入失敗', error.response);
      alert('登入失敗，請檢查帳號密碼是否正確');
      setIsLoggedIn (false);
    }
    //setIsLoggedIn (true);
  }
  //檢查管理員權限
  const checkAdmin = async () => {
  try {
    await axios.post(`${API_BASE}/api/user/check`);
    setIsAuth(true);
    getProductData(); // 載入產品資料
  } catch (err) {
    console.log("權限檢查失敗：", err.response?.data?.message);
    setIsAuth(false);
  }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
      if (token) {
        axios.defaults.headers.common['Authorization'] = token;
      }
      
    //檢查是否登入
    const checkLogin = async() => {
      try{ 
        const response = await axios.post(`${API_BASE}api/user/check`);
         //console.log('驗證token', response.data);
         //alert('目前已登入');
         setIsLoggedIn (true);
         getProducts ();
      } catch (error) {
         //console.error('驗證token失敗', error.response?.data);
         alert('尚未登入，請重新登入');
         setIsLoggedIn (false);
    }
  };
  checkLogin();
}, []);


  //取得產品清單
  const getProducts = async() => {
    try{
      const response = await axios.get(`${API_BASE}api/${API_PATH}/admin/products/all`);
      console.log('取得產品清單', response.data.products);
      //setProducts(response.data.products);
      setProducts(Object.values(response.data.products));
    } catch (error) {
      //console.error('取得產品清單失敗', error.response);
    }
  };

  //新增商品
  const addProduct = async () => {
    try {
     const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`,{ data: tempProduct });
     //console.log('準備送出的資料：', tempProduct); // 檢查 price 是否為數字
     //console.log('新增商品成功', response.data);
     alert('新增商品成功');
     getProducts();
     closeModal();
    } catch (error) {
     alert('新增商品失敗');
    }
  };

  //編輯商品
  const editProduct = async (id) => {
    try {
      const response = await axios.put(
      `${API_BASE}/api/${API_PATH}/admin/product/${id}`, 
      { data: tempProduct }
    );
    //console.log('編輯商品成功', response.data);
    alert('編輯商品成功');
    getProducts(); // 重新取得列表
    closeModal();  // 關閉視窗
  } catch (error) {
    //console.error('編輯商品失敗', error.response?.data?.message);
    alert(`編輯失敗：${error.response?.data?.message.join(', ')}`);
  }
};

// 開啟 delModal 設定資料
const openDelModal = (product) => {
  setTempProduct(product); 
  delProductModalRef.current.show();
};

// 刪除商品
const handleConfirmDelete = async () => {
  try {
    const response = await axios.delete(
      `${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`
    );
    //alert("刪除成功");
    getProducts(); 
    delProductModalRef.current.hide(); // 關閉刪除視窗
  } catch (error) {
    //console.error("刪除失敗", error.response);
    alert("刪除失敗");
  }
};

return (
<>
{!isLoggedIn ? (

  <div className="container login">
    <h1>請輸入帳號密碼登入</h1>
    <form  className='form-flating' onSubmit={(e)=>onSubmit(e)}>
   <div className="form-floating mb-3">
  <input type="email" name="username" className="form-control" id="username" placeholder="name@example.com" value={formData.username}  
  onChange={(e) => handleInputChange(e)}
  />
  <label htmlFor="username">Email address</label>
</div>
<div className="form-floating">
  <input type="password" name='password' className="form-control" id="password" placeholder="Password" value={formData.password}
  onChange={(e) => handleInputChange(e)}
  />
  <label htmlFor ="password">Password</label>
</div>
<button type="submit" className="btn btn-primary w-100 mt-2">登入</button>
</form>
  </div>
 ):(
  //產品頁面

<div className="container">
  <h2>產品列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}>
          建立新的產品
        </button>
      </div>
          <table className="table">
            <thead>
              <tr>
                <th>分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.title}</td>
                  <td>{item.origin_price}</td>
                  <td>{item.price}</td>
                  <td className={item.is_enabled ? "text-success" : ""}>{item.is_enabled ? "啟用" : "未啟用"}</td>
                  <td>
                    <div className='btn-group' role='group' aria-label='Basic exampple'>
                      <button type='button' className='btn btn-outline-primary btn-sm'
                      onClick={() => openModal("edit", item)}>編輯</button>
                      <button type='button' className='btn btn-outline-danger btn-sm'
                      onClick={() => openDelModal(item)}>刪除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
)}
<div className="modal fade" id="productModal" tabIndex="-1" 
aria-labelledby="productModalLabel" aria-hidden="true"
ref={productModalRef}>
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="productModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
            <div className="modal-body">
        <div className="row">
          <div className="col-sm-4">
            <div className="mb-2">
              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">
                  輸入圖片網址
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  className="form-control"
                  placeholder="請輸入圖片連結"
                  value={tempProduct.imageUrl || ''}
                  onChange={(e)=>handleModalInputChange(e)}
                  />
              </div>
              {tempProduct.imageUrl && (
                <img className="img-fluid" 
                src={tempProduct.imageUrl} alt="主圖" />
              )}  
            </div>
            <div>
              {
              tempProduct.imagesUrl?.map(
                (url, index) => (   
                 <div key={index}>
					      <label htmlFor="imageUrl" className="form-label">
					        輸入圖片網址
					      </label>
					      <input
					        type="text"
					        className="form-control"
					        placeholder={`圖片網址${index + 1}`}
                  value={url}
                  onChange={(e)=>handleModalImageChange(index,e.target.value)}
					      />
                {
                url && 
					      <img
                  className="img-fluid"
                  src={url}
                  alt={`副圖${index + 1}`}
                />
                }
					    </div>
              ))
              }              
             
              <button className="btn btn-outline-primary btn-sm d-block w-100" onClick={handleAddImage}>
                新增圖片
              </button>
            </div>
            <div>
              <button className="btn btn-outline-danger btn-sm d-block w-100"
              onClick={handleRemoveImage}
              >
                刪除圖片
              </button>
            </div>
          </div>
          <div className="col-sm-8">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">標題</label>
              <input
                name="title"
                id="title"
                type="text"
                className="form-control"
                placeholder="請輸入標題"
                value={tempProduct.title}
                onChange={(e)=>handleModalInputChange(e)}
                />
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label htmlFor="category" className="form-label">分類</label>
                <input
                  name="category"
                  id="category"
                  type="text"
                  className="form-control"
                  placeholder="請輸入分類"
                  value={tempProduct.category}
                  onChange={(e)=>handleModalInputChange(e)}
                  />
              </div>
              <div className="mb-3 col-md-6">
                <label htmlFor="unit" className="form-label">單位</label>
                <input
                  name="unit"
                  id="unit"
                  type="text"
                  className="form-control"
                  placeholder="請輸入單位"
                  value={tempProduct.unit}
                  onChange={(e)=>handleModalInputChange(e)}
                  />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label htmlFor="origin_price" className="form-label">原價</label>
                <input
                  name="origin_price"
                  id="origin_price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="請輸入原價"
                  value={tempProduct.origin_price}
                  onChange={(e)=>handleModalInputChange(e)}
                  />
              </div>
              <div className="mb-3 col-md-6">
                <label htmlFor="price" className="form-label">售價</label>
                <input
                  name="price"
                  id="price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="請輸入售價"
                  value={tempProduct.price}
                  onChange={(e)=>handleModalInputChange(e)}
                  />
              </div>
            </div>
            <hr />

            <div className="mb-3">
              <label htmlFor="description" className="form-label">產品描述</label>
              <textarea
                name="description"
                id="description"
                className="form-control"
                placeholder="請輸入產品描述"
                value={tempProduct.description}
                onChange={(e)=>handleModalInputChange(e)}
                ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">說明內容</label>
              <textarea
                name="content"
                id="content"
                className="form-control"
                placeholder="請輸入說明內容"
                value={tempProduct.content}
                onChange={(e)=>handleModalInputChange(e)}
                ></textarea>
            </div>
            <div className="mb-3">
              <div className="form-check">
                <input
                  name="is_enabled"
                  id="is_enabled"
                  className="form-check-input"
                  type="checkbox"
                  checked={tempProduct.is_enabled}
                  onChange={(e)=>handleModalInputChange(e)}
                  />
                <label className="form-check-label" htmlFor="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          data-bs-dismiss="modal"
          onClick={() => closeModal()}
          >
          取消
        </button>
        <button type="button" className="btn btn-primary" onClick={() => modalType === 'create' ? addProduct() : editProduct(tempProduct.id)}>確認</button>
      </div>
    </div>
  </div>
</div>

<div
  className="modal fade"
  id="delProductModal"
  tabIndex="-1"
  aria-labelledby="delProductModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content border-0">
      <div className="modal-header bg-danger text-white">
        <h5 className="modal-title" id="delProductModalLabel">
          <span>刪除產品</span>
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        是否刪除
        <strong className="text-danger"> {tempProduct.title} </strong>
        (刪除後無法恢復)。
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          data-bs-dismiss="modal"
        >
          取消
        </button>
        <button 
          type="button" 
          className="btn btn-danger"
          onClick={handleConfirmDelete}
        >
          確認刪除
        </button>
      </div>
    </div>
  </div>
</div>
</>)};

export default App
