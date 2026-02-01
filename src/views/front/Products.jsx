import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;


//上一頁和下一頁
function SomeComponent() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // 提交成功後跳轉
    navigate("/success");

    // 更換當前歷史記錄
    navigate("/login", { replace: true });

    // 回上一頁
    navigate(-1);

    // 傳遞 state 資料
    navigate("/result", {
      state: { message: "操作成功" },
    });
  };

  return <button onClick={handleSubmit}>提交</button>;
}



function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  //取得產品清單
  const getProducts = async(page=1) => {
    try{
      const response = await axios.get(`${API_BASE}api/${API_PATH}/products/all`);
      //console.log('取得產品清單', response.data.products);
      //console.log('res', response);
      //setProducts(response.data.products);
      setProducts(Object.values(response.data.products));
      setPagination(response.data.pagination);
    } catch (error) {
      //console.error('取得產品清單失敗', error.response);
    }
  };
  const handleViewMore = async(id) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      //console.log('取得單一產品資料', response.data);
      navigate(`/product/${id}`, { state: { productData: response.data } });      

      
    } catch (error) {
      console.error('取得單一產品資料失敗', error.response);
    }
  }
  useEffect(() => {
   getProducts();
  }, []);
  
  return (<>
  <div className="container mt-4">
  <div className="row">
    {products.map((product) => (
      <div className="col-md-4 mb-3" key={product.id}>
        <div className="card">
          <img height={400} width={300}
            src={product.imageUrl}
            className="card-img-top"
            alt={product.title}
          />
          <div className="card-body" style={{ maxHeight: '350px' ,minHeight:'350px'}}>
            <h5 className="card-title">{product.title}</h5>
            <p className="card-text">
              {product.description}
            </p>
            <p className="card-text">
              <strong>價格:</strong> {product.price} 元
            </p>
            <p className="card-text">
              <small className="text-muted">單位: {product.unit}</small>
            </p>
            <button
              className="btn btn-primary"
              onClick={() => handleViewMore(product.id)}
            >
              查看更多
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  </>);
}

export default Products;