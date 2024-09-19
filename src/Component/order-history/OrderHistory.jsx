import { useParams } from "react-router-dom"
import { fetchOrdersbyEmailId } from "../APIs/Controller"
import { useEffect, useState } from "react"
import axios from "axios"

export default function OrderHistory() {
    const {email} = useParams()

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
         url:`http://localhost:8080/invoice/download/${userId}`,
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

    return (
        <div className="OrderHistory">
            <h1>Your Orders</h1>
            {orderHistory.map((customer) => (
                <div key={customer.id}>
                   {customer.orderedProductList.map((o) =>(
                    <div key={o.id}>
                      <h3>{o.productName}</h3>
                      <h3>{o.productPrice}</h3>
                      <h3>{o.description}</h3>
                      <h3>{o.quantity}</h3>
                      <h3>{o.total}</h3>
                      <h3>{o.orderedDate}</h3>
                    </div>
                   ))}
                   <button onClick={() =>downloadInvoice(customer.id)}>Your Invoice</button>
                </div>
            ))}
        </div>
    )
}