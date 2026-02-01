import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayut.jsx";
import Home from "./views/front/Home.jsx";
import Products from "./views/front/Products.jsx";
import SingleProduct from "./views/front/SingleProduct.jsx";
import Cart from "./views/front/Cart.jsx";
import NotFound from "./views/front/NotFound.jsx";



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

]
},{
    path: "*",
    element: <NotFound />,
}  
]);