import { useLocation, useNavigate, useParams } from "react-router-dom"
import { fetchProductsForOrder, placeOrderBackend, saveCustomerinDB } from "../APIs/Controller"
import { useEffect, useState } from "react"
import axios from "axios"
import './OrderPage.css'
import { BounceLoader } from 'react-spinners';


export default function OrderPage() {
    // const {id} = useParams()
    const navigate = useNavigate()
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
        .finally(() =>setLoading(false))
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
        setLoading(true)
        try {
             await placeOrderBackend(userId, orderRequest)
             .then(response => {
                
                setOrderResponse(response.data)
                if(response.status ===200 || response.status ===201) {
                    setOrderTrue(true)
                }
             }).finally(() => setLoading(false))
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
            pinCode : pinCode,
            orderStatus: "Pending"
        };
        setLoading(true)
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
            }).finally(() => setLoading(false))           
        } catch (error) {
            console.log(error)
        }
    }

    function downloadInvoice() {
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

    function closeCustomerTab() {
        setCustomer(false)
    }

    function navigateToHome() {
      navigate('/')
    }
    return (
        <div className="OrderPage">
            <div className="background-order"></div> 
            <h1 className="Order-Tittle">Order Details</h1>
            <div className="back-btn">
              <button onClick={navigateToHome}>Back</button>
            </div>
            <div className="order-container" onClick={closeCustomerTab}>
            {order && order.map((o) => (
                <div key={o.productId}>
                    <div className="orders">
                       <img src={`https://sivakasi-crackers.onrender.com/image/${o.image}`}
                       className="order-image" alt={o.productName}></img>
                    
                    <hr />
                   <h2>{o.productName}</h2>
                   <label style={{color:'#43b873'}}>Select Quantity</label>
                   <input type="number" value={quantity[o.productId]} className="quantity-field"
                   onChange={(e)=>handleQuantityChange(o.productId,e.target.value)}></input>
                   <h4>Price :₹{o.productPrice}</h4>
                   <p>{o.description}</p>
                   </div>
                </div>
            ))}
            </div>
            <div className="order-final-btn-container">
              <button onClick={placeOrder}
              className="order-final-btn">PLACE ORDER</button>
            </div>
            {orderTrue && (
                <>
                <div className="order-response-container">
                  <p style={{fontStyle:'italic', fontWeight:'bold', color:'#07b441'}} className="order-response">{orderResponse}</p>
                  <div style={{display:'flex', justifyContent:'center'}}>
                  <button htmlFor="" style={{textDecoration:'underline', marginRight:'20px'}} onClick={downloadInvoice}>Download Invoice</button>
                  {/* <button onClick={downloadInvoice}>
                    <img  className="download-icon"
                    src={downloadIcon} alt="" />
                  </button> */}
                  </div>
                  
                </div>
                 
                </>
            )}
            {loading ? (
                 <div className="loading-order-style">
                 <BounceLoader></BounceLoader>
               </div>
            ) : (
                 <div></div>
            )}
              
            
            {customer && (
                <div className="form-container">
                    {userResponse ? (
                        <>
                          <p style={{fontStyle:'italic', alignSelf:'center', fontWeight:'bold', color:'#07b441'}} className="customer-response">{userResponse}</p>
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