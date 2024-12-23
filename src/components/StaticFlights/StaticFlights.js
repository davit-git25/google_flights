import React from 'react';
import {staticFlightsData} from '../../helpers/staticFlightsData/staticFlighs';

function StaticFlights() {
    return (
        <div className="static-flights-container">
            {staticFlightsData && staticFlightsData.map((item, index) => (
                <div className="static-flights-item" key={index}>
                    <div className="flight-img-container">
                        <img src={item?.image} alt={item?.flightName}/>
                    </div>
                    <div className="flight-info-container">
                        <strong className="flight-name-price">
                            <span>{item?.flightName}</span>
                            <span>{item?.flightPrice}</span>
                        </strong>
                        <p className="flight-date">
                            <small>{item?.date} - {item?.returnDate}</small>
                        </p>
                        <p className="flight-time">
                            <small>{item?.stop} {"·"} {item?.flightTime}</small>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StaticFlights;