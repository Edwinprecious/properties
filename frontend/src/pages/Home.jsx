import React from 'react';
import HeroSlider from '../components/HeroSlider';
import PopularCard from '../components/PopularCard';
import Popular from '../Popular';
import '../styles.css'
import OptionsCard from '../components/OptionsCard';
import Insta from '../components/Insta';
import TalkAgent from '../components/TalkAgent';


const Home = () => {
  return (
    <>
      <HeroSlider />

      
     <div className="popular-sec">
        <div className="populars">
            <h2>Popular in Lagos</h2>
            <p>The most viewed and favorited homes in the past day.</p>
        </div>
      <div className="populars-cards">
        {Popular.map((house) => (
            <PopularCard
            key={house.id}
            model={house.models}
            info={house.info}
            address={house.address}
            //   image={house.image}
            />
        ))}

         <div className="recommendation-card populars-cards">
          <img src="/images/Image_fx.jpg" alt="background"className="recommendation-bg" />
          <div className="recommendation-overlay">
            <h3>See other more<br />recommendations</h3>
            <button className="recommendation-btn">Join or sign in</button>
          </div>
        </div> 
      </div> 
      
      

     </div>   
  
    <OptionsCard/>
    <Insta/>
    <TalkAgent/>
    

    </>
   
  );
};

export default Home;
