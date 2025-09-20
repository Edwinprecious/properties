import React from 'react'
import "./Housebuy.css"

export const Housebuy = () => {
  return (
    <div>
        <div className='Container'>
            <div>
                <h1>Houses for sale near me</h1> <br />
                <h4>Find houses for sale near you. View photos, open <br />house information, and property details for nearby <br /> real estate.</h4>
            </div>
            <header>Location</header>
            <div className='search-container'>
                <div className='location-ipt'>
                    <input type="text" name="" id="" placeholder='City, Address, School, Agent, Zip'/>
                    <span>Price range</span>
                    <select name="No min" id="">
                        <option value="">No min</option>
                        <option value="">$50</option>
                        <option value="">$50</option>
                        <option value="">$50</option>
                        <option value="">$50</option>
                    </select>
                    <select name="No max" id="">
                        <option value="">No min</option>
                        <option value="">$50</option>
                        <option value="">$50</option>
                        <option value="">$50</option>
                        <option value="">$50</option>
                    </select>
                    <button>Search</button>
                </div>
            </div>
        </div>

    </div>
  )
}
