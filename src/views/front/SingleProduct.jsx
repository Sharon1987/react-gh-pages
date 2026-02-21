import { useLocation,useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH; 
function SingleProduct() {
  // const location = useLocation();
  // const product = location.state?.productData.product;
  // if (!product) {
  //   return <div>沒有可用的產品資料。</div>;
  // }
const { id } = useParams();
const [product, setProduct] = useState();

  useEffect(() => {
    const handleViewMore = async(id) => {
    try {
      const response = await axios.get(`${API_BASE}api/${API_PATH}/product/${id}`);
      //console.log('取得單一產品資料', response.data);
      setProduct(response.data.product);
     // navigate(`product/${id}`, { state: { productData: response.data.product } });

      
    } catch (error) {
      console.error('取得單一產品資料失敗', error.response);
    }
  };
  handleViewMore(id);}, [id]);

  const addCart = async(id,qty=1) => {
    try {
      const data ={ product_id: id, qty: qty };

      const response = await axios.post(`${API_BASE}api/${API_PATH}/cart`, {data});
      console.log('加入購物車成功', response.data);
      alert('已加入購物車');
    } catch (error) {
      console.error('加入購物車失敗', error.response);
      alert('加入購物車失敗');
    } };

if (!product) {
    return <div className="container mt-4">載入中...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={product?.imageUrl} 
          className="card-img-top"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">
            {product.description}
          </p>
          <p className="card-text">
            <strong>分類:</strong> {product.category}
          </p>
          <p className="card-text">
            <strong>單位:</strong> {product.unit}
          </p>
          <p className="card-text">
            <strong>原價:</strong> {currency(product.origin_price)} 元
          </p>
          <p className="card-text">
            <strong>現價:</strong> {currency(product.price)} 元
          </p>
          <button className="btn btn-primary" onClick={() => addCart(product.id)}>立即購買</button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;