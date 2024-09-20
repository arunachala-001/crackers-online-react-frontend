import { useNavigate } from 'react-router-dom';
import './Header.css';
import logo1 from './diwali_logo.png'
import logo2 from './download.png'
import { useState } from 'react';
export default function HeaderPage({handlePopup}) {
  const navigate = useNavigate()
  const [popup, setPopup] = useState(false)
  const [email, setEmail] = useState()
    return (
        <div className='HeaderPage'>
          <div className='model-header-page'>
            <div className='Header-Container'>
              <div className='title-1-container'>
                <img className='logo2' src={logo2} alt="logo" />  
                <h1 className='title-1'>VENKATA SAI</h1>
                <img className='logo1' src={logo1} alt="logo1" />
              </div>
              <div className='title-2-container'>
                <h1 className='title-2'>CRACKERS</h1>
              </div>
            </div> 
              <div className="tags">
                <button className="tag">Home</button>
                <button className="tag" onClick={handlePopup}>Your Orders</button>
                <button className="tag">About Us</button>
                <button className="tag">Contact Us</button>
              </div>
             
            </div> 
               
        </div>
    )
}