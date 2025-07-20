import React, { useState } from "react";
import type { DayPlan, FlightInfo, HotelBooking, Installment, ItineraryData, PaymentEntry } from "../types/itinerary";
import logoImage from "../assets/Group1707485521.png"
import generatePdf from "../utils/generatePdf";

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
    const [payments, setPayments] = useState<PaymentEntry[]>([
        { label: "Total Amount", value: "₹ 9,00,000 For 3 Pax (Inclusive Of GST)" },
        { label: "TCS", value: "Not Collected" },
    ]);

    const [installments, setInstallments] = useState<Installment[]>([
        { installment: "Installment 1", amount: "₹3,50,000", dueDate: "Initial Payment" },
        { installment: "Installment 2", amount: "₹4,00,000", dueDate: "Post Visa Approval" },
        { installment: "Installment 3", amount: "Remaining", dueDate: "20 Days Before Departure" },
        { installment: "Installment 4", amount: "Remaining", dueDate: "20 Days Before Departure" },
        { installment: "Installment 5", amount: "Remaining", dueDate: "20 Days Before Departure" },
    ]);

    const handlePaymentChange = (
        index: number,
        key: keyof PaymentEntry,
        value: string
    ) => {
        const updated = [...payments];
        updated[index][key] = value;
        setPayments(updated);
    };

    const addInstallment = () => {
        const newInstallment: Installment = {
            installment: `Installment ${installments.length + 1}`,
            amount: "Remaining",
            dueDate: "",
        };
        setInstallments([...installments, newInstallment]);
    };

    const removeInstallment = (index: number) => {
        const updated = [...installments];
        updated.splice(index, 1);
        setInstallments(updated);
    };

    const updateInstallment = (index: number, field: keyof Installment, value: string) => {
        const updated = [...installments];
        updated[index][field] = value;
        setInstallments(updated);
    };


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
                formattedDate: "",
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
            setDays(days.slice(0, -1));
        }
        if (flights.length > 0) {
            setFlights(flights.slice(0, -1));
        }
    }
    const handleDayChange = (index: number, field: keyof DayPlan, value: string) => {
        const updatedDays = [...days];

        updatedDays[index][field] = value as never;
        setDays(updatedDays);
    };

    const handleBookingChange = (
        index: number,
        field: keyof HotelBooking,
        value: string
    ) => {
        const updatedBookings = [...bookings];
        if (field === "nights") {
            updatedBookings[index].nights = Number(value);
        } else {
            updatedBookings[index][field] = value as never;
        }

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
        setFlights([...flights, { flightName: "", departureDate: "", from: "", to: "", arrivalDate: "", noOfTravellers: formData.travelers }]);
    };

    const handleFlightChange = (index: number, field: string, value: string) => {
        const updatedFlights = [...flights];
        updatedFlights[index] = {
            ...updatedFlights[index],
            [field]: field === "noOfTravellers" ? Number(value) : value,
        };
        setFlights(updatedFlights);
    };

    function formatDatePretty(dateStr: string): string {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";

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
            const finalData = {
                ...formData,
                days: formattedDays,
                flights,
                bookings,
                payments,
                installments
            };
            // console.log("Final Data to be sent:", finalData);

            await generatePdf(finalData);
        } catch (err) {
            console.error("PDF generation failed", err);
        } finally {

            setFormData({
                name: "",
                departureCity: "",
                destinationCity: "",
                departureDate: "",
                returnDate: "",
                travelers: 1,
                bookings,
            });
            setDays([]);
            setFlights([]);
            setBookings([]);
            setLoading(false);
        }
    };

    return (
        !loading ? (<div className="max-w-4xl mx-auto pb-6 p-6 bg-[#FBF4FF] rounded-lg shadow-lg">
            {/* LOGO at Top */}
            <div className="flex justify-center mb-6">
                <img src={logoImage} alt="Logo" className="h-16 md:h-20 object-contain" />
            </div>
            <h1 className="text-3xl font-extrabold mb-6 text-[#321E5D]">Create Your Itinerary</h1>
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Trip Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="mb-2 font-semibold text-[#321E5D]">Your Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="travelers" className="mb-2 font-semibold text-[#321E5D]">No. of Travelers</label>
                        <input
                            id="travelers"
                            type="number"
                            min={1}
                            placeholder="No. of Travelers"
                            value={formData.travelers}
                            onChange={(e) => setFormData({ ...formData, travelers: +e.target.value })}
                            className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="departureCity" className="mb-2 font-semibold text-[#321E5D]">Departure City</label>
                        <input
                            id="departureCity"
                            type="text"
                            placeholder="Departure City"
                            value={formData.departureCity}
                            onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                            className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="destinationCity" className="mb-2 font-semibold text-[#321E5D]">Destination City</label>
                        <input
                            id="destinationCity"
                            type="text"
                            placeholder="Destination City"
                            value={formData.destinationCity}
                            onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                            className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="departureDate" className="mb-2 font-semibold text-[#321E5D]">Departure Date</label>
                        <input
                            id="departureDate"
                            type="date"
                            value={formData.departureDate}
                            onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                            onFocus={(e) => e.target.showPicker?.()}
                            className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="returnDate" className="mb-2 font-semibold text-[#321E5D]">Return Date</label>
                        <input
                            id="returnDate"
                            type="date"
                            value={formData.returnDate}
                            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                            onFocus={(e) => e.target.showPicker?.()}
                            className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                            required
                        />
                    </div>
                </div>

                {/* Flights Section */}
                <div>
                    <h2 className="font-bold mt-8 mb-4 text-[#321E5D] text-xl">Flights</h2>
                    {flights.map((flight, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-[#321E5D]">Flight Name</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={flight.flightName}
                                    onChange={(e) => handleFlightChange(index, "flightName", e.target.value)}
                                    className="border border-[#680099] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-[#321E5D]">Departure Date</label>
                                <input
                                    type="date"
                                    placeholder="Date"
                                    value={flight.departureDate}
                                    onChange={(e) => handleFlightChange(index, "departureDate", e.target.value)}
                                    onFocus={(e) => e.target.showPicker?.()}
                                    className="border cursor-pointer border-[#680099] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-[#321E5D]">From</label>
                                <input
                                    type="text"
                                    placeholder="From"
                                    value={flight.from}
                                    onChange={(e) => handleFlightChange(index, "from", e.target.value)}
                                    className="border border-[#680099] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-[#321E5D]">To</label>
                                <input
                                    type="text"
                                    placeholder="To"
                                    value={flight.to}
                                    onChange={(e) => handleFlightChange(index, "to", e.target.value)}
                                    className="border border-[#680099] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-[#321E5D]">Arrival Date</label>
                                <input
                                    type="date"
                                    placeholder="Date"
                                    value={flight.arrivalDate}
                                    onChange={(e) => handleFlightChange(index, "arrivalDate", e.target.value)}
                                    onFocus={(e) => e.target.showPicker?.()}

                                    className="border border-[#680099] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                            <div className="flex flex-col col-span-1 sm:col-span-1">
                                <label className="mb-1 font-medium text-[#321E5D]">No. of Travelers</label>
                                <input
                                    type="number"
                                    placeholder="No. of Travelers"
                                    value={flight.noOfTravellers}
                                    onChange={(e) => handleFlightChange(index, "noOfTravellers", e.target.value)}
                                    onFocus={(e) => e.target.showPicker?.()}
                                    className="border border-[#680099] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-   [#541C9C]"
                                />
                            </div>
                        </div>
                    ))}
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={handleAddFlight}
                            className="px-6 py-2 bg-[#541C9C] hover:bg-[#680099] text-white rounded-lg transition-colors duration-300"
                        >
                            + Add Flight
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-6 py-2 bg-[#936FE0] hover:bg-[#680099] text-white rounded-lg transition-colors duration-300"
                        >
                            - Delete
                        </button>
                    </div>
                </div>

                {/* Itinerary Days */}
                <div>
                    <h2 className="font-bold mt-10 mb-4 text-[#321E5D] text-xl">Itinerary Days</h2>
                    {days.map((day, index) => (
                        <div key={index} className="border border-[#936FE0] p-6 rounded-lg mb-6">
                            <label className="block font-semibold text-[#321E5D] mb-2">Day {day.day} Date:</label>
                            <input
                                type="date"
                                value={day.date}
                                onChange={(e) => handleDayChange(index, "date", e.target.value)}
                                onFocus={(e) => e.target.showPicker?.()}
                                className="border border-[#680099] p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                            />
                            <label className="block font-semibold text-[#321E5D] mb-2">Topic:</label>
                            <input
                                type="text"
                                value={day.topic}
                                onChange={(e) => handleDayChange(index, "topic", e.target.value)}
                                className="border border-[#680099] p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                            />
                            <div className="mt-4">
                                <label className="block font-semibold text-[#321E5D] mb-2">Upload Image:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(index, file);
                                    }}
                                    className="mb-3"
                                />
                                {day.image && (
                                    <img
                                        src={day.image}
                                        alt="Preview"
                                        className="mt-2 rounded-full w-24 h-24 object-cover border border-[#680099]"
                                    />
                                )}
                            </div>
                            {day.activities.map((activity, aIndex) => (
                                <div key={aIndex} className="mb-3">
                                    <label className="block text-sm font-medium text-[#321E5D] mb-1">{activity.time}:</label>
                                    <textarea
                                        placeholder={`Activity for ${activity.time}`}
                                        value={activity.description}
                                        onChange={(e) => handleActivityChange(index, aIndex, e.target.value)}
                                        className="border border-[#680099] p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={handleAddDay}
                            className="px-6 py-2 bg-[#541C9C] hover:bg-[#680099] text-white rounded-lg transition-colors duration-300"
                        >
                            + Add Day
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-6 py-2 bg-[#936FE0] hover:bg-[#680099] text-white rounded-lg transition-colors duration-300"
                        >
                            - Delete
                        </button>
                    </div>
                </div>

                {/* Hotel Booking */}
                <div className="p-6 bg-[#FBF4FF] rounded-lg shadow-md mt-12">
                    <h2 className="text-2xl font-bold text-[#321E5D] mb-6">Hotel Booking</h2>
                    {bookings.map((booking, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-[#321E5D]">City</label>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={booking.city}
                                    onChange={(e) => handleBookingChange(index, "city", e.target.value)}
                                    className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-[#321E5D]">Check In</label>
                                <input
                                    type="date"
                                    placeholder="Check In"
                                    value={booking.checkIn}
                                    onChange={(e) => handleBookingChange(index, "checkIn", e.target.value)}
                                    onFocus={(e) => e.target.showPicker?.()}
                                    className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-[#321E5D]">Check Out</label>
                                <input
                                    type="date"
                                    placeholder="Check Out"
                                    value={booking.checkOut}
                                    onChange={(e) => handleBookingChange(index, "checkOut", e.target.value)}
                                    onFocus={(e) => e.target.showPicker?.()}
                                    className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                            <div className="flex flex-col col-span-1 sm:col-span-2">
                                <p className="border border-[#680099] p-3 rounded-lg text-[#321E5D]">Nights: {booking.nights}</p>
                            </div>
                            <div className="flex flex-col col-span-1 sm:col-span-2">
                                <label className="mb-2 font-semibold text-[#321E5D]">Hotel Name</label>
                                <input
                                    type="text"
                                    placeholder="Hotel Name"
                                    value={booking.hotelName}
                                    onChange={(e) => handleBookingChange(index, "hotelName", e.target.value)}
                                    className="border border-[#680099] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="px-6 py-2 bg-[#541C9C] hover:bg-[#680099] text-white rounded-lg transition-colors duration-300"
                        onClick={onAddBooking}
                    >
                        Add Booking
                    </button>
                </div>
                {/* Installment Breakdown Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Installment Breakdown</h2>
                    {installments.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-4 gap-4 bg-[#f6f0ff] border border-[#d3c2f2] rounded-xl p-4 mb-3 shadow-sm"
                        >
                            <input
                                className="p-3 rounded-md border border-[#d3c2f2] bg-white focus:outline-none focus:ring-2 focus:ring-[#b993f8]"
                                type="text"
                                placeholder="Installment"
                                value={item.installment}
                                onChange={(e) => updateInstallment(index, "installment", e.target.value)}
                                onFocus={(e) => e.target.showPicker?.()}
                            />
                            <input
                                className="p-3 rounded-md border border-[#d3c2f2] bg-white focus:outline-none focus:ring-2 focus:ring-[#b993f8]"
                                type="text"
                                placeholder="Amount"
                                value={item.amount}
                                onChange={(e) => updateInstallment(index, "amount", e.target.value)}
                            />
                            <input
                                className="p-3 rounded-md border border-[#d3c2f2] bg-white focus:outline-none focus:ring-2 focus:ring-[#b993f8]"
                                type="text"
                                placeholder="Due Date"
                                value={item.dueDate}
                                onChange={(e) => updateInstallment(index, "dueDate", e.target.value)}
                            />
                            <button
                                onClick={() => removeInstallment(index)}
                                className="text-sm text-red-600 hover:text-red-800 transition"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addInstallment}
                        className="mt-2 px-6 py-2 bg-[#541C9C] hover:bg-[#680099] text-white rounded-lg transition-colors duration-300"
                    >
                        Add Installment
                    </button>
                </div>

                {/* Payment Summary Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Payment Plan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {payments.map((p, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-sm text-[#321E5D] font-medium mb-1">{p.label}</label>
                                <input
                                    type="text"
                                    value={p.value}
                                    onChange={(e) => handlePaymentChange(index, "value", e.target.value)}
                                    className="p-3 border border-[#680099] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#541C9C]"
                                />
                            </div>
                        ))}
                    </div>
                </div>


                <button
                    type="submit"
                    className="mt-8 w-full px-6 py-3 bg-[#680099] hover:bg-[#541C9C] text-white rounded-lg font-semibold transition-colors duration-300 cursor-pointer mb-5"
                >
                    Generate Itinerary PDF
                </button>
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
