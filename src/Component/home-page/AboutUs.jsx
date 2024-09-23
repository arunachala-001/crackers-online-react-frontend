import { useNavigate } from 'react-router-dom'
import './Aboutus.css'
import HeaderPage from './HeaderPage'
export default function AboutUs() {
    const navigate = useNavigate()

    function navigateToHome() {
        navigate('/')
    }
    return(
        <div className="AboutUs">
            <HeaderPage navigateToHome = {navigateToHome}></HeaderPage>
            <h1 className="title">Welcome To SRI LAKSHMI AGENCIES</h1>
            <div>
            <p className="start-para">Crackers make beautiful moments, we are a reputed and reliable trader in the 
                field of celebration crackers. We make your celebrations happy. Your safety is 
                our priority. This has made us stand strongly in this field for more than a
                year

                We offer various range of fire chakkars, twinkling stars, garlands, rockets, 
                flower pots, pencils, atom bombs, colour matches and all other fancy items. We 
                deal mainly with quality branded products. We are the one place solution for 
                crackers. With websites, e-mail services and other technologies, we are able to 
                serve you faster, better and in time to your complete satisfaction. We offer 
                the best quality products at the most reasonable prices to our clients. We offer
                 fireworks gift box ranges at competitive prices.</p>
            </div>
            <div className='about-background'></div>
            <h2 style={{fontFamily:'monospace', color:'#5f3d08', fontSize:'10px'}}>Why Us</h2>
            <h2 style={{fontFamily:'sans-serif', color:'#5f3d08', fontSize:'10px'}}>Wholesale & Retail dealer in Sivakasi.</h2>
            <p className='start-para'>We are our own manufacturer of quality fireworks. Our experienced and 
                well-equipped team is always concerned about manufacturing high quality 
                fireworks to ensure safety.</p>
             <div className="footer-container-aboutus">
                <div className="list-contact-us">
                    <div className='heading-container'>
                       <h3 className="heading">Contact Us</h3>
                    </div>
                    
                    <ol>
                      <li>415,Sundaram Street, Sivakasi - 626 189</li>
                      <li>94427 49794</li>
                      <li>94427 49794</li>
                      <li>sivakasicrackers@gmail.com</li>
                    </ol>
                
                </div>  
               <p className='start-para' style={{color:'white'}}>
               As per 2018 supreme court order, online sale of firecrackers are not permitted! 
               We value our customers and at the same time, respect jurisdiction. We request you
                to add your products to the cart and submit the required crackers through the 
                enquiry button. We will contact you within 24 hrs and confirm the order through 
                WhatsApp or phone call. Please add and submit your enquiries and enjoy your 
                Diwali with us. We send the parcels through registered and legal transport 
                service providers as like every other major companies in Sivakasi is doing so.
               </p>

               <h4 style={{fontStyle:'italic', fontSize:'10px', color:'white'}}>Copyright © 2022, SRI LAKSHMI AGENCIES All rights reserved </h4>
             </div>

        </div>
    )
}