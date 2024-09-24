import HeaderPage from "./HeaderPage";

import { BounceLoader } from 'react-spinners';
import './HomePage.css'
import { useEffect, useState } from "react";
import { fetchAllCategories, fetchCategoryBySearch, fetchCategoryBySelectOption } from "../APIs/Controller";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
   const[category, setCategory] = useState([])
   const navigate = useNavigate()
   const [categoryResponse, setCategoryResponse] = useState(true)
   const [search, setSearch] = useState("")
   const [searchProducts, setSearchProducts] = useState([])
   const[searchTrue, setSearchTrue] = useState(false)
   const [popup, setPopup] = useState(false)  
   const [email, setEmail] = useState()

   const [loading, setLoading] = useState(false)
   const[options, setOptions] = useState(false)
   const [optionProducts, setOptionProducts] = useState()

   function retriveAllCategory() {
    fetchAllCategories()
    .then(response => {
      setLoading(true)
        console.log(response.data)
        const categories = response.data.map((res) => ({
            id : res.categoryId,
            categoryName : res.categoryName,
            imageUrl : res.image.substring(7)
        }))
        return setCategory(categories)
    })
    
    .catch(error => console.log(error)). finally(()=> setLoading(false))
   }

   useEffect(
    () => retriveAllCategory(),[]
   )

   function getAllCategoryByOption(option) {
        setLoading(true)
        fetchCategoryBySelectOption(option)
        .then(response => {
          setOptionProducts(response.data)
          setOptions(true)
          setSearchTrue(false)
          setCategoryResponse(false)
        }).catch(error => console.log(error)).finally(()=> setLoading(false))
   }

   function handleCategoryChange(event) {
      getAllCategoryByOption(event.target.value)
      if(event.target.value === "Products") {
        setOptions(false)
        setSearchTrue(false)
        setCategoryResponse(true)
      }
   }

   function retrieveProductsBySearch() {
      setSearchTrue(true)
      setOptions(false)
      setCategoryResponse(false)
      setLoading(true)
      fetchCategoryBySearch(search)
      .then(response => {
        const mapToSearchProduct = response.data.map((res) => ({
          id : res.categoryId,
          categoryName : res.categoryName,
          imageUrl : res.image.substring(7)
      }))
      return setSearchProducts(mapToSearchProduct)
      
    }
        // setSearchProducts(response.data)
    ).catch(error => console.log(error)). finally(()=> setLoading(false))
   }

  //  function handletrue(val) {
   
    
  //  }
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

  function refreshPage() {
    window.location.reload();
  }

  function handlePage() {
    refreshPage()
  }

    return (
        <div className="HomePage">
            <HeaderPage handlePopup={handlePopup}></HeaderPage>
            <div>
            <div className="Search-Bar" onClick={offPopUp}>
               <select className="SelectBox" onChange = {handleCategoryChange} defaultValue="Products">
               <option value="Select Category" disabled>Select Category</option>
               <option value="Products" onChange= {handlePage}>Products</option>

               {category.map((c)=> (
                  <option key={c.id} value={c.categoryName}>{c.categoryName}</option>
                
               ))}
                
               </select>
               <div className="Search-Container">
                 <input type="search" className="Search" placeholder="Search..."
                 value={search} onChange={(e)=> setSearch(e.target.value)}></input>
                 <button className="Search-btn" onClick={retrieveProductsBySearch}>OK</button>
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

              <img src="https://media.tenor.com/9_-2AixmwmsAAAAi/diwali-diwali-crackers.gif" alt="Gif"
              className="Gif-Diwali" />
              </div>
              
            </div>

              {popup && (
                <div className='popup-container'>
                  <input type='text' placeholder='Enter your email ID' value={email}
                  onChange={(e) => setEmail(e.target.value)}></input>
                  <button onClick={navigateToHistory}>OK</button>
                </div>
              )}  

            <h1 className="Product-Mobile">Our Products</h1>
            <img className="offer-img"
            src="data:image/jpeg;base64,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"></img>

            {/*------------------- #Testing--------------------- */}
            {/* <div className="category-container">
                <div className="categories">
                     <button className="button-category">
                      <img src="https://cdn-icons-png.freepik.com/256/17015/17015042.png?semt=ais_hybrid" 
                     alt="category img" className="categoryImage"></img></button>
                     <div className="category-name-container">
                       <h4 className="category">Flower Pots</h4>    
                     </div>
                </div>
                <div className="categories">
                     <button className="button-category">
                      <img src="https://cdn-icons-png.freepik.com/256/17015/17015042.png?semt=ais_hybrid" 
                     alt="category img" className="categoryImage"></img></button>
                     <div className="category-name-container">
                       <h4 className="category">One Sound Crackers</h4>    
                     </div>
                </div>
                <div className="categories">
                     <button className="button-category">
                      <img src="https://cdn-icons-png.freepik.com/256/17015/17015042.png?semt=ais_hybrid" 
                     alt="category img" className="categoryImage"></img></button>
                     <div className="category-name-container">
                       <h4 className="category">Flower Pots</h4>    
                     </div>
                </div>
                <div className="categories">
                     <button className="button-category">
                      <img src="https://cdn-icons-png.freepik.com/256/17015/17015042.png?semt=ais_hybrid" 
                     alt="category img" className="categoryImage"></img></button>
                     <div className="category-name-container">
                       <h4 className="category">Flower Pots</h4>    
                     </div>
                </div>
                <div className="categories">
                     <button className="button-category">
                      <img src="https://cdn-icons-png.freepik.com/256/17015/17015042.png?semt=ais_hybrid" 
                     alt="category img" className="categoryImage"></img></button>
                     <div className="category-name-container">
                       <h4 className="category">Flower Pots</h4>    
                     </div>
                </div>
                <div className="categories">
                     <button className="button-category">
                      <img src="https://cdn-icons-png.freepik.com/256/17015/17015042.png?semt=ais_hybrid" 
                     alt="category img" className="categoryImage"></img></button>
                     <div className="category-name-container">
                       <h4 className="category">One Sound Crackers</h4>    
                     </div>
                </div>
            </div> */}
{/* ---------------------------------------------------------------------------------------- */}

            <div className="category-container" onClick={offPopUp}>
                {loading ? (
                  <div className="loading-style">
                    <BounceLoader className="loading"></BounceLoader>
                  </div>
                ) : options ? (
                  <>
                     <div className="categories">
                     <button className="button-category" onClick={()=>navigateToProduct(optionProducts.categoryId)}><img src={`https://sivakasi-crackers.onrender.com/image/${optionProducts.image.substring(7)}`} 
                     alt="category img" className="categoryImage"></img></button>
                     <div className="category-name-container">
                       <h4 className="category">{optionProducts.categoryName}</h4>    
                     </div>
                     </div>
                    
                  </>
                ) : searchTrue ? (
                 <>
                   {searchProducts.map((c) => (
                       <div key={c.id}  className="categories">
                       <button className="button-category" onClick={()=>navigateToProduct(c.id)}><img src={`https://sivakasi-crackers.onrender.com/image/${c.imageUrl}`} 
                       alt="category img" className="categoryImage"></img></button>
                       <div className="category-name-container">
                         <h4 className="category">{c.categoryName}</h4>    
                       </div>
                    </div>
                   ))}
                 </>
                ) : categoryResponse ? (
                 <>
                    {category.map(c => (
                      <div key={c.id}  className="categories">
                        <button className="button-category" onClick={()=>navigateToProduct(c.id)}><img src={`https://sivakasi-crackers.onrender.com/image/${c.imageUrl}`} 
                        alt="category img" className="categoryImage"></img></button>
                         <div className="category-name-container">
                           <h4 className="category">{c.categoryName}</h4>    
                         </div>
                      </div>
                     ))}
                 </>
                ) : (
                 <>
                   <h1>Network Issue</h1>
                 </>
                )}
                 
                {/* </>
              )} */}
               
            </div>
            <div className="footer-container" onClick={offPopUp}>
                 <h3>Enjoy Diwali with colourful and brightful celebrations🦚</h3>
                 <div className="footer-content-container">
                 <div className="terms-condition">
                    <h4>Terms & Conditions✒</h4>
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
        </div>
    )
}