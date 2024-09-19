import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [token, setToken] = useState("")
    const navigate = useNavigate()

    function validateuser() {
        axios.post('http://localhost:8080/login', null, {
            params: {
                username: username,
                password: password
            }
        }).then(response =>{
            localStorage.setItem('token',response.data)
            if(response.status === 200 || response.status ===201) {
                navigate('/admin/home')
            }
            console.log(response)
        }).catch(error => console.log(error))
    }
    return (
        <div className="LoginPage">
            <div>
               <label>User Name :</label>
               <input type="text" onChange={(e) => setUsername(e.target.value)}></input>
               <br></br>

               <label>Password :</label>
               <input type="password" onChange={(e) => setPassword(e.target.value)} />

               <br></br>
               <button onClick={validateuser}>OK</button>
            </div>
        </div>
    )
}