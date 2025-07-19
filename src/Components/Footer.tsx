import React from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
} from "react-icons/fa";

import logoImage from "../assets/Group1707485521.png"
import stripe from "../assets/stripe.png"
import razor from "../assets/Page-1.png"

const Footer: React.FC = () => {
    return (
        <footer className=" text-white  text-sm font-light">
            <div className="bg-white text-[#1C0C37]">
                <div className="max-w-7xl mx-auto px-6 py-6 border-b border-gray-300">
                    <div className="flex flex-wrap justify-between gap-6">
                        {[
                            {
                                title: "Our offerings",
                                items: ["Holidays", "Visa", "Forex", "Hotels", "Flights"],
                            },
                            {
                                title: "Popular destinations",
                                items: ["Dubai", "Bali", "Thailand", "Singapore", "Malaysia"],
                            },
                            {
                                title: "Vigovia Specials",
                                items: [
                                    "Featured Experience",
                                    "Group Tours",
                                    "Backpackers Club",
                                    "Offline Events",
                                ],
                            },
                            {
                                title: "Company",
                                items: [
                                    "About Us",
                                    "Careers",
                                    "Vigovia Blog",
                                    "Partner Portal",
                                    "Accreditations",
                                ],
                            },
                            {
                                title: "More",
                                items: ["Investor Relations", "Forex", "FAQs", "Domestic Holidays"],
                            },
                        ].map((section) => (
                            <div key={section.title} className="min-w-[150px]">
                                <h3 className="font-medium mb-2">{section.title}</h3>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Help Section */}
                        <div className="min-w-[200px] space-y-2 text-sm">
                            <div className="bg-[#1C0C37] text-white px-3 py-1 rounded-full inline-block text-xs font-semibold">
                                Need help? Call us
                            </div>
                            <div className="font-bold text-sm">+91-98xxx64641</div>
                            <div className="text-sm">Email</div>
                            <div className="text-sm text-gray-600">contact@vigovia.com</div>
                            <div className="text-sm mt-2">Address</div>
                            <div className="text-gray-600 text-sm leading-tight">
                                HD-109 Cinnabar Hills,
                                <br />
                                Links Business Park, Bangalore North,
                                <br />
                                Karnataka, India - 560071
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#F9EEFF] ">
                {/* Logo */}
                <div className="flex items-center gap-2 ">
                    <img src={logoImage} alt="Vigovia Logo" className="h-6" />
                </div>

                {/* Payments */}
                <div className=" text-center">
                    <div className="text-xs font-medium">Payments</div>
                    <div className="flex flex-row gap-1">
                        <img src={stripe} alt="Stripe" className="h-4 mt-1 mx-auto" />
                        <img src={razor} alt="Stripe" className="h-4 mt-1 mx-auto" />
                    </div>
                </div>


            </div>

            <div className="max-w-7xl mx-auto px-6 pb-6 flex flex-col md:flex-row justify-between items-center text-xs border-t border-[#5E4A7D] pt-4 text-gray-400">
                <div>© 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.</div>
                {/* Social Icons */}
                <div className="flex gap-4 text-white text-lg">
                    <a href="#" aria-label="Facebook">
                        <FaFacebookF />
                    </a>
                    <a href="#" aria-label="Instagram">
                        <FaInstagram />
                    </a>
                    <a href="#" aria-label="LinkedIn">
                        <FaLinkedinIn />
                    </a>
                    <a href="#" aria-label="YouTube">
                        <FaYoutube />
                    </a>
                </div>
                <div className="flex gap-4 mt-2 md:mt-0">
                    <a href="#">Privacy policy</a>
                    <a href="#">Legal notice</a>
                    <a href="#">Accessibility</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
