import React from 'react';
import { AiFillApple } from 'react-icons/ai';
import { MdShop } from 'react-icons/md';
import './Footer.css';
import { FaFacebook } from 'react-icons/fa'; 
import { FaXTwitter } from 'react-icons/fa6'; 
import { FaTiktok } from "react-icons/fa";
import { FaInstagram } from 'react-icons/fa';
import "./Footer.css";

const Footer = () => {
  return (
  <footer className="footer-container">
      <div className="footer-item-con">
        <div className="footer-col">
          <h1>Join us</h1>
          <a href="#">Become an Agent</a>
          <a href="#">Get referrals</a>
          <a href="#">Careers</a>

          <h5>Find homes faster</h5>
          <button className="app-btn"><AiFillApple size={18} /> Download on <br />App Store</button>
          <button className="app-btn"><MdShop size={18} /> Download from <br />Google Play</button>
        </div>

        <div className="footer-col">
          <h1>About us</h1>
          <a href="#">Why Valerie classic?</a>
          <a href="#">Community Impact</a>
          <a href="#">Diversity & Inclusion</a>
          <a href="#">Life at Valerie classic</a>
          <a href="#">Press</a>
          <a href="#">Investors</a>
          <a href="#">Blog</a>
          <a href="#">Real Estate News</a>
        </div>

        <div className="footer-col">
          <h1>Find us</h1>
          <a href="#">Contact Us</a>
          <a href="#">Help Center</a>
          <a href="#">Advertise</a>
          <div className="social-icons">
          <FaFacebook size={18} color="blue" />
          <FaXTwitter size={18} color="blue" />
          <FaTiktok size={18} color="black" />
          <FaInstagram size={18} color='red'/>
          </div>

          <h5>Subsidiaries</h5>
          <a href="#">Rent.</a>
          <a href="#">ApartmentGuide</a>
          <a href="#">Title Forward</a>

          <h5>Countries</h5>
          <a href="#">United States</a>
          <a href="#">Canada</a>
        </div>

        <div className="footer-col-right">
          <p>Copyright © 2025 Valerie Classic. All rights reserved.</p>
          <p>Updated January 2023: By searching, you agree to the Terms of Use and Privacy Policy.</p>
          <p>Do not sell or share my personal information.</p>
          <p>Valerie classic and all Valerie classic variants, TITLE FORWARD, WALK SCORE, and the R logos, are trademarks of Valerie classic Corporation, registered or pending in the USPTO.</p>
          <p>California DRE #01521930</p>
          <p>Valerie is licensed to do business in New York as Valerie Real Estate. <a href="#">NY Standard Operating Procedures</a></p>
          <p>New Mexico <a href="#">Real Estate Licenses</a></p>
          <p>TREC: <a href="#">Info About Brokerage Services, Consumer Protection Notice</a></p>
          <p>Rocket Mortgage is an affiliated business of Valerie Classic. All mortgage and information are provided by Rocket Mortgage, LLC ... <a href="#">RocketMortgage.com</a></p>
        </div>
      </div>
</footer>
  );
};

export default Footer;