import { useNavigate } from 'react-router-dom';
import './Header.css';
import { useState } from 'react';
export default function HeaderPage({handlePopup}) {
  const navigate = useNavigate()
  const [popup, setPopup] = useState(false)
  const [email, setEmail] = useState()

  // function handlePopup() {
  //   setPopup(true)
  // }

  // function navigateToHistory() {
  //   navigate(`/history/${email}`)
  // }
    return (
        <div className='HeaderPage'>
          <div className='model-header-page'>
            <div className='Header-Container'>
              <h1>LAKSHMI CRACKERS</h1>
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