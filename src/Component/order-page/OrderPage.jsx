import { useLocation, useParams } from "react-router-dom"
import { fetchProductsForOrder, placeOrderBackend, saveCustomerinDB } from "../APIs/Controller"
import { useEffect, useState } from "react"
import axios from "axios"
import './OrderPage.css'

export default function OrderPage() {
    // const {id} = useParams()
    const location = useLocation();
    const [loading, setLoading] = useState(false)
    const {productIds} = location.state || {}
    const [order, setOrder] = useState([])
    const [quantity, setQuantity] = useState({})
    const [orderResponse, setOrderResponse] = useState([])
    const [customer, setCustomer] = useState(false)
    const [orderTrue, setOrderTrue] = useState(false)
    const [userResponse, setUserResponse] = useState("")
    const [imageUrl, setImageUrl] = useState([])
    const [userId, setUserId] = useState("")

    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [address, setAddress] = useState("")
    const [pinCode, setPincode] = useState("")

    function retrieveProductsForOrder() {
        console.log(productIds)
        fetchProductsForOrder(productIds)
        .then(response => {
            console.log(response.data)
            setLoading(true)
            const mapToproduct = response.data.map((res) => (
                {
                  productId : res.id,
                  productName : res.productName,
                  productPrice: res.productPrice,
                  orginalPrice : res.orginalPrice,
                  description : res.description,
                  productDiscount: res.productDiscount,
                  image : res.image.substring(8)
                }
            ))
            return setOrder(mapToproduct)
        })
        
        .catch(error => console.log(error))
        .finally(setLoading(false))
    }
    useEffect(
        () => retrieveProductsForOrder(),[]
    )

    const placeOrder = async() =>{
       if(!userResponse) {
        setCustomer(true)
       } else {
       const orderRequest= order.map((o) => ({
             productName: o.productName,
             productId: o.productId,
             productPrice: o.productPrice,
             orginalPrice: o.orginalPrice,
             description: o.description,
             productDiscount: o.productDiscount,
             quantity: quantity[o.productId]
                
        }))
        try {
             await placeOrderBackend(userId, orderRequest)
             .then(response => {
                setOrderResponse(response.data)
                if(response.status ===200 || response.status ===201) {
                    setOrderTrue(true)
                }
             })
           }
           catch(error){
               console.log(error)
           }      
       }    
    }

    const handleQuantityChange = (productId, value) => {
        setQuantity(prevQuantities => ({
            ...prevQuantities,
            [productId]: value
        }));
    };

    const saveCustomer = async () => {
        const CustomerData = {
            firstName : FirstName,
            lastName : LastName,
            emailAddress : email,
            phoneNumber : mobile,
            address : address,
            pinCode : pinCode
        };
        try {
             await saveCustomerinDB(CustomerData)
            .then(response => {
                console.log(response)
                if(response.status === 200 || response.status ===201) {
                    setUserResponse(response.data)
                    setUserId(response.data.substring(33))
                    // setCustomerSaved(true)
                } else {
                    setUserResponse(response.data)
                }                
            })           
        } catch (error) {
            console.log(error)
        }
    }

    function downloadInvoice() {
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

    function closeCustomerTab() {
        setCustomer(false)
    }
    return (
        <div className="OrderPage">
            
            <h1>Order Details</h1>
            <div className="product-container" onClick={closeCustomerTab}>
            {order && order.map((o) => (
                <div key={o.productId}>
                    <div className="products">
                       <img src={`http://localhost:8080/image/${o.image}`}
                       className="product-image" alt={o.productName}></img>
                    
                    <hr />
                   <h2>{o.productName}</h2>
                   <label style={{color:'#43b873'}}>Select Quantity</label>
                   <input type="number" value={quantity[o.productId]}
                   onChange={(e)=>handleQuantityChange(o.productId,e.target.value)}></input>
                   <h4>Price :₹{o.productPrice}</h4>
                   <p>{o.description}</p>
                   </div>
                </div>
            ))}
            </div>
            <div className="order-btn-container">
              <button onClick={placeOrder}
              className="order-btn">PLACE ORDER</button>
            </div>
            {orderTrue && (
                <>
                <div className="order-response-container">
                  <p style={{fontStyle:'italic'}}>{orderResponse}</p>
                  <div style={{display:'flex', justifyContent:'center'}}>
                  <label htmlFor="" style={{textDecoration:'underline', marginRight:'20px'}}>Download Invoice</label>
                  <button onClick={downloadInvoice}>
                    <img  className="download-icon"
                    src="data:image/png;base64,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" alt="" />
                  </button>
                  </div>
                  
                </div>
                 
                </>
            )}
            {customer && (
                <div className="form-container">
                    {userResponse ? (
                        <>
                          <p style={{fontStyle:'italic', alignSelf:'center'}}>{userResponse}</p>
                          <button className="close-btn" onClick={() => setCustomer(false)}>Close</button>
                        </>
                    ) : (
                        <>
                        <div className="close-btn-container">
                              <button onClick={closeCustomerTab}>Close</button>
                            </div>
                          <div className="customer-container">
                            
                           <div className="forms">
                             <label>First Name    :</label>
                             <input type="text" value={FirstName} 
                           onChange={(e) =>setFirstName(e.target.value)}></input>
                           </div>
                           <div className="forms">
                             <label>Last Name     :</label>
                             <input type="text" value={LastName}
                           onChange={(e) => setLastName(e.target.value)}></input>
                           </div>
                           <div className="forms">
                             <label>Email Address :</label>
                             <input type="text" value={email}
                           onChange={(e)=> setEmail(e.target.value)}></input>
                           </div>
                           <div className="forms">
                             <label>Mobile Number :</label>
                             <input type="text" value={mobile}
                              onChange={(e)=> setMobile(e.target.value)}></input>
                           </div>
                           <div className="forms">
                             <label>Address       :</label>
                             <input type="box" value={address}
                             onChange={(e) => setAddress(e.target.value)}></input>
                           </div>

                           <div className="forms">
                             <label>Pin Code      :</label>
                             <input type="text" value={pinCode}
                             onChange={(e) => setPincode(e.target.value)}></input>
                           </div>
                           
                         </div>
                         <div className="submit-btn-container">
                            <button onClick={saveCustomer}>SUBMIT</button>
                        </div>
                        </>
                    )}
                </div>
            )}

            

        </div>
    )
}