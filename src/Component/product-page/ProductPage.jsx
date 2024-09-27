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

  //  ------------------Testing---------------------
  // const productTesting = [
  //     {
  //      id: 1,
  //      productName : "Baby Rockets",
  //      category: {
  //      id : 100,
  //      name : "Rockets"
  //      }
  //     },
  //     {
  //      id: 2,
  //      productName : "Bomb Rockets",
  //      category: {
  //      id : 100,
  //      name : "Rockets"
  //      }
  //     },
  //     {
  //      id: 3,
  //      productName : "Super Rockets",
  //      category: {
  //      id : 100,
  //      name : "Rockets"
  //      }
  //     },
  // ]
   

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
                category : res.category,
                image : res.image.substring(15)
            }))
            // setCategoryName(mapToProduct[0].category.name)
            return setProduct(mapToProduct)
        }) 
        .catch(error => console.log(error))
    }

    useEffect(
        () => fetchProductsByCategoryId(), []
    )

    function handleProduct(productId) {
      const storedIds = JSON.parse(localStorage.getItem('selectedProductIds')) || []
        setSelectedId((ids) => {
          const currentIds = [...new Set([...storedIds, ...ids])];
          // 
          const selectedProductIds = currentIds.includes(productId)
            ? currentIds.filter((id) => id !== productId)
            : [...currentIds, productId];
          localStorage.setItem('selectedProductIds', JSON.stringify(selectedProductIds));
          return selectedProductIds
        })
        
        setIsOrderBtnDisabled(setSelectedId <= 0)
        
        console.log(setSelectedId)
    }
    // function navigateToOrder() {
    //     if(selectedId.length >0) {
    //         navigate('/order/', {state : {productIds: selectedId}})
    //     }
    // }
    function handlePopup() {
        setPopup(true)
    }
    function offPopUp(){
        setPopup(false)
    }
    function navigateToHistory() {
        navigate(`/history/${email}`)
    }
    function navigateToCartPage() {
      navigate('/customer/cart')
    }
    function navigateToHome() {
      navigate('/')
    }
    return (
        <div className="ProductPage">
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
            <div className="navigate-tag">
              <button onClick={navigateToHome}>Home</button>
              {product.length > 0 && product[0].category ? (
            <h3>{'>'} {product[0].category.name}</h3>
             ) : (
            <h3>{'>'} ...</h3>
             )} 
            </div>
            <h2 style={{textDecoration:'underline'}} className="product-heading">List of Products</h2>
            
            <button className="cart-page" onClick={navigateToCartPage}>
               <img src="data:image/png;base64,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" alt="" />
            </button>

            {/* ------------------Testing--------------------------------- */}
            {/* <div className="product-container" onClick={offPopUp}>
                    <div className="products">
                       <img src={Offerimg} className="product-image"
                        alt="Green Sparkles"></img>
                        <hr />
                       <h2>Crackling Sparklers</h2>
                       <div className="price-tag">
                         <h4>Price : ₹90</h4>
                         <h3 className="orginal-price">₹350</h3>
                       </div>
                   <p>50cm 1 Box</p>
                   <p>Discount : 75%</p>
                   <button className="product-btn">Remove From cart </button>
                    </div>
                    <div className="products">
                       <img src={Offerimg} className="product-image"
                        alt="Green Sparkles"></img>
                        <hr />
                       <h2>Crackling Sparklers</h2>
                       <div className="price-tag">
                         <h4>Price : ₹90</h4>
                         <h3 className="orginal-price">₹350</h3>
                       </div>
                   <p>50cm 1 Box</p>
                   <p>Discount : 75%</p>
                   <button className="product-btn">Remove From cart </button>
                    </div>
                    <div className="products">
                       <img src={Offerimg} className="product-image"
                        alt="Green Sparkles"></img>
                        <hr />
                       <h2>Crackling Sparklers</h2>
                       <div className="price-tag">
                         <h4>Price : ₹90</h4>
                         <h3 className="orginal-price">₹350</h3>
                       </div>
                   <p>50cm 1 Box</p>
                   <p>Discount : 75%</p>
                   <button className="product-btn">Remove From cart</button>
                    </div>
            
            </div> */}
            {/* ----------------------------------------------------------------- */}

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
            {/* <div className="order-btn-container">
              <button onClick={navigateToOrder} disabled={isOrderBtnDisabled}
              style={{
                opacity: isOrderBtnDisabled ? 0.5 : 1, // Optional: Visual indication
                cursor: isOrderBtnDisabled ? 'not-allowed' :'pointer' ,
              }}
              className="order-btn">ORDER NOW</button>
            </div> */}
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