import React, {useState} from 'react';
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import {IoAirplaneSharp} from "react-icons/io5";

function FlightResults({flightResults}) {
    const [showMoreList, setShowMoreList] = useState(Array(flightResults?.itineraries?.length).fill(false));

    const toggleMoreInfo = (index) => {
        setShowMoreList((prevState) => {
            const newShowMoreList = [...prevState];
            newShowMoreList[index] = !newShowMoreList[index];
            return newShowMoreList;
        });
    };

    return (
        <>
            <div className="flight-results-container">
                <div className="flight-cards">
                    {flightResults?.itineraries?.map((flight, index) =>
                        <div key={index}
                             className={showMoreList[index] ? "flight-card-more" : "flight-card-short"}>
                            <div className="airline-info">
                                <img
                                    src={flight.legs[0].carriers?.marketing[0]?.logoUrl}
                                    alt={`${flight.legs[0].carriers?.marketing[0]?.name} logo`}
                                    className="airline-logo"
                                />
                                <p className="airline-name">
                                    {flight.legs[0].carriers?.marketing[0]?.name}
                                </p>
                            </div>
                            {showMoreList[index] ? (
                                <>
                                    <p><strong>Flight Number:</strong> {flight.legs[0].id}</p>
                                    <p>
                                        <strong>Departure:</strong> {new Date(flight.legs[0]?.departure).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Arrival:</strong> {new Date(flight.legs[0]?.arrival).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>From:</strong> {flight.legs[0]?.origin?.name} ({flight.legs[0]?.origin?.displayCode})
                                    </p>
                                    <p>
                                        <strong>To:</strong> {flight.legs[0]?.destination?.name} ({flight.legs[0]?.destination?.displayCode})
                                    </p>
                                    <p>
                                        <strong>Duration:</strong> {flight.legs[0]?.durationInMinutes} minutes
                                    </p>
                                    <p>
                                        <strong>Stop</strong>  {flight?.legs[0]?.stopCount > 0 ? `${flight?.legs[0]?.stopCount} stop` : "Nonstop"}
                                    </p>
                                    <p>
                                        <strong>Price:</strong> {flight.price?.formatted}
                                    </p>
                                    <div className="show-less-div">
                                        <FaChevronUp onClick={() => toggleMoreInfo(index)}/>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="airline-time-info">
                                        <p>{flight.legs[0]?.durationInMinutes} minutes</p>
                                        <p>{flight.legs[0]?.origin?.displayCode}
                                            <IoAirplaneSharp style={{margin: '0 4'}} size={17} />

                                            {flight.legs[0]?.destination?.displayCode}</p>
                                    </div>
                                    <div className="airline-stop-info">
                                        <p>
                                            {flight?.legs[0]?.stopCount > 0 ? `${flight?.legs[0]?.stopCount} stop` : "Nonstop"}
                                        </p>
                                    </div>
                                    <div className="airline-price-info">
                                        <p>{flight.price?.formatted}</p>
                                    </div>
                                    <div className="show-more-div">
                                        <FaChevronDown onClick={() => toggleMoreInfo(index)}/>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default FlightResults;