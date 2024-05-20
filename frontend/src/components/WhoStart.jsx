import { useState } from "react";
import heroImg from "../assets/WhoHero.png";
import HeroMessageCard from "./HeroMessageCard";
import WhoStartButton from "./WhoStartButton";
import { AnimatePresence, motion } from "framer-motion";
import WhoLeaderboard from "./WhoLeaderboard";
import useGetScoreboard from "../hooks/useGetScoreboard";
import { useEffect } from "react";

const WhoStart = (props) => {
	const { scoreboardData, scoreboardIsLoading, scoreboardIsError } = useGetScoreboard();
	const [leaderboard, setLeaderboard] = useState(null);
	const [hideElements, setHideElements] = useState(false);

	useEffect(() => {
		if (!scoreboardData) return;
		setLeaderboard([...scoreboardData].sort((a, b) => b.score - a.score));
	}, [scoreboardData]);

	const startGame = () => {
		setHideElements(true);
	};

	return (
		<AnimatePresence mode="wait" onExitComplete={() => props.setScene("playing")}>
			{!hideElements && (
				<div className="h-full flex flex-col gap-6 items-center py-8 overflow-hidden">
					{/* Header */}
					<motion.div
						animate={{ y: 0, opacity: 1 }}
						exit={{
							y: -80,
							opacity: 0,
							transition: {
								type: "tween",
								duration: 0.6,
								ease: "easeInOut",
								opacity: { duration: 0.4 },
							},
						}}
						transition={{ type: "tween", duration: 0.6, ease: "easeOut" }}
						className="relative lg:w-full flex flex-col items-center pb-10 lg:pb-[4.5rem] mb-6">
						<img src={heroImg} alt="Hero image" className="select-none px-3 lg:px-0" />
						<div className="min-w-[70%] bg-blackishLight rounded-xl py-4 lg:py-10 pl-6 lg:pl-14 lg:pr-8 absolute bottom-0 shadow-[#ffffff1e] shadow-inner drop-shadow-[0_20px_20px_rgba(0,0,0,0.35)] z-10">
							<HeroMessageCard auth={props.auth?.authData} />
						</div>
					</motion.div>

					{/* Start button */}
					<motion.div
						animate={{ y: 0, opacity: 1 }}
						exit={{
							y: -40,
							opacity: 0,
							transition: {
								opacity: { duration: 0.2 },
								y: { type: "tween", duration: 0.6, ease: "easeInOut" },
								delay: 0.1,
							},
						}}
						transition={{ type: "tween", duration: 0.6, ease: "easeInOut" }}
						className="flex flex-col items-center h-56">
						<WhoStartButton
							user={props.user}
							auth={props.auth}
							generateDemoUser={props.generateDemoUser}
							startGame={startGame}
							handleLogout={props.handleLogout}
						/>
					</motion.div>
					{/* Spacer */}
					<motion.div
						initial={{ y: 0, opacity: 0.3 }}
						animate={{ y: 0, opacity: 0.3 }}
						exit={{ y: 20, opacity: 0 }}
						transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
						className="bg-whiteish h-1 w-9/12 lg:w-5/6 rounded-full"
					/>

					<div className="w-full flex justify-center h-[28rem] mb-10 lg:mb-16">
						{/* Leaderboard */}
						<motion.div
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 80, opacity: 0, transition: { delay: 0, ease: "easeIn" } }}
							transition={{ type: "tween", duration: 0.6, ease: "easeOut", delay: 0.1 }}
							className="flex flex-col h-fit max-h-[28rem] overflow-hidden items-center gap-2 bg-gradient-to-br from-[#3589f7] to-[#84bdff] w-11/12 lg:w-3/4 p-4 rounded-xl shadow-2xl shadow-blue-400">
							<h1 className="font-poppins text-lg lg:text-2xl font-bold text-whiteish text-left text-shadow-lg shadow-[#9b99ff]">
								Leaderboard
							</h1>
							<WhoLeaderboard
								data={leaderboard}
								loading={scoreboardIsLoading}
								error={scoreboardIsError}
								showScoreboard={true}
							/>
						</motion.div>
					</div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default WhoStart;
