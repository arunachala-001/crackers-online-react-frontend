import { useNavigate, useParams } from "react-router-dom";
import HeaderPage from "../home-page/HeaderPage";
import './ProductPage.css'
import '../home-page/HomePage.css'
import Offerimg from "../home-page/offer-tag.jpg"
import { fetchProductById } from "../APIs/Controller";
import { useEffect, useState } from "react";

export default function ProductPage() {
    const {productId} = useParams()
    const [product, setProduct] = useState([])
    const [selectedId, setSelectedId] = useState([])
    const [isOrderBtnDisabled, setIsOrderBtnDisabled] = useState(true)
    const navigate = useNavigate()
    const [popup, setPopup] = useState(false)
    const [email, setEmail] = useState("")

    function fetchProductsByCategoryId() {
        console.log(productId)
        fetchProductById(productId)
        .then(response =>{ 
            console.log(response.data)
            const mapToProduct = response.data.map((res) => ({
                id : res.id,
                productName : res.productName,
                productPrice : res.productPrice,
                orginalPrice : res.orginalPrice,
                description : res.description,
                discount : res.productDiscount,
                image : res.image.substring(8)
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
        // console.log("button Clicked at Id:"+ id)
        // navigate(`/order/${id}`)
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
    return (
        <div className="ProductPage">
            <HeaderPage handlePopup={handlePopup}></HeaderPage>
            <div className="banner" onClick={offPopUp}>
                <div className="search-box">
                  <img src={Offerimg} alt="offer-tag" className="offer-tag"/>  
                </div>
                {/* <div className="sort-box">
                  <label>Sort by price</label>
                  <select>
                     <option value="Default">Default</option>
                     <option value="Price">High to Low</option>
                     <option value="Price">Low to High</option>
                  </select>
                </div> */}
            
            </div>
            {popup && (
                <div className='popup-container'>
                  <input type='text' placeholder='Enter your email ID' value={email}
                  onChange={(e) => setEmail(e.target.value)}></input>
                  <button onClick={navigateToHistory}>OK</button>
                </div>
              )}
            <h2 style={{textDecoration:'underline'}} className="product-heading">List of Products</h2>

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
            <div className="footer-container" onClick={offPopUp}>
                 <h3>Enjoy Diwali with colourful and brightful celebrations🦚</h3>
                 <div className="footer-content-container">
                 <div className="terms-condition">
                    <h4>Terms & Conditions🧨</h4>
                    <p>1. 3% Packing charges will be charged extra</p>
                    <p>2. Goods will be dispatched on CASH & CARRY basic only</p>
                    <p>3. Return Goods cannot be taken</p>
                    <p>4. Lorry charges will be carried out extra</p>
                 </div>
                 <div className="signature">
                    <h3>Yours Faithfully</h3>
                    <h4>For VENKATA SAI TRADERS🎉</h4>
                 </div>
                 </div>
                 <h2 className="final-thanks">Wish you a safe and prosperous Diwali🎇</h2>
               </div>

        </div>
    )
}