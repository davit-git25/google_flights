import React from "react";

function GoogleMaps() {
    return (
        <div className="map-container">
            <h4>
                Find cheap flights from your location to anywhere
            </h4>
            <div style={{width: "100%", height: "320px"}}>
                <iframe
                    title="google_maps"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d57121927.62127196!2d-13.791361162747465!3d29.092518080457378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sam!4v1734943128289!5m2!1sen!2sam"
                    width="100%"
                    height="300"
                    style={{border:0, borderRadius: 10, borderColor: 'transparent'}}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>
    );
};

export default GoogleMaps;
