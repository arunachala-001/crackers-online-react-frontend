import { useLocation, useNavigate, useParams } from "react-router-dom"
import { fetchProductsForOrder, placeOrderBackend, saveCustomerinDB } from "../APIs/Controller"
import { useEffect, useState } from "react"
import axios from "axios"
import './OrderPage.css'
import { BounceLoader } from 'react-spinners';
// import backgrd from './background-3.png'


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
    const [userId, setUserId] = useState("")

    const [quantityResponse, setQuantitResponse] = useState("")
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [address, setAddress] = useState("")
    const [pinCode, setPincode] = useState("")

    const [totalPrice, setTotalPrice] = useState(0)
    const [savedPrice, setSavedPrice] = useState(0)

    // const TestingData = [
    //   {
    //          id: 1,
    //          productName : "Baby Rockets",
    //          productPrice:200,
    //          orginalPrice:450,
    //          category: {
    //          id : 100,
    //          name : "Rockets"
    //          }
    //         },
    //         {
    //          id: 2,
    //          productName : "Bomb Rockets",
    //          productPrice:200,
    //          orginalPrice:450,
    //          category: {
    //          id : 100,
    //          name : "Rockets"
    //          }
    //         },
    //         {
    //          id: 3,
    //          productName : "Super Rockets",
    //          productPrice:200,
    //          orginalPrice:450,
    //          category: {
    //          id : 100,
    //          name : "Rockets"
    //          }
    //         },
    // ]

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
                  image : res.image.substring(15)
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
                } else {
                  setOrderResponse("Order Failed, Try again !")
                }
             }).finally(() => setLoading(false))
           }
           catch(error){
               console.log(error)
           }      
       }    
    }

    const handleQuantityChange = (productId, value) => {
      if(value === "" || isNaN(value) || parseInt(value, 10)<=0) {
        setQuantitResponse("Please Add Quantity")
        setTimeout(() => setQuantitResponse(''), 10000);
      }
        // setQuantity(prevQuantities => ({
        //     ...prevQuantities,
        //     [productId]: parseInt(value, 10)
        // }));
        setQuantity(prevQuantities => {
          const newQuantities = {
            ...prevQuantities,
            [productId]: parseInt(value, 10)
          };
         const newTotalPrice = TestingData.reduce((total, o) => {
          const qty = newQuantities[o.id] || 1;
          return total+(qty*o.productPrice)
         }, 0);
         setTotalPrice(newTotalPrice)

         const newSavedPrice = TestingData.reduce((saved, o) => {
          const qty = quantity[o.id] || 1;
          const orginalPrice= saved+(qty*o.orginalPrice);
          return orginalPrice;
        }, 0);
        setSavedPrice(newSavedPrice - newTotalPrice)

        return newQuantities;
      });
    };

    function handleQuantityDecrease(productId) {
      setQuantity((prev) => {
        const newQuantities = {
          ...prev,
          [productId]:Math.max(0, Number(prev[productId] || 1)-1)
        };

        const newTotalPrice = order.reduce((total, o) => {
          const qty = newQuantities[o.id] || 1;
          return total+(qty*o.productPrice)
        }, 0)
        setTotalPrice(newTotalPrice)

        const newSavedPrice = order.reduce((saved, o) => {
          const qty = newQuantities[o.id] || 1;
          return saved+ (qty*o.orginalPrice);
        }, 0)
        setSavedPrice(newSavedPrice-newTotalPrice)

        return newQuantities;
      });
      // setQuantity((prev) => ({
      //   ...prev,
      //   [productId]:Math.max(0,(prev[productId])-1)
      // }))
      // setQuantity((prev) => {
      //   const currentQuantity = Number(prev[productId] || 1)
      //  return {
      //   ...prev,
      //   [productId]:Math.max(0,currentQuantity-1)
      //  } 
      // })
      
    }

    function handleQuantityIncrease(productId) {
      // setQuantity((prev) => ({
      //   ...prev,
      //   [productId] : (prev[productId])+1
      // }))
      // setQuantity((prev) => ({
      //   ...prev,
      //   [productId] : (Number(prev[productId] || 1))+1
      // }))

      setQuantity((prev) => {
        const newQuantities = {
          ...prev,
          [productId] : (Number(prev[productId] || 1))+1
        }
        const newTotalPrice = order.reduce((total, o) => {
          const qty = newQuantities[o.id] || 1;
          return total+(qty*o.productPrice)
        }, 0)
        setTotalPrice(newTotalPrice)

        const newSavedPrice = order.reduce((saved, o) => {
          const qty = newQuantities[o.id] || 1;
          return saved+ (qty*o.orginalPrice);
        }, 0)
        setSavedPrice(newSavedPrice-newTotalPrice)

        return newQuantities;
      })
    }

    useEffect(
      () => {
        const initialTotalPrice = order.reduce((total, o) => {
          const qty = quantity[o.id] || 1;
          return total+(qty*o.productPrice);
        }, 0);
        setTotalPrice(initialTotalPrice)

        const initialSavedPrice = order.reduce((saved, o) => {
          const qty = quantity[o.id] || 1;
          const orginalPrice= saved+(qty*o.orginalPrice);
          return orginalPrice;
        }, 0);
        setSavedPrice(initialSavedPrice - initialTotalPrice)
      }, [order, quantity]
    )
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
                    setUserResponse("Something went wrong, try again!")
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
        setOrderTrue(false)
    }

    function navigateToHome() {
      navigate('/')
    }

    // function handleTesting(value) {
    //   if(value <=0) {
    //     setQuantitResponse("Cant be blank")
    //     setTimeout(() => setQuantitResponse(''), 10000);
    //   }
    // }
    return (
        <div className="OrderPage">
            <div className="background-order"></div> 
            <div className="back-btn-order">
              <button onClick={navigateToHome}>Back</button>
            </div>
            <h1 className="Order-Tittle">Order Details</h1>
            <div className="cost-container">
              <div className="cost-title"><h3>Total Cost Estimation</h3></div>
              <div className="cost">
                <h4>Total Price : <div className="total-price">₹{totalPrice}</div></h4>
                <p>You Saved : <div className="saved-price">₹{savedPrice}</div></p>
              </div>
            
            </div>
            <div className="quantity-response">
              <p >{quantityResponse}</p>
            </div>
            <div className="order-container" onClick={closeCustomerTab}>
            {order && order.map((o) => (
                <div key={o.productId}>
                    <div className="orders">
                       <img src={`https://sivakasi-crackers.onrender.com/image/${o.image}`}
                       className="order-image" alt={o.productName}></img>
                    
                    <hr />
                   <h2>{o.productName}</h2>
                   <label style={{color:'#43b873'}}>Qty</label>
                   <div className="quantity-container">
                     <button onClick={()=>handleQuantityDecrease(o.productId)}>-</button>
                     <input type="number" value={quantity[o.productId] || 1} className="quantity-field"
                      onChange={(e)=>handleQuantityChange(o.productId,e.target.value)} required></input>
                     <button onClick={()=>handleQuantityIncrease(o.productId)}>+</button>
                   </div>
                   
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
                  <p style={{fontStyle:'italic', fontWeight:'bold', color:'#07b441', fontSize:'10px', letterSpacing:'1px'}} className="order-response">{orderResponse}</p>
                  <div style={{display:'flex', justifyContent:'center'}}>
                  <button htmlFor="" style={{textDecoration:'underline', marginRight:'20px'}} onClick={downloadInvoice}>Download Invoice</button>
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
                              <button onClick={closeCustomerTab}>
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAYFBMVEX/QUH/////NTX/8/P/7e3/MDD/+Pj/ODj/c3P/Pj7/Ozv/a2v/f3//dXX/cXH/eHj/Y2P/paX/ycn/W1v/nJz/r6//VVX/4eH/T0//l5f/KSn/hob/1tb/q6v/s7P/5ubwMLtpAAAD/ElEQVR4nO1c25arIAxVFFCrrdVetPby/385WusUNbbiAOacxX6bNYNs4yaEkInj9vHI9nFeOMZQ5PE+ewxIOOIPLIsLQnlojpPjhJySIs7YBCnvnl7MEnoTu+R3DyJ1DaJoDUYtojC4jkndOF+PUgPObwNS7EBX+XAiQloykRSL6dqUGtCYCaRKFJxqVuWb1A0Jp5rVrSN1jVbXU4eQX1tSXrDyuhPBA+9J6o7GTg3Ce0OK5Sv6zDGinNWkssvaPPq4ZDWpGJGiGvDYdR4FKknVoioeTkbWZjEEyZw9GsfZge4dbJJqROXkyCRViyp3DMbjc4GQkoWFhYWFhcUnRDUWxjlhM1YtmxYkPRzL06KQkJ/K4yHVEHfz2K8P1OdkQfRMknM91Fcf49KqzdKwVJoVzV9DK8XHAV51mVI/lvwMZOd3ed5Kqa1o9c7eehspVmTzzrAqtRWvxIyylK1I7AtDFdqKxL0sd22r2S9MU683lFWK1mCU+m4fXjLz0STxBkP9VI2/ig7uEDN1Jeqpw0ERqePoyfN01dfTC0dFpMrxo13/u63IBuDklmqkHp7OwMO9b76djvTU4HxSlCbgCQMe73/27XS0PBqwRJ1PyMEJPumK7CA7fXkROVB4imldwXry1N62SE4i/RILWcXw5wCnIaCePNmtfAYrWLhbYCKyhV7A0xHl0QC01Xg58S1opyXh4XdM6Go3MMDEulOtp9/poG3D9ftfkIB2kg4NJVgBG2ytKzGSoRvI0UoGhpKsAtAM70iGw38w/MRqMQzaXoYIXpPC627BYUOS1Q4yxaM1BdkNC0SedtJ/aw7r6hkh04lfGbj9IaCt6jU4se706qkDrCuWptC6066nDrBJPNBnQtuQLlYQAYhoYPA2kYO6GtvJjJ46kC0koAHAEEIrK3B37tvJhC/og37TlaZY5TPIFnLfv3iY1LjACgycOjuZ1bjAalpXK+ipA51ag2y7YmEBfJrQc0b4p0lh/HwYhY7RJXCEzhM+MIu2Mr/NYNyQMYYus4M8g8VZ88PhubcAKjjhOzhgPGLJHkb1JYEETgiP7RgTHBhTQST5kjSb0JVOz4AxvYgxEYsxZT2R3B+HTQaT+3+/BlFvK4wXRlN6WvNqDeMlJMbrWowX2yhLABQXS/zPZSUoC3AwliqNi7rmL2xtRV04y99wFgriLKnEWXyKs0wXZ0Hzs/R7aecCbaXfFhYWFhYWFvqA8H+2C5z/cI+yNQHKJg4ZOlIkw9kYBGULFZzNZlC25XHvqEi1DYxwtnpC2RQLZ/sw1z0gYSU2WsPZkg5l875GVxG6NofNGkxCdA0hcbbOdNsmo9R8k1H6ocnoE2u0Y70Oi1F+APnRM7Q8XJNxAAAAAElFTkSuQmCC" alt="" />
                              </button>
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

            {/* ---------------------Testing--------------------------- */}
            {/* <div className="quantity-response">
              <p >{quantityResponse}</p>
            </div>
            <div className="cost-container">
              <div className="cost-title"><h3>Total Cost Estimation</h3></div>
              <div className="cost">
                <h4>Total Price : <div className="total-price">₹{totalPrice}</div></h4>
                <p>You Saved : <div className="saved-price">₹{savedPrice}</div></p>
              </div>
            
            </div>
            
            <div className="order-container">
                   {TestingData.map((o) => (
                    <div key={o.id}>
                         <div className="orders">
                          <img src={backgrd}
                           className="order-image" alt="Crackling Sparkles"></img>
                          <hr />
                          <h2>{o.productName}</h2>
                          <label style={{color:'#43b873'}}>Qty</label>
                          <div className="quantity-container">
                            <button onClick={()=>handleQuantityDecrease(o.id)}>-</button>
                            <input type="number" className="quantity-field" onChange={(e)=>handleQuantityChange(o.id,e.target.value)}
                            value={quantity[o.id] || 1} required></input>
                            <button onClick={()=>handleQuantityIncrease(o.id)}>+</button>
                          </div>

                          <h4>{o.productPrice}</h4>
                          <h4>{o.orginalPrice}</h4>
                          <p>30cm 1 Box</p>
                        </div>
                    </div>
                   ))}        
            </div> */}
            {/* <button onClick={testOrder}>Order</button> */}
            {/* ------------Customer------------------ */}
            {/* <div className="form-container">
              
            <div className="close-btn-container">
                        <button>
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAYFBMVEX/QUH/////NTX/8/P/7e3/MDD/+Pj/ODj/c3P/Pj7/Ozv/a2v/f3//dXX/cXH/eHj/Y2P/paX/ycn/W1v/nJz/r6//VVX/4eH/T0//l5f/KSn/hob/1tb/q6v/s7P/5ubwMLtpAAAD/ElEQVR4nO1c25arIAxVFFCrrdVetPby/385WusUNbbiAOacxX6bNYNs4yaEkInj9vHI9nFeOMZQ5PE+ewxIOOIPLIsLQnlojpPjhJySIs7YBCnvnl7MEnoTu+R3DyJ1DaJoDUYtojC4jkndOF+PUgPObwNS7EBX+XAiQloykRSL6dqUGtCYCaRKFJxqVuWb1A0Jp5rVrSN1jVbXU4eQX1tSXrDyuhPBA+9J6o7GTg3Ce0OK5Sv6zDGinNWkssvaPPq4ZDWpGJGiGvDYdR4FKknVoioeTkbWZjEEyZw9GsfZge4dbJJqROXkyCRViyp3DMbjc4GQkoWFhYWFhcUnRDUWxjlhM1YtmxYkPRzL06KQkJ/K4yHVEHfz2K8P1OdkQfRMknM91Fcf49KqzdKwVJoVzV9DK8XHAV51mVI/lvwMZOd3ed5Kqa1o9c7eehspVmTzzrAqtRWvxIyylK1I7AtDFdqKxL0sd22r2S9MU683lFWK1mCU+m4fXjLz0STxBkP9VI2/ig7uEDN1Jeqpw0ERqePoyfN01dfTC0dFpMrxo13/u63IBuDklmqkHp7OwMO9b76djvTU4HxSlCbgCQMe73/27XS0PBqwRJ1PyMEJPumK7CA7fXkROVB4imldwXry1N62SE4i/RILWcXw5wCnIaCePNmtfAYrWLhbYCKyhV7A0xHl0QC01Xg58S1opyXh4XdM6Go3MMDEulOtp9/poG3D9ftfkIB2kg4NJVgBG2ytKzGSoRvI0UoGhpKsAtAM70iGw38w/MRqMQzaXoYIXpPC627BYUOS1Q4yxaM1BdkNC0SedtJ/aw7r6hkh04lfGbj9IaCt6jU4se706qkDrCuWptC6066nDrBJPNBnQtuQLlYQAYhoYPA2kYO6GtvJjJ46kC0koAHAEEIrK3B37tvJhC/og37TlaZY5TPIFnLfv3iY1LjACgycOjuZ1bjAalpXK+ipA51ag2y7YmEBfJrQc0b4p0lh/HwYhY7RJXCEzhM+MIu2Mr/NYNyQMYYus4M8g8VZ88PhubcAKjjhOzhgPGLJHkb1JYEETgiP7RgTHBhTQST5kjSb0JVOz4AxvYgxEYsxZT2R3B+HTQaT+3+/BlFvK4wXRlN6WvNqDeMlJMbrWowX2yhLABQXS/zPZSUoC3AwliqNi7rmL2xtRV04y99wFgriLKnEWXyKs0wXZ0Hzs/R7aecCbaXfFhYWFhYWFvqA8H+2C5z/cI+yNQHKJg4ZOlIkw9kYBGULFZzNZlC25XHvqEi1DYxwtnpC2RQLZ/sw1z0gYSU2WsPZkg5l875GVxG6NofNGkxCdA0hcbbOdNsmo9R8k1H6ocnoE2u0Y70Oi1F+APnRM7Q8XJNxAAAAAElFTkSuQmCC" alt="" />
                        </button>
            </div>
                          <div className="customer-container">
                            
                           <div className="forms">
                             <label>First Name    :</label>
                             <input type="text"></input>
                           </div>
                           <div className="forms">
                             <label>Last Name     :</label>
                             <input type="text"></input>
                           </div>
                           <div className="forms">
                             <label>Email Address :</label>
                             <input type="text"></input>
                           </div>
                           <div className="forms">
                             <label>Mobile Number :</label>
                             <input type="text"></input>
                           </div>
                           <div className="forms">
                             <label>Address       :</label>
                             <input type="box"></input>
                           </div>

                           <div className="forms">
                             <label>Pin Code      :</label>
                             <input type="text"></input>
                           </div>
                           
                         </div>
                         <div className="submit-btn-container">
                            <button>SUBMIT</button>
                        </div>

            </div> */}

            {/* <div className="form-container">

            <p style=
            {{fontStyle:'italic', alignSelf:'center', fontWeight:'bold', color:'#07b441', fontSize:'10px', letterSpacing:'1px'}}
             className="customer-response">User Saved Successfully</p>
            <button className="close-btn" onClick={() => setCustomer(false)}>Close</button>
            </div> */}
            {/* <div className="order-response-container">
                <p style={{fontStyle:'italic', fontWeight:'bold', color:'#07b441'}} className="order-response">Order Placed Succeefully</p>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <button htmlFor="" style={{textDecoration:'underline', marginRight:'20px'}}>Download Invoice</button>
                </div>     
            </div> */}
                 

            {/* -------------------------------------------------------------- */}

        </div>
    )

    
}