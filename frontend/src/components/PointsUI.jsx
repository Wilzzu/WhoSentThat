/* eslint-disable react/display-name */
import { AnimatePresence } from "framer-motion";
import StreakToast from "./StreakToast";
import { forwardRef, useImperativeHandle, useState } from "react";
import StreakAmount from "./StreakAmount";

const PointsUI = forwardRef((props, ref) => {
	const [showToast, setShowToast] = useState(false);
	const [bonusAmount, setBonusAmount] = useState(0);

	// Enable using functions from parent script
	useImperativeHandle(ref, () => ({
		showBonus(amount) {
			setBonusAmount(amount);
			setShowToast(true);
			setTimeout(() => {
				setShowToast(false);
			}, 2500);
		},
	}));

	return (
		<div className="flex items-center justify-center">
			{/* Points container */}
			<div className="h-full duration-300 bg-gradient-to-br from-[#0F2027] to-[#1a2d33] rounded-xl flex items-center justify-center gap-2 shadow-md select-none px-1 lg:px-8">
				<h1 className="min-w-[74px] lg:min-w-[106px] font-poppins text-white text-shadow-lg shadow-[#9292929d] text-[0] lg:text-base">
					Score:{" "}
					<span className="font-bold text-shadow-lg shadow-[#ffffff67] text-base">
						{props.score}
					</span>
				</h1>
			</div>
			{/* Streak amount */}
			<AnimatePresence>
				{props.streak >= 2 && <StreakAmount streak={props.streak} />}
			</AnimatePresence>
			{/* Bonus streak */}
			<AnimatePresence>{showToast && <StreakToast score={bonusAmount} />}</AnimatePresence>
		</div>
	);
});

export default PointsUI;
