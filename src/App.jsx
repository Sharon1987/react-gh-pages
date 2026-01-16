import { useState } from 'react';

import axios from "axios";
import "./assets/style.css";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;





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
  
  const [tempProduct, setTempProduct] = useState(null);


  //處理表單輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //console.log(name, value);
    setFormData({
      ...formData,
      [name]: value,
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
  //檢查是否登入
  const checkLogin = async() => {
    try{
       const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
      if (token) {
        axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.post(`${API_BASE}api/user/check`);
      //console.log('驗證token', response.data);
      alert('目前已登入');
      setIsLoggedIn (true);
      }
      
    } catch (error) {
      //console.error('驗證token失敗', error.response?.data);
      alert('尚未登入，請重新登入');
      setIsLoggedIn (false);
    }
  };

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
  }

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
 <div className='container'>
  <button
  className="btn btn-danger mb-5"
  type="button"
  onClick={() => checkLogin()}
>確認是否登入
</button>
<div className="container">
      <div className="row mt-5">
        <div className="col-md-6">
          <h2>產品列表</h2>
          <table className="table">
            <thead>
              <tr>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>查看細節</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.origin_price}</td>
                  <td>{item.price}</td>
                  <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => setTempProduct(item)}
                    >
                      查看細節
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h2>單一產品細節</h2>
          {tempProduct ? (
            <div className="card mb-3">
              <img
                src={tempProduct.imageUrl}
                className="card-img-top primary-image"
                alt="主圖"
              />
              <div className="card-body">
                <h5 className="card-title">
                  {tempProduct.title}
                  <span className="badge bg-primary ms-2">
                    {tempProduct.category}
                  </span>
                </h5>
                <p className="card-text">商品描述：{tempProduct.description}</p>
                <p className="card-text">商品內容：{tempProduct.content}</p>
                <div className="d-flex">
                  <p className="card-text text-secondary">
                    <del>{tempProduct.origin_price}</del>
                  </p>
                  元 / {tempProduct.price} 元
                </div>
                <h5 className="mt-3">更多圖片：</h5>
                <div className="d-flex flex-wrap">
                  {/*這裡加上點擊更多圖片時,切換商品圖。 先檢查 imagesUrl 陣列，再進行 map */}
                  {tempProduct.imagesUrl?.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      className="img-thumbnail me-2"
                      style={{ width: "100px", cursor: "pointer" }}
                      alt={`副圖 ${index + 1}`}
                      // 點擊後保留tempProduct內容，覆蓋新的 imageUrl
                      onClick={() =>
                        setTempProduct({ ...tempProduct, imageUrl: url })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-secondary">請選擇一個商品查看</p>
          )}
        </div>
      </div>
    </div>
 </div>
)
}
</>)};

export default App
