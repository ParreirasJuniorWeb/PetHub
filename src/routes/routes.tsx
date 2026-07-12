import { createBrowserRouter } from "react-router-dom";

// Pages
import Home from "../pages/Home/Home";
import Cart from "../pages/Cart/Cart";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Checkout from "../pages/Checkout/Checkout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ErrorRoutes from "../pages/ErrorRoutes/ErrorRoutes";
import { Profile } from "../pages/Profile/Profile";

// Layout
import { Layout } from "../layout/layout";

// Private Component
import { PrivateRoute } from "../components/common/PrivateRoute";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <ErrorRoutes />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/",
                element: (
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                ),
            },
            {
                path: "/cart",
                element: (
                    <PrivateRoute>
                        <Cart />
                    </PrivateRoute>
                ),
            },
            {
                path: "/products",
                element: (
                    <PrivateRoute>
                        <Products />
                    </PrivateRoute>
                ),
            },
            {
                path: "productDetails/:id",
                element: (
                    <PrivateRoute>
                        <ProductDetails />
                    </PrivateRoute>
                ),
            },
            {
                path: "/checkout",
                element: (
                    <PrivateRoute>
                        <Checkout />
                    </PrivateRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                ),
            },
        ],
    },
]);