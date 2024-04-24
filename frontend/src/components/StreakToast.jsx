import { motion } from "framer-motion";

const StreakToast = (props) => {
	return (
		<>
			<motion.div
				initial={{ y: 0, x: 30, scale: 0.7, rotate: -3 }}
				animate={{ y: -55, x: 40, scale: 1, rotate: 6 }}
				exit={{ y: 0, x: 30, scale: 0.65, rotate: -3 }}
				className="hidden lg:block px-6 pb-6 pt-4 bg-gradient-to-br from-whoGreen to-[#8dff6a] rounded-lg absolute shadow-custom2 shadow-[#46ff6e] z-[-1] flex-col">
				<p className="font-poppins text-white font-bold text-sm text-shadow shadow-[#44b6b0] m-[-4px]">
					BONUS
				</p>
				<p className="font-poppins text-white font-bold text-lg text-shadow shadow-[#237c78]">
					+{props.score}
				</p>
			</motion.div>
			<motion.div
				initial={{ y: 0, x: 0, scale: 0.7, rotate: -3 }}
				animate={{ y: -38, x: 6, scale: 1, rotate: 6 }}
				exit={{ y: 0, x: 0, scale: 0.65, rotate: -3 }}
				className="lg:hidden px-3 pb-4 pt-2 lg:mt-auto bg-gradient-to-br from-whoGreen to-[#8dff6a] rounded-lg absolute shadow-custom2 shadow-[#46ff6e] z-[-1] flex-col">
				<p className="font-poppins text-white font-bold text-xs text-shadow shadow-[#44b6b0] m-[-4px]">
					BONUS
				</p>
				<p className="font-poppins text-white font-bold text-sm text-shadow shadow-[#237c78]">
					+{props.score}
				</p>
			</motion.div>
		</>
	);
};

export default StreakToast;
