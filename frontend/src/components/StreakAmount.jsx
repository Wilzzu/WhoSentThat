import { motion } from "framer-motion";
// Colors for streak numbers
const colors = [
	"text-[#ffffff]",
	"text-[#ffffff]",
	"text-[#ffffff]",
	"text-[#47ff40]",
	"text-[#71ffec]",
	"text-[#62f5ff]",
	"text-[#ff5555]",
	"text-[#ff4df0]",
	"text-[#ffe032]",
	"animate-rainbow",
];

const StreakAmount = (props) => {
	return (
		<motion.div
			initial={{ y: 0 }}
			animate={{ y: -36 }}
			exit={{ y: 0 }}
			className="absolute pt-1 pb-2 lg:pb-4 mt-2 lg:mt-0 px-2 lg:px-8 rounded-lg bg-gradient-to-bl from-[#4590f1] to-[#46c0e9] z-[-2]">
			<p
				className={
					"text-white font-hanken text-xs lg:text-sm text-shadow " +
					(props.streak >= 5 && "shadow-[#cecece]")
				}>
				<span className={"font-bold " + colors[props.streak > 10 ? 9 : props.streak - 2]}>
					{props.streak}
				</span>{" "}
				streak
			</p>
		</motion.div>
	);
};

export default StreakAmount;
