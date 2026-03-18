import { Outlet,Link } from "react-router";

function AdminLayout() {
  return (
    <>
    <header>
      <nav className="mt-5">
          <Link className="h4 mt-5 mx-2" to="/">
            首頁
          </Link>
          <Link className="h4 mt-5 mx-2" to="/admin/product">
            後台產品管理
          </Link>
          <Link className="h4 mt-5 mx-2" to="/admin/order">
            後台訂單管理
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

  export default AdminLayout;