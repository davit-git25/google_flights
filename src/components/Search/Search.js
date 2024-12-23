import React, {useState} from 'react';
import {Form, Button, Row, Col, Dropdown, DropdownButton, Spinner} from 'react-bootstrap';
import {IoMdSearch} from "react-icons/io";
import {useForm} from 'react-hook-form';
import moment from "moment";
import axios from "axios";
import './Search.scss';
import FlightResults from "../FilightResults/FlightResults";
import NoFlightResults from "../FilightResults/NoFlightResults";
import GoogleMaps from "../GoogleMaps/GoogleMaps";
import {FaUser} from "react-icons/fa";
import StaticFlights from "../StaticFlights/StaticFlights";

const FlightSearchForm = () => {
    const {watch, register, handleSubmit} = useForm({
        defaultValues: {
            tripType: 'roundTrip',
        }
    });
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [flightResults, setFlightResults] = useState(null);


    const handlePassengerChange = (type, action) => {
        setPassengers((prev) => {
            const newValue = action === 'increase' ? prev[type] + 1 : prev[type] > 0 ? prev[type] - 1 : 0;
            return {...prev, [type]: newValue};
        });
    };

    const fetchLocationIds = async (location) => {
        try {
            const response = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport', {
                headers: {
                    'X-RapidAPI-Key': 'eddb06410dmshd67a08716c321c3p1d75aajsn5c7f289b0cf4',
                    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
                },
                params: {
                    query: location
                }
            });
            if (response?.data && response?.data?.data?.length > 0 && response?.data?.status) {
                const data = response?.data?.data[0];
                return {
                    skyId: data?.skyId,
                    entityId: data?.entityId
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching location IDs:', error);
            return null;
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        flightResults && setFlightResults(null)
        try {
            const formattedDepartureDate = data.departureDate ? moment(data?.departureDate).format("YYYY-MM-DD") : null;
            const formattedReturnDate = data.returnDate ? moment(data?.returnDate).format("YYYY-MM-DD") : undefined;
            const searchData = {
                ...data,
                passengers,
                departureDate: formattedDepartureDate ? formattedDepartureDate : null,
                returnDate: formattedReturnDate ? formattedReturnDate : null,
            };

            const originIds = await fetchLocationIds(data.from);
            const destinationIds = await fetchLocationIds(data.to);

            if (!originIds || !destinationIds) {
                console.error('Invalid origin or destination IDs');
                setIsLoading(false);
                return;
            }

            const response = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights', {
                headers: {
                    'X-RapidAPI-Key': 'eddb06410dmshd67a08716c321c3p1d75aajsn5c7f289b0cf4',
                    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
                },
                params: {
                    originSkyId: originIds.skyId,
                    destinationSkyId: destinationIds.skyId,
                    originEntityId: originIds.entityId,
                    destinationEntityId: destinationIds.entityId,
                    cabinClass: searchData.classType || 'economy',
                    date: searchData.departureDate,
                    returnDate: searchData.returnDate || undefined,
                    adults: searchData.passengers.adults || 1,
                    children: searchData.passengers.children || 0,
                    infants: searchData.passengers.infants || 0,
                    tripType: searchData.tripType || 'roundTrip',
                }
            });
            setFlightResults(response?.data?.data)
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false)
            console.error('Error searching for flights:', error);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)} className="flight-search-form">
                <Row className="mb-3 align-items-center">
                    <Col sm={12} md={4} lg={3}>
                        <Form.Group>
                            <Form.Control as="select" {...register('tripType')} className="round-trip">
                                <option value="roundTrip">Round Trip</option>
                                <option value="oneWay">One Way</option>
                                <option value="multiCity">Multi-city</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={2}>
                        <DropdownButton id="dropdown-basic-button"
                                        title={
                                            <>
                                                <FaUser style={{marginRight: '8px'}}/>
                                                {passengers?.adults + passengers?.children + passengers?.infants}
                                            </>}>
                            <Dropdown.ItemText>
                                Adults{" "}
                                <Button variant="outline-secondary" size="sm"
                                        disabled={passengers?.adults === 1}
                                        onClick={() => handlePassengerChange('adults', 'decrease')}>-</Button>{' '}
                                {" "} {passengers.adults}{" "}
                                <Button variant="outline-secondary" size="sm"
                                        onClick={() => handlePassengerChange('adults', 'increase')}>+</Button>
                            </Dropdown.ItemText>
                            <Dropdown.ItemText>
                                Children{" "}
                                <Button variant="outline-secondary" size="sm"
                                        onClick={() => handlePassengerChange('children', 'decrease')}>-</Button>{' '}
                                {" "} {passengers.children}{" "}
                                <Button variant="outline-secondary" size="sm"
                                        onClick={() => handlePassengerChange('children', 'increase')}>+</Button>
                            </Dropdown.ItemText>
                            <Dropdown.ItemText>
                                Infants{" "}
                                <Button variant="outline-secondary" size="sm"
                                        onClick={() => handlePassengerChange('infants', 'decrease')}>-</Button>{' '}
                                {" "} {passengers.infants}{" "}
                                <Button variant="outline-secondary" size="sm"
                                        onClick={() => handlePassengerChange('infants', 'increase')}>+</Button>
                            </Dropdown.ItemText>
                        </DropdownButton>
                    </Col>
                    <Col sm={12} md={4} lg={3}>
                        <Form.Group>
                            <Form.Control as="select" {...register('classType')} className="class-type">
                                <option value="economy">Economy</option>
                                <option value="premium_economy">Premium Economy</option>
                                <option value="business">Business</option>
                                <option value="first">First</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col sm={6} md={6} lg={watch("tripType") === "roundTrip" ? 3 : 4}>
                        <Form.Group className="position-relative mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Where from?"
                                {...register('from', {required: true})}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6} md={6} lg={watch("tripType") === "roundTrip" ? 3 : 4}>
                        <Form.Group className="position-relative mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Where to?"
                                {...register('to', {required: true})}
                            />
                        </Form.Group>
                    </Col>
                    <Col
                        sm={watch("tripType") === "roundTrip" ? 6 : 12}
                        md={watch("tripType") === "roundTrip" ? 6 : 12}
                        lg={watch("tripType") === "roundTrip" ? 3 : 4}>
                        <Form.Group className="position-relative mb-3">
                            <Form.Control
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                {...register('departureDate', {required: true})}
                            />
                        </Form.Group>
                    </Col>
                    {watch("tripType") === "roundTrip" && (
                        <Col sm={6} md={6} lg={3}>
                            <Form.Group className="position-relative mb-3">
                                <Form.Control
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    {...register('returnDate', {required: watch("tripType") === "roundTrip"})}
                                />
                            </Form.Group>
                        </Col>
                    )}
                </Row>
                <Row className="mt-2 align-items-center justify-content-center submit-btn">
                    <Col sm={4} md={3} lg={2}>
                        <Button type="submit" variant="primary" className="search-btn" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <IoMdSearch size={21}/>
                                    Explore
                                </>
                            )}
                        </Button>
                    </Col>
                </Row>
            </Form>
            <>
                {!flightResults &&
                    <>
                        <GoogleMaps/>
                        <StaticFlights />
                    </>
                }
            </>
            <>
                {flightResults && flightResults?.itineraries.length > 0
                    ? (<FlightResults flightResults={flightResults}/>)
                    : flightResults && flightResults?.itineraries.length === 0 && (
                    <NoFlightResults flightResults={flightResults}/>)
                }
            </>
        </>
    );
};

export default FlightSearchForm;
