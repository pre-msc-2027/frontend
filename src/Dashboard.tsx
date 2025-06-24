import "./Dashboard.css";
import React from "react";
import './Dashboard.css'

const GridExample: React.FC = () => {
    return (

        <>

            <div> Hello world</div>
            <div className="grid-container-dashboard">
                <div className="grid-item-dashboard left">1/6</div>
                <div className="grid-item-dashboard mid">4/6</div>
                <div className="grid-item-dashboard right">2/6</div>
            </div>
        </>
    );
}

export default GridExample;
