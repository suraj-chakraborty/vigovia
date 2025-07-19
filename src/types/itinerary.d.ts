export interface Activity {
    time: 'Morning' | 'Afternoon' | 'Evening';
    description: string;
}

export interface DayPlan {
    formattedDate?(formattedDate: string, arg1: number, arg2: number, arg3: { align: "center"; }): date;
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
    noOfTravellers: ItineraryData["travelers"];
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


export type ButtonProps = {
    label: string;
    onClick: () => void;
    secondary?: boolean;
};

export type InputProps = {
    label: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export interface PDFDocument {
    internal: {
        pageSize: {
            getWidth: () => number;
        };
    };
    setFillColor: (r: number, g: number, b: number) => void;
    roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) => void;
    rect: (x: number, y: number, w: number, h: number, style: string) => void;
    setFontSize: (size: number) => void;
    setTextColor: (color: string | number, g?: number, b?: number) => void;
    setFont: (fontName: string, fontStyle?: string) => void;
    text: (text: string, x: number, y: number, options?: { align?: string }) => void;
    splitTextToSize: (text: string, maxWidth: number) => string[];
}

export type TableHeadings = string[];
export type TableRows = (string | number | undefined)[][];
