import React, { useState } from "react";
import type { DayPlan, FlightInfo, HotelBooking, ItineraryData } from "../types/itinerary";

import generatePdf from "../utils/generatePdf";
import Footer from "./Footer";

const Form: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState<DayPlan[]>([]);
    const [flights, setFlights] = useState<FlightInfo[]>([]);
    const [bookings, setBookings] = useState<HotelBooking[]>([]);
    const [formData, setFormData] = useState<Omit<ItineraryData, 'days' | 'flights'>>({
        name: "",
        departureCity: "",
        destinationCity: "",
        departureDate: "",
        returnDate: "",
        travelers: 1,
        bookings,
    });




    const handleImageUpload = (index: number, file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const updatedDays = [...days];
                updatedDays[index].image = event.target?.result as string;
                setDays(updatedDays);
            };
            reader.readAsDataURL(file);
        }
    };



    const handleAddDay = () => {
        const nextDay = days.length + 1;
        setDays([
            ...days,
            {
                day: nextDay,
                topic: "",
                date: "",
                image: "",
                activities: [
                    { time: "Morning", description: "" },
                    { time: "Afternoon", description: "" },
                    { time: "Evening", description: "" },
                ],
            },
        ]);
    };

    function calculateNights(checkIn: string, checkOut: string): number {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diff = Math.abs(outDate.getTime() - inDate.getTime());
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }



    const onAddBooking = () => {
        setBookings([
            ...bookings,
            {
                city: "",
                checkIn: "",
                checkOut: "",
                nights: 0,
                hotelName: "",
            },
        ]);
    };


    const handleDelete = () => {
        if (days.length > 0) {
            setDays(days.slice(0, -1)); // Remove the last day
        }
        if (flights.length > 0) {
            setFlights(flights.slice(0, -1)); // Remove the last flight
        }
    }
    const handleDayChange = (index: number, field: string, value: string) => {
        const updatedDays = [...days];

        (updatedDays[index] as any)[field] = value;
        setDays(updatedDays);
    };

    const handleBookingChange = (index: number, field: string, value: string) => {
        const updatedBookings = [...bookings];
        (updatedBookings[index] as any)[field] = value;

        const { checkIn, checkOut } = updatedBookings[index];
        updatedBookings[index].nights = calculateNights(checkIn, checkOut);
        setBookings(updatedBookings);
    }

    const handleActivityChange = (dayIndex: number, activityIndex: number, value: string) => {
        const updatedDays = [...days];
        updatedDays[dayIndex].activities[activityIndex].description = value;
        setDays(updatedDays);
    };

    const handleAddFlight = () => {
        setFlights([...flights, { departureDate: "", from: "", to: "", arrivalDate: "", noOfTravellers: "" }]);
    };

    const handleFlightChange = (index: number, field: string, value: string) => {
        const updatedFlights = [...flights];
        (updatedFlights[index] as any)[field] = value;
        setFlights(updatedFlights);
    };

    function formatDatePretty(dateStr: string): string {
        const date = new Date(dateStr);
        if (isNaN(date)) return "";

        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });

        const suffix = (d: number) => {
            if (d > 3 && d < 21) return "th";
            switch (d % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };

        return `${day}${suffix(day)} ${month}`;
    }




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // start loading indicator

        try {
            const formattedDays = days.map((day) => ({
                ...day,
                formattedDate: formatDatePretty(day.date),
            }));
            const finalData: ItineraryData = {
                ...formData,
                days: formattedDays,
                flights,
                bookings,

            };
            console.log("Final Data to be sent:", finalData);

            await generatePdf(finalData);
        } catch (err) {
            console.error("PDF generation failed", err);
        } finally {
            setLoading(false); // stop loading indicator
        }
    };

    return (
        !loading || loading ? (<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Create Your Itinerary</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Trip info */}
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        min={1}
                        placeholder="No. of Travelers"
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: +e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Departure City"
                        value={formData.departureCity}
                        onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Destination City"
                        value={formData.destinationCity}
                        onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                </div>
                {/* Flights */}
                <div>
                    <h2 className="font-semibold mt-6 mb-2">Flights</h2>
                    {flights.map((flight, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                            <input
                                type="date"
                                placeholder="Date"
                                value={flight.departureDate}
                                onChange={(e) => handleFlightChange(index, "departureDate", e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="From"
                                value={flight.from}
                                onChange={(e) => handleFlightChange(index, "from", e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="To"
                                value={flight.to}
                                onChange={(e) => handleFlightChange(index, "to", e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="date"
                                placeholder="Date"
                                value={flight.arrivalDate}
                                onChange={(e) => handleFlightChange(index, "arrivalDate", e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Np. of Travellers"
                                value={flight.noOfTravellers}
                                onChange={(e) => handleFlightChange(index, "noOfTravellers", e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddFlight}
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                        + Add Flight
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded" type="button" onClick={handleDelete}> - Delete </button>
                </div>

                {/* Day-wise plans */}
                <div>
                    <h2 className="font-semibold mt-6 mb-2">Itinerary Days</h2>
                    {days.map((day, index) => (
                        <div key={index} className="border p-4 mb-3 rounded-md">
                            <label className="block font-medium">Day {day.day} Date:</label>
                            <input
                                type="date"
                                value={day.date}
                                onChange={(e) => handleDayChange(index, "date", e.target.value)}
                                className="border p-2 rounded"
                            />
                            <label className="block font-medium">Topic:</label>
                            <input
                                type="text"
                                value={day.topic}
                                onChange={(e) => handleDayChange(index, "topic", e.target.value)}
                                className="border p-2 rounded"
                            />
                            <div className="mt-3">
                                <label className="block font-medium">Upload Image:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(index, file);
                                    }}
                                />
                                {day.image && (
                                    <img
                                        src={day.image}
                                        alt="Preview"
                                        className="mt-2 rounded-full w-24 h-24 object-cover"
                                    />
                                )}
                            </div>


                            {day.activities.map((activity, aIndex) => (
                                <div key={aIndex} className="mb-2">
                                    <label className="block text-sm">{activity.time}:</label>
                                    <input
                                        type="text"
                                        placeholder={`Activity for ${activity.time}`}
                                        value={activity.description}
                                        onChange={(e) => handleActivityChange(index, aIndex, e.target.value)}
                                        className="col-span-2 border p-2 rounded"
                                    />

                                </div>
                            ))}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddDay}
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                        + Add Day
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded" type="button" onClick={handleDelete}> - Delete </button>
                </div>
                <div className="p-4 bg-white rounded-md shadow-md space-y-4">
                    <h2 className="text-lg font-semibold text-purple-700">Hotel Booking</h2>
                    {bookings.map((booking, index) => (
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="City"
                                value={booking.city}
                                onChange={(e) => handleBookingChange(index, "city", e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="date"
                                placeholder="Check In"
                                value={booking.checkIn}
                                onChange={(e) => handleBookingChange(index, "checkIn", e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="date"
                                placeholder="Check Out"
                                value={booking.checkOut}
                                onChange={(e) => handleBookingChange(index, "checkOut", e.target.value)}
                                className="border p-2 rounded"
                            />
                            {/* <input
                                type="number"
                                placeholder="Nights"
                                value={booking.nights}
                                onChange={(e) => handleBookingChange(index, "nights", e.target.value)}
                                className="border p-2 rounded"
                            /> */}
                            <p className="col-span-2 border p-2 rounded">Nights: {booking.nights}</p>
                            <input
                                type="text"
                                placeholder="Hotel Name"
                                value={booking.hotelName}
                                onChange={(e) => handleBookingChange(index, "hotelName", e.target.value)}
                                className="col-span-2 border p-2 rounded"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                        onClick={onAddBooking}
                    >
                        Add Booking
                    </button>
                </div>
                <Footer />

                <button
                    type="submit"

                    className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded"
                >
                    Generate Itinerary PDF
                </button>
            </form>
        </div>) : (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        )
    );
};

export default Form;
