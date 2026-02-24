import { Outlet,Link } from "react-router";

function FrontendLayout() {
  return (
    <>
    <header>
      <nav className="mt-5">
          <Link className="h4 mt-5 mx-2" to="/">
            首頁
          </Link>
          <Link className="h4 mt-5 mx-2" to="/products">
            產品頁面
          </Link>
          <Link className="h4 mt-5 mx-2" to="/cart">
            購物車
          </Link>
          <Link className="h4 mt-5 mx-2" to="/checkout">
            結帳
          </Link>
          <Link className="h4 mt-5 mx-2" to="/login">
            登入
          </Link>
        </nav>
    </header>
    <main className="py-4">
      <div><Outlet /></div>
        
    </main>
    <footer className="bg-light text-center py-4 mt-auto">
     
    </footer>   
    </>
  )}    

  export default FrontendLayout;