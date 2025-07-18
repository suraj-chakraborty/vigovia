export interface Activity {
    time: 'Morning' | 'Afternoon' | 'Evening';
    description: string;
}

export interface DayPlan {
    formattedDate(formattedDate: any, arg1: number, arg2: number, arg3: { align: "center"; }): unknown;
    day: number;
    image: string;
    topic: string;
    date: string;
    activities: Activity[];
}

export interface FlightInfo {
    departureDate: string;
    from: string;
    to: string;
    arrivalDate: string;
    noOfTravellers: string;
}

export interface ItineraryData {
    name: string;
    departureCity: string;
    destinationCity: string;
    departureDate: string;
    returnDate: string;
    travelers: number;
    days: DayPlan[];
    flights: FlightInfo[];
    bookings: HotelBooking[];
}

export interface HotelBooking {
    city: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    hotelName: string;
};

export interface StaticData {
    city: string,
    activity: string,
    type: string,
    time: string,
}
