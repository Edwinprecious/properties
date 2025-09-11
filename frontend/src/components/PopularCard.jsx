import React from 'react'
import Popular from '../Popular'

const PopularCard = ({ model, info, address, image}) => {
//     const [showModal, setShowModal] = useState(false);

//   const openModal = () => setShowModal(true);
//   const closeModal = () => setShowModal(false);
  return (
    <>
     
      <div className='populars-cards' style={{width:"100%"}}>
       <div className="populars-card">
         <img className='card-img-top' src="/images/Image_fx.jpg" alt="card image cap" />
         {/* <div className='card-img-top'>{image}</div>  */}
        <div className='popular-details'>
            <h3>$30,000</h3>
             <h5 className='model'>{model}</h5>
            <div className='info'>{info}</div>
            <div className='address'>{address}</div>
            <div className="actions"><i>♡</i></div>
            <a href="#" className='btn btn-primary'></a>
        </div> 
       </div>
    </div>
     {/* </div> */}
      
    </>
  )
}

export default PopularCard

