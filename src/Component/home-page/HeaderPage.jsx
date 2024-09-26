import { useNavigate } from 'react-router-dom';
import './Header.css';
import logo1 from './diwali_logo.png'
import logo2 from './download.png'
export default function HeaderPage({handlePopup}) {
  const navigate = useNavigate()

  function navigateToAbout() {
     navigate('/aboutus')
  }
  function navigateToCart() {
    navigate('/customer/cart')
  }

  function navigateToHome() {
    navigate('/')
  }
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
                <button className="tag" onClick={navigateToHome}>Home</button>
                <button className="tag" onClick={handlePopup}>Your Orders</button>
                <button className="tag" onClick={navigateToAbout}>About Us</button>
                <button className="tag" onClick={navigateToCart}>Your Cart</button>
              </div>
             
            </div> 
               
        </div>
    )
}