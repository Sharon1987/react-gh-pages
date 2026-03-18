import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout.jsx";
import Home from "./views/front/Home.jsx";
import Products from "./views/front/Products.jsx";
import SingleProduct from "./views/front/SingleProduct.jsx";
import Cart from "./views/front/Cart.jsx";
import NotFound from "./views/front/NotFound.jsx";
import Checkout from "./views/front/Checkout.jsx";
import Login from "./views/front/Login.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminProducts from "./views/admiin/AdminProducts.jsx";
import AdminOrders from "./views/admiin/AdminOrders.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
export const router = createHashRouter([
    {  
        path: "/",
        element: <FrontendLayout />,
        children: [
            {    
                index: true,
                element: <Home />,
            },
            {
                path: "products",
                element: <Products />, 
            },
            {
               path: "product/:id",
                element: <SingleProduct />, 
            },
            {
                path:"cart",
                element:<Cart />,
            },
            {
                path:"checkout",
                element:<Checkout />,
            },
             {
                path:"login",
                element:<Login />,
            },

]
},
    {
    path: "/admin",
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
        {
            path: "product",
            element: <AdminProducts />
        },
        {
            path: "order",
            element: <AdminOrders />
        }
    ]
},
    {
    path: "*",
    element: <NotFound />,
}  
]);