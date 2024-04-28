import { motion } from "framer-motion";
import WhoStats from "./WhoStats";

const WhoScoreCard = (props) => {
	return (
		<div className="flex flex-col px-1 lg:px-0 w-full lg:w-1/2">
			<motion.div
				initial={{ y: 6, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 6, opacity: 0, transition: { delay: 0 } }}
				transition={{
					type: "tween",
					delay: 0.2,
					ease: "easeInOut",
					y: { duration: 0.5 },
					opacity: { duration: 1 },
				}}>
				{props.postData === 200 ||
					props.postData === 201 ||
					(props.postData === 202 && (
						<p className="font-poppins text-[#fafcff] font-bold text-xl lg:text-2xl text-shadow-normal shadow-[#7889bd]">
							NEW RECORD!
						</p>
					))}
			</motion.div>
			{/* Confetti */}
			<span id="reward" />
			{/* Score card */}
			<div
				className={
					props.postData === 200 || props.postData === 201 || props.postData === 202
						? "p-1 lg:p-2 bgRainbowColors animate-bgRainbow rounded-[1.25rem] lg:rounded-3xl"
						: "false"
				}>
				<div className="flex flex-col items-center justify-center py-3 px-1 lg:py-6 lg:px-8 gap-4 lg:gap-7 bg-gradient-to-br from-[#fcfcfc] to-[#d7e5ff] shadow-custom2 shadow-whiteishDarker rounded-2xl">
					{/* TOP */}
					<div className="flex gap-4 lg:gap-8 items-center justify-center">
						{/* User info */}
						<div className="flex gap-2 lg:gap-4 items-center">
							{props.loading ? (
								<>
									<div className="h-12 lg:h-20 rounded-full aspect-square bg-[#d3d3d3] animate-pulse" />
									<p className="font-placeholder text-2xl lg:text-4xl text-[#d3d3d3] animate-pulse">
										Loading...
									</p>
								</>
							) : props?.user ? (
								<>
									<img
										className="rounded-full max-h-12 lg:max-h-20"
										src={props?.user?.avatar_url}
										alt=""
									/>
									<p className="text-blue-500 font-poppins text-2xl lg:text-3xl font-bold text-left py-1 line-clamp-1">
										{props?.user?.custom_claims?.global_name || props?.user?.name}
									</p>
								</>
							) : (
								<p className="text-red-400 font-hanken text-lg lg:text-2xl font-semibold">
									Player could not be loaded
								</p>
							)}
						</div>
						{/* Score */}
						<div className="py-1 px-3 lg:py-2 lg:px-4 rounded-md bg-gradient-to-tl from-[#4394ff] to-[#5179ff] font-hanken font-bold text-white shadow-md">
							<div className="bg-inherit rounded-md">
								<p className="text-shadow-sm shadow-[#727272] text-lg lg:text-2xl">{props.score}</p>
							</div>
						</div>
					</div>
					{/* BOTTOM */}
					<WhoStats
						correct={props.correctAnswers}
						streak={props.highestStreak}
						time={props.time}
						qTimes={props.questionTimes}
					/>
				</div>
			</div>
		</div>
	);
};

export default WhoScoreCard;
