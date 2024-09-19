import axios from "axios"

export const fetchAllCategories = () => axios.get('http://localhost:8080/api/category')

export const fetchProductById = (productId) => 
    axios.get(`http://localhost:8080/product/${productId}`)

export const fetchProductsForOrder = (productIds) => 
    axios.post('http://localhost:8080/order/product', productIds)

export const saveCustomerinDB = (customer) => 
    axios.post('http://localhost:8080/user/save', customer)

export const placeOrderBackend = (id, orderRequest) => 
    axios.post(`http://localhost:8080/order/product/place-order/${id}`, orderRequest)

export const fetchOrdersbyEmailId = (email) => 
    axios.get(`http://localhost:8080/order/history/${email}`)
