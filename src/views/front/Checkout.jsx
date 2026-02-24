import { useState,useEffect } from "react"; 
import axios from "axios";
import { currency } from "../../utils/filter";
import { useForm } from "react-hook-form";    


const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH; 

function Checkout () {
  const [cart, setCart] = useState({});

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
   } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log("表單資料", data);
    // 這裡可以進行表單驗證或是送出訂單的 API 請求
    reset(); // 重置表單
  }

  

// 取得購物車列表
const getCart = async () => {
  try {
    const url = `${API_BASE}api/${API_PATH}/cart`;
    const response = await axios.get(url);
    setCart(response.data.data);
  } catch (error) {
    console.log(error.response.data);
  }
};


//刪除單一品項
const removeCartItem = async (id) => {
  try {
    const url = `${API_BASE}api/${API_PATH}/cart/${id}`;
    const response = await axios.delete(url);
    alert(response.data.message); // 顯示「已刪除品項」
    getCart(); // 💡 重點：刪除成功後，一定要重新取得列表，畫面才會更新！
  } catch (error) {
    console.error("刪除失敗", error);
    alert("刪除失敗，請稍後再試");
  }
};

//清空購物車
const deleteAllCart = async () => {
if (!window.confirm("確定要清空所有商品嗎？")) return;
  try {
    const url = `${API_BASE}api/${API_PATH}/carts`; // 注意這裡通常是複數 carts
    const response = await axios.delete(url);
    alert(response.data.message);
    getCart(); // 重新取得列表（這時會變空陣列）
  } catch (error) {
    console.error("清空失敗", error);
    alert("清空失敗");
  }
};

// 更新商品數量
const updateCart = async (cartId, productId, qty = 1) => {
  try {
    const url = `${API_BASE}/api/${API_PATH}/cart/${cartId}`;

    const data = {
      product_id: productId,
      qty,
    };
    await axios.put(url, { data });
    getCart();
  } catch (error) {
    console.log(error.response.data);
  }
};
  useEffect(() => {
    getCart();
  }, []);

  

  return (
    <div>
      <h1>購物車頁</h1>
      <div className="container">
  <h2>購物車列表</h2>
  <div className="text-end mt-4">
    <button type="button" className="btn btn-outline-danger" onClick={deleteAllCart}>
      清空購物車
    </button>
  </div>
  <table className="table">
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">品名</th>
        <th scope="col">數量/單位</th>
        <th scope="col">小計</th>
      </tr>
    </thead>
    <tbody>
      {
      cart?.carts?.map(cartItem  => (
        <tr key={cartItem.id}>
          <td>
            <button type="button" className="btn btn-outline-danger btn-sm" 
            onClick={() => removeCartItem(cartItem.id)}>
              刪除
            </button>
          </td>
         <th scope="row">{cartItem.product?.title}</th>
    <td><div className="input-group input-group-sm mb-3">
      <input
        type="number"
        className="form-control"
        aria-label="Sizing example input"
        aria-describedby="inputGroup-sizing-sm"
        min="1" defaultValue={cartItem.qty}
        //value={cartItem.qty}
        onChange={(e) => updateCart(cartItem.id, cartItem.product.id, parseInt(e.target.value))}
      />/{cartItem.product?.unit}
      </div>
    </td>
    <td className="text-end">{currency(cartItem.total)}</td>
  </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td className="text-end" colSpan="3">
          總計
        </td>
        <td className="text-end">{currency(cart.final_total)}</td>
      </tr>
    </tfoot>
  </table>

      </div>
      <div className="my-5 row justify-content-center">
          <form className="col-md-6">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" className="form-control" placeholder="請輸入 Email" 
              {...register("email",
                {
                  required: "Email 是必填項目",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email 格式不正確",
                  },
                })} />
              {errors.email && <div className="text-danger">{errors.email.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">收件人姓名</label>
              <input id="name" name="姓名" type="text" className="form-control" placeholder="請輸入姓名" 
              {...register("name", { required: "請輸入收件人姓名",
                minLength: { value: 2, message: "姓名至少 2 個字" },
              })} />
            {errors.name && <div className="text-danger">{errors.name.message}</div>} 
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">收件人電話</label>
              <input id="tel" name="電話" type="tel" className="form-control" placeholder="請輸入電話" 
              {...register("tel", {
                required: "請輸入收件人電話",
                minLength: { value: 8, message: "電話至少 8 碼" },
                pattern: {
                  value: /^\d+$/,
                  message: "電話僅能輸入數字",
                },
              })} />
              {errors.tel && <div className="text-danger">{errors.tel.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">收件人地址</label>
              <input id="address" name="地址" type="text" className="form-control" placeholder="請輸入地址" 
              {...register("address", { required: "地址 是必填項目" })} />
              {errors.address && <div className="text-danger">{errors.address.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">留言</label>
              <textarea id="message" className="form-control" cols="30" rows="10" {...register("message")}></textarea>
              {errors.message && <div className="text-danger">{errors.message.message}</div>}
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">送出訂單</button>
            </div>
          </form>
        </div>
    </div>


    
  );
}



export default Checkout;