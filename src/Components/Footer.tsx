import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-200 px-6 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-700">
            <div className="text-center md:text-left mb-4 md:mb-0 max-w-md">
                <strong className="block text-gray-900 mb-1">Vigovia Tech Pvt. Ltd</strong>
                <p>Registered Office: Hd-109 Cinnabar Hills,</p>
                <p>Links Business Park, Karnataka, India.</p>
            </div>

            <div className="text-center md:text-left mb-4 md:mb-0">
                <p>
                    <strong>Phone:</strong> +91-99X9999999
                </p>
                <p>
                    <strong>Email:</strong> Contact@Vigovia.Com
                </p>
            </div>

            <div className="flex justify-center md:justify-end">
                <img
                    src="../../public/assets/Group 1707485521.png"
                    alt="Vigovia Logo"
                    className="h-12 w-auto"
                />
            </div>
        </footer>
    );
};

export default Footer;
