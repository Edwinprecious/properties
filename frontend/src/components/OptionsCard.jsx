import React from 'react';
import './OptionsCard.css'

const OptionsCard = () => {
  return (
    <>
    {/* <div className='option-container' style={{width:"100%"}}>
        <img className='card-img-top' src="/images/fetchLogo.jpg" alt="card image cap" />
        <div className='card-body'>
            <div className="card-title">Buy</div>
            <div className='card-text'><p >Valerie agents are among the most experienced in the industry 
                and can help you win in today’s market.</p></div>
            <div className="findAgent"><button>Find an agent</button></div>
            <a href="#" className='btn btn-primary'></a>
        </div>
      
    </div> */}

    <section className="options-section">

        <div className="options-cards">
            <div className="options-card"><a href="">
            <div style={{ position: 'relative' }}>
                <img src="/images/ValerieAgentNew.png" alt="House" />
            </div>
            <div className="property-details">
                <h3>Buy</h3>
                <div className="info"><p>Valerie agents are among the most experienced in the industry and can help you win in today’s market.</p></div>
                <button className="btn-options">Find an agent</button>
                
            </div>
            </a></div>

            <div className="options-card"><a href="">
            <div style={{ position: 'relative' }}>
                <img src="/images/HomeFinance.png" alt="House" />
            </div>
            <div className="property-details">
                <h3>Airbnb</h3>
                <div className="info"><p>Valerie aIrbnb you get the most amazing stay worth the experience. makes every apartment your home .</p></div>
                <button className="btn-options">Find an apartment</button>
                
            </div>
            </a></div>

            <div className="options-card"><a href="">
            <div style={{ position: 'relative' }}>
                <img src="/images/SellNew.png" alt="House" />
            </div>
            <div className="property-details">
                <h3>Sell</h3>
                <div className="info"><p>We know how to price, market, and sell your home for top dollar. And we do it all for half the listing fee others often charge.</p></div>
                <button className="btn-options">Learn more</button>
                
            </div>
            </a></div>

             <div className="options-card"><a href="">
            <div style={{ position: 'relative' }}>
                <img src="/images/RentNew.png" alt="House" />
            </div>
            <div className="property-details">
                <h3>Sell</h3>
                <div className="info"><p>Whether you’re searching for apartments, condos, or rental homes, we make it easy to find a place you’ll love</p></div>
                <button className="btn-options">Explore rentals</button>
                
            </div>
            </a></div>
            
            

    {/* More property-card blocks here */}
         </div>
    </section>

      
    </>
  )
}

export default OptionsCard
