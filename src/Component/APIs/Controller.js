import axios from "axios"

export const fetchAllCategories = () => axios.get('https://sivakasi-crackers.onrender.com/api/category')

export const fetchCategoryBySelectOption = (option) =>
    axios.get(`https://sivakasi-crackers.onrender.com/api/category/${option}`)

export const fetchCategoryBySearch = (categoryName) =>
    axios.get(`https://sivakasi-crackers.onrender.com/api/category/search`, {
        params : {
            name : categoryName
        }
    })

export const fetchProductById = (productId) => 
    axios.get(`https://sivakasi-crackers.onrender.com/product/${productId}`)

export const fetchProductsForOrder = (productIds) => 
    axios.post('https://sivakasi-crackers.onrender.com/order/product', productIds)

export const saveCustomerinDB = (customer) => 
    axios.post('https://sivakasi-crackers.onrender.com/user/save', customer)

export const placeOrderBackend = (id, orderRequest) => 
    axios.post(`https://sivakasi-crackers.onrender.com/order/product/place-order/${id}`, orderRequest)

export const fetchOrdersbyEmailId = (email) => 
    axios.get(`https://sivakasi-crackers.onrender.com/order/history/${email}`)
