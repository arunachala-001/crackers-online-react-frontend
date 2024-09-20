import HeaderPage from "./HeaderPage";
import background from "./Diwali.png"
import offerTag from './offer-tag.jpg'
import './HomePage.css'
import { useEffect, useState } from "react";
import { fetchAllCategories } from "../APIs/Controller";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
   const[category, setCategory] = useState([])
   const navigate = useNavigate()

   const [popup, setPopup] = useState(false)  
   const [email, setEmail] = useState()

   function retriveAllCategory() {
    fetchAllCategories()
    .then(response => {
        console.log(response.data)
        const categories = response.data.map((res) => ({
            id : res.categoryId,
            categoryName : res.categoryName,
            imageUrl : res.image.substring(8)
        }))
        return setCategory(categories)
    })
    
    .catch(error => console.log(error))
   }

   useEffect(
    () => retriveAllCategory(),[]
   )

   function navigateToProduct(productId) {
      navigate(`/product/${productId}`)
      console.log(productId)
   }

   function handlePopup() {
    setPopup(true)
  }

  function navigateToHistory() {
    navigate(`/history/${email}`)
  }

  function offPopUp(){
    setPopup(false)
  }

    return (
        <div className="HomePage">
            <HeaderPage handlePopup={handlePopup}></HeaderPage>
            <div>
            <div className="Search-Bar" onClick={offPopUp}>
               <select className="SelectBox">
                <option value="Product-1">Products</option>
                <option value="Product-2">Products</option>
                <option value="Product-3">Products</option>
               </select>
               <div className="Search-Container">
                 <input type="search" className="Search" placeholder="Search Products..."></input>
                 <button className="Search-btn">Search</button>
               </div>
               <div className="contact-container">
                <div className="contact-1">
                 <img src="https://cdn-icons-png.freepik.com/256/17015/17015042.png?semt=ais_hybrid"
                 className="contact" alt="contact"></img>
                 <p className="number">9442749794</p>
                </div>
                <div className="contact-2">
                  <img src="https://cdn-icons-png.freepik.com/256/17015/17015042.png?semt=ais_hybrid"
                  className="contact" alt="contact"></img>
                  <p className="number">8220921737</p>
                </div>  
               </div>
               
            </div>
            <div className="Background-Container" onClick={offPopUp}>
              <div className="Gif-Container">
              <img src="https://media.tenor.com/9_-2AixmwmsAAAAi/diwali-diwali-crackers.gif" alt="Gif"
               className="Gif-Diwali" />
               
              {/* <img src="https://t3.ftcdn.net/jpg/02/27/91/10/240_F_227911011_qWaTBytJ2n1fe2LOGdJkIQTq403naUfG.jpg" alt="Background Image"
             className="background"></img> */}

              <img src="https://media.tenor.com/9_-2AixmwmsAAAAi/diwali-diwali-crackers.gif" alt="Gif"
              className="Gif-Diwali" />
              </div>
              {/* <img className="offer-tag" src={offerTag} alt="offertag" /> */}

               {/* <img src="https://t3.ftcdn.net/jpg/02/27/91/10/240_F_227911011_qWaTBytJ2n1fe2LOGdJkIQTq403naUfG.jpg" alt="Background Image"
             className="background"></img> */}
            </div>

              {popup && (
                <div className='popup-container'>
                  <input type='text' placeholder='Enter your email ID' value={email}
                  onChange={(e) => setEmail(e.target.value)}></input>
                  <button onClick={navigateToHistory}>OK</button>
                </div>
              )}  

            <h1>Our Products</h1>

            <div className="category-container" onClick={offPopUp}>
               {category.map(c => (
                <div key={c.id}  className="categories">
                   <button className="button-category" onClick={()=>navigateToProduct(c.id)}><img src={`http://localhost:8080/image/${c.imageUrl}`} 
                   alt="category img" className="categoryImage"></img></button>
                   <div className="category-name-container">
                     <h4 className="category">{c.categoryName}</h4>    
                   </div>
                  
                   {/* <hr className="horizontal-line"></hr>                    */}
                </div>
               ))}
            </div>
            <div className="footer-container" onClick={offPopUp}>
                 <h3>Enjoy Diwali with colourful and brightful celebrations</h3>
                 <div className="footer-content-container">
                 <div className="terms-condition">
                    <h4>Terms & Conditions</h4>
                    <p>1. 3% Packing charges will be charged extra</p>
                    <p>2. Goods will be dispatched on CASH & CARRY basic only</p>
                    <p>3. Return Goods cannot be taken</p>
                    <p>4. Lorry charges will be carried out extra</p>
                 </div>
                 <div className="signature">
                    <h3>Yours Faithfully</h3>
                    <h4>For VENKATA SAI TRADERS</h4>
                 </div>
                 </div>
                 <h2>Wish you a safe and prosperous Diwali</h2>
               </div>

          </div>
        </div>
    )
}