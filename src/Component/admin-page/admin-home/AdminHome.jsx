import { useEffect, useState } from 'react'
import './Admin.css'
import { createCategory, fetchAllInvoice, fetchAllOrders } from '../AdminRouter'
import axios from 'axios'

export default function AdminHome() {
    const [dashboardTag, setDashboardTag] = useState(true)
    const[editProductTag, SetEditProducttag] = useState(false)
    const [allOrdersTag, setAllOrdersTag] = useState(false)
    const [invoicesTag, setInvoicesTag] = useState(false)

    const[adminResponse, setAdminResponse] = useState("")
    const [category, setCategory] = useState("")
    const [image, setImage] = useState(null)

    const [productName, setProductName] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [orginalPrice, setOrginalPrice] = useState("")
    const [description, setDescription] = useState("")
    // const [productName, setProductName] = useState("")
    const [productDiscount, setProductDiscount] = useState("")

    const [orders, setOrders] = useState([])

    const [invoice, setInvoice] = useState([])
    const [customer, setCustomer] = useState([])

    function saveTocategory() {
        const formData = new FormData()
        formData.append('categoryRequest', new Blob([JSON.stringify({ categoryName: category })], { type: 'application/json' }));
        formData.append('image', image);
        const token = localStorage.getItem('token')
        console.log(token)
        axios.post('http://localhost:8080/admin/store/category', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Add token to headers
                },
        })
        .then(response => {
            if(response.status === 200 || response.status === 201) {
                setAdminResponse(response.data)
            }
            console.log(response.data)

        }).catch(error => console.log(error))
    }
    function retrieveAllOrders() {
        const token = localStorage.getItem('token')
        axios.get('http://localhost:8080/admin/all-orders', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`, // Add token to headers
            },
        })
       .then(response => {
        setOrders(response.data)
        console.log(response.data)
       })
    }
    useEffect(
     () => retrieveAllOrders(),[]
    )

    function retrieveAllInvoiceswithCustomer() {
        const token = localStorage.getItem('token')
        axios.get('http://localhost:8080/admin/customers', {
            headers: {
                'Authorization':`Bearer ${token}`, // Add token to headers
            }
        })
        .then(response => {
             setCustomer(response.data)
        }). catch(error => console.log(error))
    }

    useEffect(
        () => retrieveAllInvoiceswithCustomer(), []
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

   function handleDashboard() {
    console.log(localStorage.getItem('token'))
    setDashboardTag(true)
    setAllOrdersTag(false)
    setInvoicesTag(false)
    SetEditProducttag(false)
   }
   function handleProducts() {
    setDashboardTag(false)
    setAllOrdersTag(false)
    setInvoicesTag(false)
    SetEditProducttag(true)
   }
   function handleOrders() {
    setDashboardTag(false)
    setAllOrdersTag(true)
    setInvoicesTag(false)
    SetEditProducttag(false)
   }
   function handleInvoices() {
    setDashboardTag(false)
    setAllOrdersTag(false)
    setInvoicesTag(true)
    SetEditProducttag(false)
   }

    return (
        <div className="AdminHome">
            <h1>Welcome</h1>
            <div className="Option-Bar">
            <button onClick={handleDashboard}>Dashboad</button>
            <button onClick={handleProducts}>Add/Remove Products</button>
            <button onClick={handleOrders}>All Orders</button>
            <button onClick={handleInvoices}>Invoices</button>
            </div>
            
            {dashboardTag && (
                <>
                 <button onClick={handleProducts}>ADD/EDIT PRODUCTS</button>
                 <button onClick={handleOrders}>ALL ORDERS</button>
                 <button onClick={handleInvoices}>INVOICES</button>
                </>
            )}
            {editProductTag && (
                <>
                {/* <button>Add Category</button>
                <button>Add Products</button> */}
                <h1>Category</h1>
                 <label htmlFor="">Category Name:</label>
                 <input type="text" value={category} 
                 onChange={(e) => setCategory(e.target.value)} />  

                 <label htmlFor="">Upload Image</label> 
                 <input type="file" name="image"
                  onChange={(e)=>setImage(e.target.files[0])}
                  accept="image/*" />

                  <button onClick={saveTocategory}>Save</button>
                  {adminResponse}
                  <hr></hr>
                  <h1>ADD Products</h1>
                  <label htmlFor="">Product Name:</label>
                  <input type="text" value={productName}
                  onChange={(e) => setProductName(e.target.value)}/>

                  <label htmlFor="">Product Price:</label>
                  <input type="text" value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}/>

                  <label htmlFor="">Orginal Price:</label>
                  <input type="text" value={orginalPrice}
                  onChange={(e) => setOrginalPrice(e.target.value)}/>

                  <label htmlFor="">Description:</label>
                  <input type="box" value={description}
                  onChange={(e) => setDescription(e.target.value)}/>

                  <label htmlFor="">Discount:</label>
                  <input type="text" value={productDiscount}
                  onChange={(e) => setProductDiscount(e.target.value)}/>
                </>
            )}
            {allOrdersTag && (
                <>
                <table>
                    <thead>
                        <tr>
                           <th>Product Name</th>
                           <th>Product Price</th>
                           <th>Quantity</th>
                           <th>Created Date</th>
                           <th>Status</th>
                           <th>Customer Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                         <div key={o.id}>
                          <td>{o.productName}</td>
                          <td>{o.productPrice}</td>
                          <td>{o.quantity}</td>
                          <td>Pending</td>
                          <td>{o.orderedDate}</td>
                          {/* <td>{o.customer.firstName} {o.customer.lastName}</td> */}
                         </div>
                        ))}
                    </tbody>

                </table>
                   
                </>
            )}
            {invoicesTag && (
                <>
                <table>
                    <thead>
                        <th>Customer Name</th>
                        <th>Phone No</th>
                        <th>Email ID</th>
                        <th>Address</th>
                        <th>Pin Code</th>
                        <th>Edit Status</th>
                        <th>Your Invoice</th>
                
                        <tbody>
                           {customer.map((c) => (
                            <div key={c.id}>
                              <td>{c.firstName} {c.lastName}</td>
                              <button onClick={() =>downloadInvoice(c.id)}>Your Invoice</button>
                            </div>
                           ))}
                        </tbody>
                    </thead>
                </table>
                 
                </>
            )}
        </div>
    )
}