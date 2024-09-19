import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from '../home-page/HomePage'
import ProductPage from '../product-page/ProductPage'
import OrderPage from '../order-page/OrderPage'
import OrderHistory from '../order-history/OrderHistory'
import LoginPage from '../admin-page/login-page/LoginPage'
import AdminHome from '../admin-page/admin-home/AdminHome'

export default function RouterPage() {
    return(
        <div className="RouterPage">
          <BrowserRouter>
            <Routes>
                <Route path ='/' element={<HomePage/>}></Route>
                <Route path ='/product/:productId' element={<ProductPage/>}></Route>
                <Route path ='/order' element={<OrderPage/>}></Route>
                <Route path ='/history/:email' element={<OrderHistory/>}></Route>
                <Route path='/admin/login' element={<LoginPage/>}></Route>
                <Route path='/admin/home' element={<AdminHome/>}></Route>
                {/* <PrivateRoute path="/admin/home" element={<AdminHome />} /> */}
                
            </Routes>
          </BrowserRouter>
        </div>
    )
}