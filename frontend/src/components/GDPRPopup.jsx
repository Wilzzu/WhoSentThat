import { motion } from "framer-motion";
import useLocalStorage from "../hooks/useLocalStorage";
import { useState } from "react";
import PrivacyPolicy from "./PrivacyPolicy";

const GDPRPopup = () => {
	const { getItem, setItem } = useLocalStorage();
	const [accepted, setAccepted] = useState(getItem("WST", "GDPR"));
	const [open, setOpen] = useState(false);

	const handleAccept = () => {
		setItem("WST", "GDPR", true);
		setAccepted(true);
	};

	if (accepted) return null;

	return (
		<>
			{/* Overflow hidden container */}
			<div className="w-full h-full absolute left-0 top-0 pointer-events-none overflow-hidden text-sm 2xl:text-base">
				{/* Popup */}
				<motion.div
					initial={{ y: 200, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ type: "spring", stiffness: 60, delay: 0.5 }}
					className="absolute p-4 pb-2 lg:pb-4 2xl:p-6 gap-4 flex bottom-6 lg:bottom-10 lg:left-10 bg-blue-500 rounded-md 2xl:rounded-xl text-white drop-shadow-lg z-50 pointer-events-auto">
					<div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
						<p className="drop-shadow-text text-left">
							This site uses local storage to enable various features. We also use trusted external{" "}
							<br className="hidden lg:inline-block" />
							providers who utilize cookies for secure login functionality and website protection.
						</p>
						{/* Buttons */}
						<span className="flex gap-2 lg:gap-0 border-t pt-2 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-3">
							<button
								onClick={() => setOpen(true)}
								className="h-full w-full text-center bg-blue-600 lg:bg-transparent hover:bg-blue-400 lg:hover:bg-blue-600 p-3 rounded-lg duration-150 text-nowrap">
								<p className="drop-shadow-text">Learn more</p>
							</button>
							<button
								onClick={handleAccept}
								className="h-full w-full text-center bg-blue-600 lg:bg-transparent hover:bg-blue-400 lg:hover:bg-blue-600 p-3 rounded-lg duration-150 text-nowrap">
								<p className="drop-shadow-text">Ok, got it!</p>
							</button>
						</span>
					</div>
				</motion.div>
			</div>
			{open && <PrivacyPolicy open={open} setOpen={setOpen} />}
		</>
	);
};

export default GDPRPopup;
