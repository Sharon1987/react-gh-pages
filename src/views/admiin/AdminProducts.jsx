//後台管理
import { useEffect, useState,useRef } from 'react';

import axios from "axios";
import * as bootstrap from 'bootstrap';

import ProductModal from '../../components/ProductModal';
import DeleteProductModal from '../../components/DeleteProductModal';
import Pagination from '../../components/Pagination';
//import { createAsyncMessage } from '../../slice/messageSlice';
import { useDispatch } from 'react-redux';
import useMessage from '../../hooks/useMessage';

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


function AdminProducts(){
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

  //商品列表分頁用
  const [pagination, setPagination] = useState({});
  
  const dispatch=useDispatch();
  const { showSuccess, showError  } = useMessage();
 

  useEffect(() => {
  // 從 Cookie 取出 Token 並設定給 Axios
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexToken="))
    ?.split("=")[1];

  if (token) {
    axios.defaults.headers.common.Authorization = token;
    // 確定有 Token 後，執行抓取產品清單
    getProducts();
  }
}, []); // 空陣列表示只在進入頁面時執行一次


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
    setIsLoggedIn (true);
  }
  

  //取得產品清單
  const getProducts = async(page=1) => {
    try{
      const response = await axios.get(`${API_BASE}api/${API_PATH}/admin/products?page=${page}`);
      //console.log('取得產品清單', response.data.products);
      //console.log('res', response);
      //setProducts(response.data.products);
      setProducts(Object.values(response.data.products));
      setPagination(response.data.pagination);
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.response?.data?.message || '取得產品清單失敗');
      //dispatch(createAsyncMessage(error.response.data));
      //console.error('取得產品清單失敗', error.response);
    }
  };

  //新增商品
  const addProduct = async () => {
    try {
     const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`,{ data: tempProduct });
     //console.log('準備送出的資料：', tempProduct); // 檢查 price 是否為數字
     //console.log('新增商品成功', response.data);
      //alert('新增商品成功');
      showSuccess(response.data.message);
      getProducts();
      closeModal();
    } catch (error) {
      //alert('新增商品失敗');
      showError(error.response?.data?.message || '新增商品失敗');
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
      //alert('編輯商品成功');
      showSuccess(response.data.message);
      //dispatch(createAsyncMessage(response.message));
     
    getProducts(); // 重新取得列表
    closeModal();  // 關閉視窗
  } catch (error) {
    //console.error('編輯商品失敗', error.response?.data?.message);
    showError(error.response.data.message || '編輯商品失敗');
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
    showSuccess("產品刪除成功");
    //alert("刪除成功");
    getProducts(); 
    delProductModalRef.current.hide(); // 關閉刪除視窗
  } catch (error) {
    //console.error("刪除失敗", error.response);
    showError(error.response?.data?.message || "刪除失敗");
    // alert("刪除失敗");
  }
};

return (
<>
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
          <Pagination pagination={pagination} onChangePage={getProducts}/>
<ProductModal 
  modalType={modalType}
  tempProduct={tempProduct} 
  handleModalInputChange={handleModalInputChange}
  handleModalImageChange={handleModalImageChange}
  handleAddImage={handleAddImage}
  handleRemoveImage={handleRemoveImage}
  addProduct={addProduct}
  editProduct={editProduct}
  closeModal={closeModal}
  productModalRef={productModalRef}
/>
<DeleteProductModal 
  DeleteProductModal={delProductModalRef}
  tempProduct={tempProduct}
  handleConfirmDelete={handleConfirmDelete}
/>

</div>
</>
)
};

export default AdminProducts;
