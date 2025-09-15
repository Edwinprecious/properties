import React from 'react'
import "./ScanCode.css";
import { AiFillApple } from 'react-icons/ai';
import { MdShop } from 'react-icons/md';

const ScanCode = () => {
  return (
   <>
    <div>
        <section className='section3-container'>
            <div className='section3-wrap'>
            <img className='active' src="images/igpage.png" alt="images" />
            <div className='text3'>
                <h1>The best home search starts with<br/> the Valerie classic app </h1>
                <h5>With 3D walkthroughs, 40+ filters to narrow down your search, and monthly<br/> payment calculators—our app makes it easy to find the right home from anywhere</h5>
                <button className="app-btn"><AiFillApple size={18} /> Download on <br />App Store</button>
                <button className="app-btn"><MdShop size={18} /> Download from <br />Google Play</button>
            </div>
            </div> 
        </section>
      
    </div>
   </>
  )
}

export default ScanCode
