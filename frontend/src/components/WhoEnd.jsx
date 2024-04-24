import { useEffect, useState } from "react";
import usePostScore from "../../hooks/who/usePostScore";
import WhoLeaderboard from "./WhoLeaderboard";
import useGetScoreboard from "../../hooks/who/useGetScoreboard";
import useGetUser from "../../hooks/useGetUser";
import WhoScoreCard from "./WhoScoreCard";
import { AnimatePresence, motion } from "framer-motion";

const WhoEnd = (props) => {
	const [newLeaderboard, setNewLeaderboard] = useState(null); //null
	const [newScoreAnimate, setNewScoreAnimate] = useState(0);
	const [hideElements, setHideElements] = useState(false);
	const [showScoreboard, setShowScoreboard] = useState(false);

	// Scoreboard data fetching and posting
	const { scoreboardData, scoreboardIsLoading, scoreboardIsError } = useGetScoreboard();
	const { postData, postLoading, postIsError } = usePostScore(
		props.user.id,
		props.user.discord.name,
		props.finalScore,
		props.correctAnswers,
		props.highestStreak,
		Date.now() - props.startTime,
		props.questionTimes,
		props.pageExits
	);

	const { userData, userIsLoading, userIsError } = useGetUser(props.user.id);

	// Do end animation and restart game
	const restartGame = () => {
		props.reset();
		setHideElements(true);
	};

	const sortLeaderboard = () => {
		setNewLeaderboard((prev) => [...prev].sort((a, b) => b.score - a.score));
	};

	// If new/better score is added, filter scoreboard, remove players score if higher, put it to last, then put it to the correct pos
	useEffect(() => {
		if (
			!postData ||
			!scoreboardData ||
			scoreboardIsLoading ||
			!userData ||
			userIsLoading ||
			!showScoreboard
		)
			return;
		// 200 new score, 201 no previous score, 202 Highscore
		if (postData === 200 || postData === 201 || postData === 202) {
			let filteredLeaderboard = scoreboardData.filter((e) => {
				return e.id !== props.user.id;
			});
			filteredLeaderboard.push({
				user: userData,
				id: props.user.id,
				score: props.finalScore,
				newScore: true,
			});

			setNewLeaderboard(filteredLeaderboard);
			setNewScoreAnimate(postData);
			setTimeout(() => sortLeaderboard(), 550);
		} else setNewLeaderboard(scoreboardData);
	}, [postData, scoreboardData, userData, showScoreboard]);

	return (
		<AnimatePresence mode="wait" onExitComplete={() => props.setScene("playing")}>
			{!hideElements && (
				<div className="flex flex-col gap-6 py-4 items-center min-h-dvh justify-center overflow-hidden">
					{/* Score card */}
					<motion.div
						className="w-full h-full flex items-center justify-center"
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{
							y: -150,
							opacity: 0,
							transition: {
								type: "tween",
								duration: 0.6,
								ease: "easeInOut",
								opacity: { duration: 0.4 },
							},
						}}
						transition={{ type: "tween", duration: 0.6, ease: "easeOut" }}>
						<WhoScoreCard
							user={userData}
							loading={userIsLoading}
							error={userIsError}
							score={props.finalScore}
							postData={postData}
							correctAnswers={props.correctAnswers}
							highestStreak={props.highestStreak}
							time={Date.now() - props.startTime}
							questionTimes={props.questionTimes}
						/>
					</motion.div>

					{/* Play again */}
					<motion.div
						initial={{ y: -20, opacity: 0, transition: { delay: 0.4 } }}
						animate={{ y: 0, opacity: 1 }}
						exit={{
							y: -120,
							opacity: 0,
							transition: {
								opacity: { duration: 0.2 },
								y: { type: "tween", duration: 0.6, ease: "easeInOut" },
								delay: 0.1,
							},
						}}
						transition={{ type: "tween", duration: 0.6, ease: "easeInOut" }}>
						<button
							className="py-4 px-8 bg-gradient-to-tl bg-[#6e9eff] from-transparent to-[#48bcff]
							rounded-2xl duration-150 shadow-[8px_8px_28px_#1567ff7c,-8px_-8px_28px_#ffffff8c] hover:bg-[#ba4eec] hover:scale-[1.04] hover:shadow-[12px_12px_38px_#a22cda7c,-12px_-12px_38px_#ffffff8c] mb-10"
							onClick={() => restartGame()}>
							<p className="text-whiteish font-poppins text-xl font-bold text-shadow-normal shadow-[#00000031]">
								Play again
							</p>
						</button>
					</motion.div>

					{/* Spacer */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 0.3 }}
						exit={{ y: 20, opacity: 0 }}
						transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
						className="bg-whiteish h-1 w-9/12 lg:w-3/5 rounded-full"
					/>
					{/* Leaderboard */}
					<div className="w-full flex justify-center h-[23rem] mb-10 lg:mb-16">
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 80, opacity: 0, transition: { delay: 0, ease: "easeIn" } }}
							transition={{ type: "tween", duration: 0.6, ease: "easeOut", delay: 0.1 }}
							onAnimationComplete={() => setShowScoreboard(true)}
							className="flex flex-col h-fit max-h-[23rem] overflow-hidden items-center gap-2 bg-gradient-to-br from-[#3589f7] to-[#84bdff] w-11/12 lg:w-1/2 p-4 rounded-xl shadow-2xl shadow-blue-400 mb-10 lg:mb-20">
							<h1 className="font-poppins text-lg lg:text-2xl font-bold text-whiteish text-left text-shadow-lg shadow-[#9b99ff]">
								Leaderboard
							</h1>

							<WhoLeaderboard
								data={newLeaderboard}
								loading={scoreboardIsLoading}
								error={scoreboardIsError}
								newScoreAnimate={newScoreAnimate}
								showScoreboard={showScoreboard}
							/>
						</motion.div>
					</div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default WhoEnd;
