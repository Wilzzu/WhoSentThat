import { cubicBezier, motion } from "framer-motion";

const cardColors = [
	"from-[#ee36ff] via-[#559fff] to-[#e561ff] outline-[#ffca58] text-whiteish",
	"from-[#3e92ff] to-[#b085ff] outline-[#76b1ff] text-whiteish",
	"from-[#61abff] to-[#a7c6ff] outline-[#7bb4ff] text-whiteish",
	"from-[#fcfcfc] to-[#d7e5ff] outline-white text-blue-500",
];

const pointBgColors = [
	"from-[#2475df] to-[#f47eff]",
	"from-[#2475df] to-[#ba7eff]",
	"from-[#2475df] to-[#a07eff]",
	"from-[#4394ff] to-[#5179ff]",
];

const WhoLeaderboardItem = (props) => {
	return (
		<motion.div
			className={
				(props.pos <= 2 ? cardColors[props.pos] : cardColors[3]) +
				" w-full flex items-center justify-between h-14 px-2 lg:px-6 lg:pl-4 py-2 select-none rounded-lg outline outline-1 bg-gradient-to-tr shadow-md " +
				(props.data.newScore && " z-[1]")
			}
			layout
			transition={{ type: "tween", duration: 2.15, ease: cubicBezier(0.6, 0.64, 0.26, 1.1) }}
			// Show scrollbar when animation has finished
			onLayoutAnimationComplete={() => props.setShowScrollbar(true)}>
			{/* User info */}
			<div
				className={
					"flex items-center text-base lg:text-xl gap-2 lg:gap-3 font-poppins font-bold " +
					(props.pos <= 2 && "text-shadow-sm shadow-[#636363]")
				}>
				{/* Position */}
				<p className="w-6 lg:w-9">{props.pos + 1}.</p>
				{/* Avatar */}
				{props.data.user?.avatar && (
					<img
						className="h-9 lg:h-10 rounded-full opacity-80"
						src={props.data.user?.avatar}
						alt={props.data.user?.nickname + "'s Avatar"}
					/>
				)}
				{/* Name */}
				{props.data.user?.nickname ? (
					<p className="line-clamp-1 text-left">{props.data.user?.nickname}</p>
				) : (
					<p className="text-red-400 font-semibold text-base">Player could not be loaded</p>
				)}
			</div>
			{/* Score */}
			<div
				className={
					"py-2 px-3 lg:px-5 text-sm lg:text-base rounded-md bg-gradient-to-tl font-hanken font-bold text-white shadow-md " +
					(props.pos <= 2 ? pointBgColors[props.pos] : pointBgColors[3])
				}>
				<p className="text-shadow-sm shadow-[#727272]">{props.data.score}</p>
			</div>
		</motion.div>
	);
};

export default WhoLeaderboardItem;
