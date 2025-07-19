import React, { useState } from "react";
import type { DayPlan, FlightInfo, HotelBooking, ItineraryData } from "../types/itinerary";

import generatePdf from "../utils/generatePdf";
import Footer from "./Footer";
import logoImage from "../assets/Group1707485521.png"; // Assuming you have a logo image

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


    const Input = ({ label, type = "text", value, onChange, className = "" }) => (
        <div className={`flex flex-col ${className}`}>
            <label className="text-sm font-medium text-[#321E5D] mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="border border-[#936FE0] p-2 rounded bg-white"
            />
        </div>
    );

    const Button = ({ label, onClick, secondary = false }) => (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 rounded shadow-md font-medium transition ${secondary
                ? "bg-white text-[#680099] border border-[#680099] hover:bg-[#FBF4FF]"
                : "bg-[#541C9C] text-white hover:bg-[#680099]"
                }`}
        >
            {label}
        </button>
    );



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
        !loading || loading ? (<div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-[#FBF4FF]">
            {/* LOGO at Top */}
            <div className="flex justify-center mb-6">
                <img src={logoImage} alt="Logo" className="h-16 md:h-20 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-[#321E5D] mb-6 text-center">Create Your Itinerary</h1>
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Trip Info */}
                <fieldset className="border border-[#936FE0] rounded-lg p-4 bg-white">
                    <legend className="text-lg font-semibold text-[#680099] px-2">Trip Details</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Input label="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <Input label="No. of Travelers" type="number" value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: +e.target.value })} />
                        <Input label="Departure City" value={formData.departureCity} onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })} />
                        <Input label="Destination City" value={formData.destinationCity} onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })} />
                        <Input label="Departure Date" type="date" value={formData.departureDate} onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })} />
                        <Input label="Return Date" type="date" value={formData.returnDate} onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })} />
                    </div>
                </fieldset>

                {/* Flights */}
                <fieldset className="border border-[#936FE0] rounded-lg p-4 bg-white">
                    <legend className="text-lg font-semibold text-[#680099] px-2">Flights</legend>
                    {flights.map((flight, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                            <Input type="date" label="Departure Date" value={flight.departureDate} onChange={(e) => handleFlightChange(index, "departureDate", e.target.value)} />
                            <Input label="From" value={flight.from} onChange={(e) => handleFlightChange(index, "from", e.target.value)} />
                            <Input label="To" value={flight.to} onChange={(e) => handleFlightChange(index, "to", e.target.value)} />
                            <Input type="date" label="Arrival Date" value={flight.arrivalDate} onChange={(e) => handleFlightChange(index, "arrivalDate", e.target.value)} />
                            <Input type="number" label="No. of Travellers" value={flight.noOfTravellers} onChange={(e) => handleFlightChange(index, "noOfTravellers", e.target.value)} />
                        </div>
                    ))}
                    <div className="flex gap-4 mt-4">
                        <Button label="+ Add Flight" onClick={handleAddFlight} />
                        <Button label="- Delete" onClick={handleDelete} secondary />
                    </div>
                </fieldset>

                {/* Days */}
                <fieldset className="border border-[#936FE0] rounded-lg p-4 bg-white">
                    <legend className="text-lg font-semibold text-[#680099] px-2">Itinerary Days</legend>
                    {days.map((day, index) => (
                        <div key={index} className="border border-[#936FE0] rounded-md p-4 mb-4 bg-[#FBF4FF]">
                            <Input label={`Day ${day.day} Date`} type="date" value={day.date} onChange={(e) => handleDayChange(index, "date", e.target.value)} />
                            <Input label="Topic" value={day.topic} onChange={(e) => handleDayChange(index, "topic", e.target.value)} />
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-[#321E5D] mb-1">Upload Image:</label>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(index, file);
                                }} />
                                {day.image && (
                                    <img src={day.image} alt="Preview" className="mt-2 rounded-full w-24 h-24 object-cover" />
                                )}
                            </div>
                            {day.activities.map((activity, aIndex) => (
                                <div key={aIndex} className="mt-3">
                                    <label className="block text-sm font-medium text-[#321E5D]">{activity.time}:</label>
                                    <input type="text" value={activity.description} placeholder={`Activity for ${activity.time}`} onChange={(e) => handleActivityChange(index, aIndex, e.target.value)}
                                        className="w-full border border-[#936FE0] p-2 rounded bg-white mt-1" />
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="flex gap-4 mt-4">
                        <Button label="+ Add Day" onClick={handleAddDay} />
                        <Button label="- Delete" onClick={handleDelete} secondary />
                    </div>
                </fieldset>

                {/* Hotel Booking */}
                <fieldset className="border border-[#936FE0] rounded-lg p-4 bg-white">
                    <legend className="text-lg font-semibold text-[#680099] px-2">Hotel Booking</legend>
                    {bookings.map((booking, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Input label="City" value={booking.city} onChange={(e) => handleBookingChange(index, "city", e.target.value)} />
                            <Input label="Check In" type="date" value={booking.checkIn} onChange={(e) => handleBookingChange(index, "checkIn", e.target.value)} />
                            <Input label="Check Out" type="date" value={booking.checkOut} onChange={(e) => handleBookingChange(index, "checkOut", e.target.value)} />
                            <p className="col-span-2 text-[#321E5D] border border-[#936FE0] p-2 rounded">Nights: {booking.nights}</p>
                            <Input label="Hotel Name" value={booking.hotelName} onChange={(e) => handleBookingChange(index, "hotelName", e.target.value)} className="col-span-2" />
                        </div>
                    ))}
                    <div className="mt-4">
                        <Button label="Add Booking" onClick={onAddBooking} />
                    </div>
                </fieldset>

                {/* Submit Button */}
                <div className="text-center">
                    <button type="submit" className="px-6 py-3 bg-[#541C9C] hover:bg-[#680099] text-white rounded-lg text-lg font-semibold shadow-md transition">
                        Generate Itinerary PDF
                    </button>
                </div>

                <Footer />
            </form>
        </div>
        ) : (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        )
    );
};

export default Form;
