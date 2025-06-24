import "./CardAimated.css";
import React from "react";


const CardAnimated: React.FC = () => {
    return (

        <>
            <div className='card-container'>
                <article className='card-article'>
                    <img src='src/assets/code.webp' alt='image' className='card-img'/>
                     <div className='card-data'>
                         <span className='card-description'> description</span>
                         <h2 className='card-tittle'> tittre</h2>
                         <a href='#' className='card-button'>Read More</a>
                     </div>
                </article>
            </div>
        </>
    );
}

export default CardAnimated;
