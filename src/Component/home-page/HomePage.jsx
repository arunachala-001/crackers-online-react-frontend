import HeaderPage from "./HeaderPage";
import background from "./Diwali.png"
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
    
  }

    return (
        <div className="HomePage" onClick={offPopUp}>
            <HeaderPage handlePopup={handlePopup}></HeaderPage>
            <div className="Search-Bar">
               <select className="SelectBox">
                <option value="Product-1">Products</option>
                <option value="Product-2">Products</option>
                <option value="Product-3">Products</option>
               </select>
               <div className="Search-Container">
                 <input type="search" className="Search" placeholder="Search Products..."></input>
                 <button className="Search-btn">Search</button>
               </div>
               <div className="contact">
                <p>Call Us : 9442749794</p>
                <p>Call Us : 8220921737</p>
               </div>
               
            </div>
            
            <img src="https://t3.ftcdn.net/jpg/02/27/91/10/240_F_227911011_qWaTBytJ2n1fe2LOGdJkIQTq403naUfG.jpg" alt="Background Image"
             className="background"></img>

              {popup && (
                <div className='popup-container'>
                  <input type='text' placeholder='Enter your email ID' value={email}
                  onChange={(e) => setEmail(e.target.value)}></input>
                  <button onClick={navigateToHistory}>OK</button>
                </div>
              )}  

            <h1>Our Products</h1>

            <div className="category-container">
               {category.map(c => (
                <div key={c.id}  className="categories">
                   <button className="button-category" onClick={()=>navigateToProduct(c.id)}><img src={`http://localhost:8080/image/${c.imageUrl}`} 
                   alt="category img" className="categoryImage"></img></button>
                   
                   <h3>{c.categoryName}</h3>
                </div>
               ))}
            </div>
            


        </div>
    )
}