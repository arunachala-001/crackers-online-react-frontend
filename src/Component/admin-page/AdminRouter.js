import axios from "axios";

// export const AuthenticateUser = () =>
//     axios.post('http://localhost:8080/login', null, {
//         params: {
//             username: username,
//             password: password
//         }
//     })
// const token = localStorage.getItem('token')
// export const createCategory = (formData) =>
//     axios.post('http://localhost:8080/admin/store/category', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': token, // Add token to headers
//         },
//     })

// export const fetchAllOrders = () => 
//     axios.get('http://localhost:8080/admin/all-orders', {
//         headers: {
//             'Authorization':token, // Add token to headers
//         },
//     })

export const fetchAllInvoice = () =>
    axios.get('http://localhost:8080/admin/customers')