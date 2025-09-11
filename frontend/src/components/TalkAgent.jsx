import React from 'react';
import './TalkAgent.css'

const TalkAgent = () => {
  return (
    <>
    <section className='Talk'>
       <div className="form-container">
            <h1>Talk to a Valerie agent</h1>
            <p>You’ll be connected with an expert local agent—there’s no pressure or obligation.</p>
            <p><strong>All fields are required.</strong></p>

            <form>
                {/* <!-- Location Search --> */}
                <label htmlFor="location">Where are you searching for homes?</label>
                <div className="search-wrapper">
                    <input type="text" id="location" placeholder="Lagos"/>
                    <button type="button" className="search-btn">&#128269;</button>
                </div>

                {/* <!-- Email and Phone --> */}
                <div className="row">
                    <div className="col">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="@redfin.com"/>
                    </div>
                    <div className="col">
                        <label htmlFor="phone">Phone</label>
                        <input type="tel" id="phone" placeholder="(   )  -"/>
                    </div>
                </div>

                {/* <!-- Message --> */}
                <label htmlFor="message">What can we help you with?</label>
                <textarea id="message" placeholder="I'm interested in buying, selling or a free consult with an agent."></textarea>


                {/* <!-- Checkbox --> */}
                <div className="checkbox">
                    <input type="checkbox" id="financing"/>
                    
                    <label htmlFor="financing">I want financing information.</label>
                </div>

                {/* <!-- Submit --> */}
                <button type="submit" className="submit-btn">Submit</button>
                <p>By submitting this form, I agree to receive calls and SMS messages from Redfin for the purpose of updates and promotions. Messages may be sent on a recurring basis and frequency will vary. Message and data rates may apply. Consent to receive SMS messages is not required as a condition for purchasing any goods or services. To unsubscribe from SMS messages, reply "STOP" at any time. For assistance, reply "HELP" or visit <a href=""> Privacy Policy</a> and <a href="">Terms of Use</a> . By proceeding, you confirm that you are creating a Redfin account and have read and agree to our Privacy Policy and Terms of Use.</p>
            </form>
        </div>
    </section>   
    </>
  )
}

export default TalkAgent
