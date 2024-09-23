import { useEffect, useState } from 'react'
import './Admin.css'
import { createCategory, fetchAllInvoice, fetchAllOrders, updateOrderStatus } from '../AdminRouter'
import axios from 'axios'
import { fetchAllCategories } from '../../APIs/Controller'

export default function AdminHome() { 
    const [dashboardTag, setDashboardTag] = useState(true)
    const[editProductTag, SetEditProducttag] = useState(false)
    const [allOrdersTag, setAllOrdersTag] = useState(false)
    const [invoicesTag, setInvoicesTag] = useState(false)
    const [product, setProduct] = useState("")
    const[adminResponse, setAdminResponse] = useState("")
    const [category, setCategory] = useState("")
    const[categoryAdmin, setCategoryAdmin] = useState([])
    const [image, setImage] = useState(null)

    const [productName, setProductName] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [orginalPrice, setOrginalPrice] = useState("")
    const [description, setDescription] = useState("")
    const [productDiscount, setProductDiscount] = useState("")

    const[productResponse, setProductResponse] = useState("")
    const [orders, setOrders] = useState([])

    const [editCustomerResponse, setEditCustomerResponse] = useState([])

    const [filterStatus, setFilterStatus] = useState(false)
    const [customer, setCustomer] = useState([])
    const [filteredStatus,setFilteredStatus] = useState([])

    function retriveAllCategory() {
        fetchAllCategories()
        .then(response => {
            const categories = response.data.map((res) => ({
                id : res.categoryId,
                categoryName : res.categoryName,
                imageUrl : res.image.substring(8)
            }))
            return setCategoryAdmin(categories)
        })
        
        .catch(error => console.log(error))
       }

       useEffect(
        () => retriveAllCategory(), []
       )

       function handleOptionCategory(event) {
         setProduct(event.target.value)
       }

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

    function saveToProduct() {
        const formData = new FormData()
        formData.append('productRequest', new Blob([JSON.stringify({
            productName:productName,
            productPrice:productPrice,
            orginalPrice:orginalPrice,
            description: description,
            productDiscount: productDiscount 
        })], { type: 'application/json' } ))
        formData.append('image',image)
        const token = localStorage.getItem('token')
        console.log(token)
        axios.post(`http://localhost:8080/admin/store/${product}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Add token to headers
                },
        }).then(response => {
            setProductResponse(response.data)
        }).catch(error => console.log(error)).finally(()=> setProductName(""), 
        setProductPrice(""), setProductDiscount(""), setDescription(""),
        setOrginalPrice(""), setImage(null))
       
   
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
            if(filterStatus) {
                setCustomer(filteredStatus)
            } else {
                setCustomer(response.data)
            }
             
        }). catch(error => console.log(error))
    }

    useEffect(
        () => retrieveAllInvoiceswithCustomer(), []
    )

    function downloadInvoice(userId) {
        const token = localStorage.getItem('token')
        axios({
         url:`http://localhost:8080/invoice/download/${userId}`,
         method:"POST",
         responseType: "blob",
         headers : {
            'Authorization':`Bearer ${token}`,
         }
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

   function handleStatus(event) {
    const token = localStorage.getItem('token')
     if(event.target.value === "Pending" || event.target.value === "Completed") {
        const orderStatus = event.target.value
        setFilterStatus(true)
        axios.get(`http://localhost:8080/admin/customer-order/get/status/${orderStatus}`,{
            headers: {
                'Authorization':`Bearer ${token}`
            }
        }).then(response => {
            setFilteredStatus(response.data)
        }).catch(error => setFilterStatus(error.data))
     } else if(event.target.value === "All") {
        setFilterStatus(false)
     }
   }

   function editStatus(id, custDetails) {
       const token = localStorage.getItem('token')
       axios.put(`http://localhost:8080/admin/customer-order/status/${id}`, custDetails, {
        headers: {
            'Authorization':`Bearer ${token}`, // Add token to headers
        }
       })
       .then(response => {
        setEditCustomerResponse(response.data)
       }).catch(error => console.log(error)).finally(window.location.reload())
   }

    return (
        <div className="AdminHome">
            <h1 style={{fontSize:'8px', marginTop:'20px'}}>ADMIN PANEL</h1>
            <div style={{fontSize:'4px', color:'green'}}>{editCustomerResponse}</div>
            <div className="Option-Bar-Container">
                <div className='option-bar'>
                    <button onClick={handleDashboard}>Dashboad</button>
                    <button onClick={handleProducts}>Edit Products</button>
                    {/* <button onClick={handleOrders}>All Orders</button> */}
                    <button onClick={handleInvoices}>Invoices</button>
                </div>
            
            
            
            {dashboardTag && (
                <div className='dashboard-container'>
                    <div className='upper-btn'>
                        <button onClick={handleProducts}>ADD/EDIT PRODUCTS</button>
                    </div>
                    <div className='lower-btn'>
                        <button onClick={handleOrders}>ALL ORDERS</button>
                        <button onClick={handleInvoices}>INVOICES</button>
                    </div>
                 
                </div>
            )}
            {editProductTag && (
                <div className='edit-container'>
                <h1>Category</h1>
                <div className='category-edit-container'>
                    <div className='category-edit'>
                        <label htmlFor="">Category Name:</label>
                        <input type="text" value={category} 
                        onChange={(e) => setCategory(e.target.value)} />  
                     </div>
                    <div className='category-edit'>
                        <label>Upload Image</label> 
                        <input type="file" name="image"
                         onChange={(e)=>setImage(e.target.files[0])}
                         accept="image/*" /></div>
                    </div>
                  <button onClick={saveTocategory} className='category-edit-btn'>Save</button>
                  
                  <div style={{color:'green', fontSize:'6px', fontStyle:'italic'}}>
                    {adminResponse}
                  </div>
                  <hr></hr>
                  <h1>ADD Products</h1>
                  <div>
                     <select className='select-box-admin' onChange={handleOptionCategory}>
                        {categoryAdmin.map((c) => (
                          <option key={c.id} value={c.categoryName}>{c.categoryName}</option>    
                        ))}
                        
                     </select>
                  </div>
                  <div style={{color:'green', fontSize:'6px', fontStyle:'italic'}}>{productResponse}</div>
                  
                  <div className='edit-product-container'>
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

                     <label>Upload Image</label> 
                     <input type="file" name="image"
                     onChange={(e)=>setImage(e.target.files[0])}
                     accept="image/*" />

                     <button className='product-save-btn' onClick={saveToProduct}>SAVE</button>
                </div>
          </div>
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
                <div style={{position:'fixed', top:'2%', left:'70%', width:'30px'}}><select onChange={handleStatus}>
                    <option value="Pending" style={{fontSize:'5px'}}>Pending</option>
                    <option value="Completed" style={{fontSize:'5px'}}>Completed</option>
                    <option value="All" style={{fontSize:'5px'}}>All</option>
                </select></div>
                
                <table className='table'>
                    <thead>
                        <tr>
                         <th>Customer Name</th>
                         <th>Order Status</th>
                         <th>Edit Status</th>
                         <th>View Invoice</th>
                        </tr>   
                    </thead>
                        <tbody> 
                            {customer.map((c) => (
                              <tr key={c.id}>
                               <td>{c.firstName} {c.lastName}</td>
                              <td>{c.orderStatus}</td>
                               {/* <td>Pending</td> */}
                               <td><button onClick={() =>
                                 editStatus(c.id,
                                  {firstName: c.firstName,
                                   lastName: c.lastName,
                                   orderStatus: "Completed" 
                                  })} style={{backgroundColor:'green', color:'white'}}>Mark as completed</button></td>
                               <td><button onClick={() =>downloadInvoice(c.id)}>Invoice</button></td>
                              </tr>
                           ))}
                           
                          
                        </tbody>
                    
                </table>
                 
                </>
            )}
            </div>
        </div>
    )
}