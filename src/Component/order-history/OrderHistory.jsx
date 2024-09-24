import { useNavigate, useParams } from "react-router-dom"
import { fetchOrdersbyEmailId } from "../APIs/Controller"
import { useEffect, useState } from "react"
import axios from "axios"
import './OrderHistory.css'

export default function OrderHistory() {
    const {email} = useParams()
    const navigate = useNavigate()

    const [orderHistory, setOrderHistory] = useState([])

    function retrieveOrdersbyEmailId() {
        console.log(email)
        fetchOrdersbyEmailId(email)
        .then(response => {
           console.log(response.data)
           setOrderHistory(response.data)
        }).catch(error => console.log(error))
    }
    useEffect(
        () => retrieveOrdersbyEmailId(), []
    )

    function downloadInvoice(userId) {
        axios({
         url:`https://sivakasi-crackers.onrender.com/invoice/download/${userId}`,
         method:"POST",
         responseType: "blob"
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download","invoice.pdf")
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link)
        }).catch(error => console.log(error))
    }
    function navigateToHome() {
       navigate('/')
    }

    return (
        <div className="OrderHistory">

        {/* ----------------------Testing----------------------------- */}
        {/* <div className="order-background"></div>
            <button onClick={navigateToHome} className="back-btn">Back</button>
            <h1 className="history-heading">Your Orders</h1>
            <div className="history-container">
                    <div className="history">
                        <h3>Product Name - Electric Sparkles</h3>
                        <h3>Product Price - ₹50</h3>
                        <h3>Description - 30cm 1 Box</h3>
                        <h3>Quantity - 9</h3>
                        <h3>Total - ₹300</h3>
                        <h3>Orderd On - 2024-09-30</h3>
                        <hr />
                        <h3>Product Name - Electric Sparkles</h3>
                        <h3>Product Price - ₹50</h3>
                        <h3>Description - 30cm 1 Box</h3>
                        <h3>Quantity - 9</h3>
                        <h3>Total - ₹300</h3>
                        <h3>Orderd On - 2024-09-30</h3>
                        <hr />
                        <h3>Product Name - Electric Sparkles</h3>
                        <h3>Product Price - ₹50</h3>
                        <h3>Description - 30cm 1 Box</h3>
                        <h3>Quantity - 9</h3>
                        <h3>Total - ₹300</h3>
                        <h3>Orderd On - 2024-09-30</h3>
                        <hr />
                        <h3>Product Name - Electric Sparkles</h3>
                        <h3>Product Price - ₹50</h3>
                        <h3>Description - 30cm 1 Box</h3>
                        <h3>Quantity - 9</h3>
                        <h3>Total - ₹300</h3>
                        <h3>Orderd On - 2024-09-30</h3>
                        <hr />
                   <button className="history-btn">Your Invoice</button>

                    </div>
                    <div className="history">
                        <h3>Product Name - Electric Sparkles</h3>
                        <h3>Product Price - ₹50</h3>
                        <h3>Description - 30cm 1 Box</h3>
                        <h3>Quantity - 9</h3>
                        <h3>Total - ₹300</h3>
                        <h3>Orderd On - 2024-09-30</h3>
                        <hr />
                        <h3>Product Name - Electric Sparkles</h3>
                        <h3>Product Price - ₹50</h3>
                        <h3>Description - 30cm 1 Box</h3>
                        <h3>Quantity - 9</h3>
                        <h3>Total - ₹300</h3>
                        <h3>Orderd On - 2024-09-30</h3>
                        <hr />
                        </div>
                    
           </div>  */}
        {/* -------------------------------------------------------------- */}
            <div className="order-background"></div>
            <button onClick={navigateToHome} className="back-btn">Back</button>
            <h1 className="history-heading">Your Orders</h1>
            <div className="history-container">
            {orderHistory.map((customer) => (
                <div key={customer.id}>
                    <div className="history">
                     {customer.orderedProductList.map((o) =>(
                        <div key={o.id}>
                        <h3>Product Name - {o.productName}</h3>
                        <h3>Product Price - ₹{o.productPrice}</h3>
                        <h3>Description - {o.description}</h3>
                        <h3>Quantity - {o.quantity}</h3>
                        <h3>Total - ₹{o.total}</h3>
                        <h3>Orderd On - {o.orderedDate}</h3>
                        <hr />
                     </div>
                   ))}
                   <button className="history-btn"
                    onClick={() =>downloadInvoice(customer.id)}>Your Invoice</button>
                    </div>
                   
                </div>
            ))}
           </div> 
        </div>
    )
}