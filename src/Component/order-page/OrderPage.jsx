import { useLocation, useParams } from "react-router-dom"
import { fetchProductsForOrder, placeOrderBackend, saveCustomerinDB } from "../APIs/Controller"
import { useEffect, useState } from "react"
import axios from "axios"

export default function OrderPage() {
    // const {id} = useParams()
    const location = useLocation();
    const {productIds} = location.state || {}
    const [order, setOrder] = useState([])
    const [quantity, setQuantity] = useState({})
    const [orderResponse, setOrderResponse] = useState([])
    const [customer, setCustomer] = useState(false)
    const [customerSaved, setCustomerSaved] = useState(false)
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
                    setCustomerSaved(true)
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
            <div onClick={closeCustomerTab}>
            <h1>Order Details</h1>
            {order && order.map((o) => (
                <div key={o.productId}>
                <img src={`http://localhost:8080/image/${o.image}`} alt={o.productName}></img>
                   <h3>{o.productName}</h3>
                   <label>Select Quantity</label>
                   <input type="number" value={quantity[o.productId]}
                   onChange={(e)=>handleQuantityChange(o.productId,e.target.value)}></input>
                   <h4>Price :₹{o.productPrice}</h4>
                   <h4>{o.description}</h4>
                   <h4>Orginal Price: ₹{o.orginalPrice}</h4>
                   <h4>{o.productDiscount}%</h4>
                </div>
            ))}
            </div>
            
            <button onClick={placeOrder}>Place Order</button>
            {orderResponse && (
                <>
                 <p>{orderResponse}</p>
                 <button onClick={downloadInvoice}>Download Invoice</button>
                </>
            )}
            {customer && (
                <div>
                    {userResponse ? (
                        <>
                          <p>{userResponse}</p>
                          <button onClick={() => setCustomer(false)}>Close</button>
                        </>
                    ) : (
                        <>
                          <div className="customer-container">
                           {/* <button onClick={signedInUser}>Already an User?</button> */}
                           <label>First Name :</label>
                           <input type="text" value={FirstName} 
                           onChange={(e) =>setFirstName(e.target.value)}></input>

                           <label>Last Name :</label>
                           <input type="text" value={LastName}
                           onChange={(e) => setLastName(e.target.value)}></input>

                           <label>Email Address :</label>
                           <input type="text" value={email}
                           onChange={(e)=> setEmail(e.target.value)}></input>

                           <label>Mobile Number :</label>
                           <input type="text" value={mobile}
                           onChange={(e)=> setMobile(e.target.value)}></input>

                           <label>Address :</label>
                           <input type="text" value={address}
                           onChange={(e) => setAddress(e.target.value)}></input>

                           <label>Pin Code :</label>
                           <input type="text" value={pinCode}
                           onChange={(e) => setPincode(e.target.value)}></input>

                           <button onClick={saveCustomer}>SUBMIT</button>
                           <button onClick={closeCustomerTab}>Close</button>
                         </div>
                        </>
                    )}
                </div>
            )}

            

        </div>
    )
}