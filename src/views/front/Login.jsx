import { useState } from 'react';

import axios from "axios";
import { useForm } from "react-hook-form";   
import { useNavigate } from "react-router";
// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;





function Login(){
  //表單資料狀態(儲存使用者輸入的帳號密碼)
  // const [formData, setFormData] = useState({
  //  username: '',
  //  password: ''
  // });


  const naviigate = useNavigate();
  

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
   } = useForm({
     mode: "onChange",
     defaultValues: {
       username: 'scwu.ie99g@gmail.com',
       password: ''
     }
   });
 
  //控制顯示登入頁或是產品頁,預設為登入頁
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  //產品資料狀態
  //const [products, setProducts] = useState([]);
  //目前選的商品
  //const [selectedProduct, setSelectedProduct] = useState(null);
  
 // const [tempProduct, setTempProduct] = useState(null);


  //處理表單輸入變更
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   //console.log(name, value);
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };
  // const onSubmit = async(e) => {
    
  //   //console.log('表單提交', formData);
  //   //送出登入請求
  //   try{
  //     e.preventDefault();
  //     const response = await axios.post(`${API_BASE}admin/signin`, formData);
  //     //console.log('登入成功', response.data) ;
  //     document.cookie = `hexToken=${response.data.token}; expires=${new Date(response.data.expired)};`;
  //     axios.defaults.headers.common['Authorization'] = `${response.data.token}`;
  //     setIsLoggedIn (true);
  //     //登入成功後渲染產品清單
  //     getProducts ();

  //   } catch (error) {
  //     //console.error('登入失敗', error.response);
  //     alert('登入失敗，請檢查帳號密碼是否正確');
  //     setIsLoggedIn (false);
  //   }
  //   //setIsLoggedIn (true);
  // }

const onSubmit = async (data) => {
  try {
    //將 formData 改為從 hook form 傳進來的 data
    const response = await axios.post(`${API_BASE}admin/signin`, data);
    
    // 儲存 Token
    document.cookie = `hexToken=${response.data.token}; expires=${new Date(response.data.expired)};`;
    axios.defaults.headers.common['Authorization'] = `${response.data.token}`;
    naviigate('/admin/product'); // 登入成功後導向產品管理頁面
    //setIsLoggedIn(true);
    //getProducts(); // 登入成功後取得產品
    
  } catch (error) {
    alert('登入失敗，請檢查帳號密碼是否正確');
    //setIsLoggedIn(false);
  }
};

  //檢查是否登入
  // const checkLogin = async() => {
  //   try{
  //      const token = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("hexToken="))
  //     ?.split("=")[1];
  //     if (token) {
  //       axios.defaults.headers.common['Authorization'] = token;
  //     const response = await axios.post(`${API_BASE}api/user/check`);
  //     //console.log('驗證token', response.data);
  //     alert('目前已登入');
  //     setIsLoggedIn (true);
  //     }
      
  //   } catch (error) {
  //     //console.error('驗證token失敗', error.response?.data);
  //     alert('尚未登入，請重新登入');
  //     setIsLoggedIn (false);
  //   }
  // };

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
  <div className="container login">
    <h1>請輸入帳號密碼登入</h1>
    <form  className='form-flating' onSubmit={handleSubmit(onSubmit)}>
   <div className="form-floating mb-3">
  <input type="email" name="username" className="form-control" id="username" placeholder="name@example.com"  
   {...register("username", { required: "請輸入Email", pattern: { value: /^\S+@\S+$/i, message: "請輸入有效的Email地址" }, })} />
  {errors.username && <div className="text-danger">{errors.username.message}</div>}
  <label htmlFor="username">Email address</label>
</div>
<div className="form-floating">
  <input type="password" name='password' className="form-control" id="password" placeholder="Password" 
  
  {...register("password",{ required: "請輸入密碼", minLength: { value: 6, message: "密碼至少 6 個字" }, })} />
  {errors.password && <div className="text-danger">{errors.password.message}</div>}   
  
  <label htmlFor ="password">Password</label>
</div>
<button type="submit" className="btn btn-primary w-100 mt-2">登入</button>
</form>
  </div>
    )};
    
export default Login;
