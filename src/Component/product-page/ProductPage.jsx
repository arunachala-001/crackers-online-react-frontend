import { useNavigate, useParams } from "react-router-dom";
import HeaderPage from "../home-page/HeaderPage";
import './ProductPage.css'
import { fetchProductById } from "../APIs/Controller";
import { useEffect, useState } from "react";

export default function ProductPage() {
    const {productId} = useParams()
    const [product, setProduct] = useState([])
    const [selectedId, setSelectedId] = useState([])
    const navigate = useNavigate()

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
        console.log(setSelectedId)
    }
    function navigateToOrder() {
        if(selectedId.length >0) {
            navigate('/order/', {state : {productIds: selectedId}})
        }
        // console.log("button Clicked at Id:"+ id)
        // navigate(`/order/${id}`)
    }
    return (
        <div className="ProductPage">
            <HeaderPage></HeaderPage>
            <input type="search"></input>
            <label>Sort by price</label>
            <select>
                <option value="Default">Default</option>
                <option value="Price">High to Low</option>
                <option value="Price">Low to High</option>
            </select>
            <h2>List of Products</h2>
            <div className="product-container">
            {product.map(p => (
                <div key={p.id}>
                    <div className="products">
                    <button className="product-btn">
                       <img src={`http://localhost:8080/image/${p.image}`} className="product-image"
                       alt={p.productName}></img>
                    </button>
                   
                   <h2>{p.productName}</h2>
                   <h4>Price : ₹{p.productPrice}</h4>
                   <p>{p.description}</p>
                   <p>Original Price : ₹{p.orginalPrice}  Discount : {p.discount}%</p>
                   <button onClick={() => handleProduct(p.id)}>{selectedId.includes(p.id)? 'Remove From Cart': 'Add to Cart'}</button>
                   {/* <button onClick={() => navigateToOrder(p.id)}>Add to cart</button> */}
                    </div>    
                    
                </div>
            ))}
            
            <button onClick={navigateToOrder}>Order</button>
            </div>
            
        </div>
    )
}