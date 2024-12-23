import React from 'react';

function NoFlightResults({flightResults}) {
    return (
        <div className="container">
            <div className="no-flight-container">
                <div className="image-container">
                    <img
                        src={flightResults?.destinationImageUrl}
                        alt="No flights available"
                        className="no-flights-image"
                    />
                    <p className="no-flights-text">No Flights Available</p>
                </div>
            </div>
        </div>
    );
}

export default NoFlightResults;