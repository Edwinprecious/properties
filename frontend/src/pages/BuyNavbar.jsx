import React from 'react'
import "./BuyNavbar.css";


const BuyNavbar = () => {
  return (
    <div>
          <header className='header-con'>
        <div className='logo'> <img src="/images/EstateLogo.png" alt="images" /></div>
        <div className='search-box'>
            <input type="text" placeholder='City, Address, School, Agent, Zip'/>
            <button>🔍</button>
        </div>
        <section className='nav-con'>
            <nav className='nav-link'>
                <a className='active' href="">Why Valerie classic ?</a>
                <a href="">Our Agents</a>
                <a style={{borderBottom: "2px purple solid"}} href="">Buy with Valerie classic</a>
                <a href="">Sell with Valerie classic </a>
                <button>Meet a Valerie classic agent </button>
            </nav>
        </section>
    </header>
    </div>
  )
}

export default BuyNavbar
