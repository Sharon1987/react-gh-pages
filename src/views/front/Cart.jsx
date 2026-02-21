import { useState,useEffect } from "react"; 
import axios from "axios";
import { currency } from "../../utils/filter";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH; 


function Cart () {
  const [cart, setCart] = useState({});

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
    </div>
  );
}



export default Cart;