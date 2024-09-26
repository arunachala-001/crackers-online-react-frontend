import { useNavigate } from "react-router-dom";
import { fetchProductById } from "../APIs/Controller";
import '../home-page/HomePage.css'
import Offerimg from "../home-page/offer-tag.jpg"
import '../product-page/ProductPage.css'
import { useEffect, useState } from "react";
import HeaderPage from "./HeaderPage";

export default function CartPage() {
    const [product, setProduct] = useState([])
    const [selectedId, setSelectedId] = useState([])
    const [isOrderBtnDisabled, setIsOrderBtnDisabled] = useState(true)
    const navigate = useNavigate()
    const [popup, setPopup] = useState(false)
    const [email, setEmail] = useState("")

    function fetchProductsByCategoryId() {
        const storedIds = localStorage.getItem('selectedProductIds');
        console.log(storedIds)
        fetchProductById(storedIds)
        .then(response =>{ 
            console.log(response.data)
            const mapToProduct = response.data.map((res) => ({
                id : res.id,
                productName : res.productName,
                productPrice : res.productPrice,
                orginalPrice : res.orginalPrice,
                description : res.description,
                discount : res.productDiscount,
                image : res.image.substring(15)
            }))
            return setProduct(mapToProduct)
        }) 
        .catch(error => console.log(error))
    }

    useEffect(
        () => fetchProductsByCategoryId(), []
    )

    function handleProduct(productId) {
        setSelectedId((ids) => 
          ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId]
        )
        
        setIsOrderBtnDisabled(setSelectedId <= 0)
        
        console.log(setSelectedId)
    }
    function navigateToOrder() {
        if(selectedId.length >0) {
            navigate('/order/', {state : {productIds: selectedId}})
        }
    }
    function handlePopup() {
        setPopup(true)
    }
    function offPopUp(){
        setPopup(false)
    }
    function navigateToHistory() {
        navigate(`/history/${email}`)
    }

    return(
        <div className="CartPage">
            <HeaderPage handlePopup={handlePopup}></HeaderPage>
            <div className="banner" onClick={offPopUp}>
                <div className="search-box">
                  <img src={Offerimg} alt="offer-tag" className="offer-tag"/>  
                </div>
            </div>
            {popup && (
                <div className='popup-container'>
                  <input type='text' placeholder='Enter your email ID' value={email}
                  onChange={(e) => setEmail(e.target.value)}></input>
                  <button onClick={navigateToHistory}>OK</button>
                </div>
              )}
            <h2 style={{textDecoration:'underline'}} className="product-heading">List of Carts</h2>

            <div className="product-container" onClick={offPopUp}>
            {product.map(p => (
                <div key={p.id}>
                    <div className="products">
                       <img src={`https://sivakasi-crackers.onrender.com/image/${p.image}`} className="product-image"
                        alt={p.productName}></img>
                    <hr />
                   
                   <h2>{p.productName}</h2>
                   <div className="price-tag">
                      <h4>Price : ₹{p.productPrice}</h4>
                      <h3 className="orginal-price">₹{p.orginalPrice}</h3>
                   </div>
                   <p>{p.description}</p>
                   <p>Discount : {p.discount}%</p>
                   <button className="product-btn"
                    style={{
                        backgroundColor: selectedId.includes(p.id) ? '#cf0000' : '#a29a00',
                      }}
                    onClick={() => handleProduct(p.id)}>{selectedId.includes(p.id)? 'Remove From Cart': 'Add to Cart'}</button>
                    </div>    
                    
                </div>
            ))}
            
            </div>
            <div className="order-btn-container">
              <button onClick={navigateToOrder} disabled={isOrderBtnDisabled}
              style={{
                opacity: isOrderBtnDisabled ? 0.5 : 1, // Optional: Visual indication
                cursor: isOrderBtnDisabled ? 'not-allowed' :'pointer' ,
              }}
              className="order-btn">ORDER NOW</button>
            </div>

        </div>
    )
}