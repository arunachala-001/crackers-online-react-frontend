import axios from "axios";

// export const AuthenticateUser = () =>
//     axios.post('https://sivakasi-crackers.onrender.com/login', null, {
//         params: {
//             username: username,
//             password: password
//         }
//     })
// const token = localStorage.getItem('token')
// export const createCategory = (formData) =>
//     axios.post('https://sivakasi-crackers.onrender.com/admin/store/category', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': token, // Add token to headers
//         },
//     })

// export const fetchAllOrders = () => 
//     axios.get('https://sivakasi-crackers.onrender.com/admin/all-orders', {
//         headers: {
//             'Authorization':token, // Add token to headers
//         },
//     })

// export const fetchAllInvoice = () =>
//     axios.get('https://sivakasi-crackers.onrender.com/admin/customers')

// export const updateOrderStatus = (id, editCustomer) => 
//     axios.put(`https://sivakasi-crackers.onrender.com/admin/customer-order/status/${id}`, editCustomer)