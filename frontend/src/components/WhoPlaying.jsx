import { useEffect, useRef, useState } from "react";
import ChoiceButton from "./ChoiceButton";
import QuestionCard from "./QuestionCard";
import { AnimatePresence, motion } from "framer-motion";
import PreviousMessage from "./PreviousMessage";
import PowerupButton from "./PowerupButton";
import ChatBubbles from "../../assets/ChatBubbles";
import FiftyFifty from "../../assets/FiftyFifty";
import PointsUI from "./PointsUI";
import LoadingSpinner from "../../assets/LoadingSpinner";

const WhoPlaying = (props) => {
	// UI
	const [disable, setDisable] = useState(false);
	const [isAnon, setIsAnon] = useState(true);
	const [lastQuestionHeight, setLastQuestionHeight] = useState(152);
	const [choices, setChoices] = useState(null);
	const [showChoices, setShowChoices] = useState(true);
	const [showPrevScroll, setShowPrevScroll] = useState(false);
	const [highlightIds, setHighlightIds] = useState([]);
	const [showFirstLoading, setShowFirstLoading] = useState(false);

	// Game states
	const [questionReady, setQuestionReady] = useState(false);
	const [score, setScore] = useState(0);
	const [streak, setStreak] = useState(0);
	const [lives, setLives] = useState(3);
	const [fifty, setFifty] = useState(true);
	const [previousMsgs, setPreviousMsgs] = useState(true);
	const [showPreviousMsgs, setShowPreviousMsgs] = useState(false);
	const [endGame, setEndGame] = useState(false);
	const [questionStartTime, setQuestionStartTime] = useState(null);

	// Refs for question cards
	const mainRef = useRef(null);
	const prevRef = useRef(null);
	const prevRef2 = useRef(null);

	// Ref for activating streak toast
	const pointsRef = useRef(null);

	// DEV
	const devPoints = useRef(null);

	/////////////////////////////////////////////////////////////////////////////
	/* GAME STATES */
	/////////////////////////////////////////////////////////////////////////////

	// Reset everything and fetch new question
	useEffect(() => {
		setIsAnon(true);
		setScore(0);
		setStreak(0);
		setLives(3);
		setFifty(true);
		setPreviousMsgs(true);
		setQuestionReady(false);
		props.setStartTime(Date.now());
		props.setCorrectAnswers(0);
		props.setHighestStreak(0);
		props.setQuestionTimes([]);
		props.questionReset();
		props.setPageExits(0);
		if (!props.data) props.refetchQuestion();
		setTimeout(() => setShowFirstLoading(true), 4000);
	}, []);

	// When new data is fetched show new question, AKA start new round
	useEffect(() => {
		if (!props.data) return;
		setQuestionReady(true);
		setChoices(props.data[0]?.choices);
		setDisable(false);
		setHighlightIds([]);
		setQuestionStartTime(Date.now());
		// console.log(props.data[0]?.question.author.name); // Remove for final version
	}, [props.data]);

	// End current round
	const endRound = () => {
		setTimeout(() => {
			if (showPreviousMsgs) {
				setShowPreviousMsgs(false);
				setShowPrevScroll(false);
			}
			setShowChoices(false);
			setIsAnon(true);
			setQuestionReady(false);
			setChoices(null);
		}, 2000);
	};

	// For calculating bonus amount streaks give you and showing bonus toast
	const calcStreak = (amount) => {
		setScore((prev) => prev + 100 + amount);
		pointsRef.current.showBonus(amount);
	};

	/////////////////////////////////////////////////////////////////////////////
	/* CHOICE LOGIC */
	/////////////////////////////////////////////////////////////////////////////

	const correctAnswer = () => {
		// Add points depending on current streak
		if (streak + 1 === 3) calcStreak(100); // 3 in a row +100 bonus
		else if (streak + 1 === 5) calcStreak(300); // 5 in a row +300 bonus
		else if (streak + 1 === 10) calcStreak(1000); // 10 in a row +1000 bonus
		else if (streak + 1 >= 11) calcStreak((streak + 1 - 10) * 100);
		else setScore((prev) => prev + 100);
		// Every correct after 10 grants more points each time, else give normal 100

		// Update streak
		setStreak((prev) => prev + 1);

		// Update stats
		props.setCorrectAnswers((prev) => prev + 1);
		if (props.highestStreak < streak + 1) props.setHighestStreak(streak + 1);

		// End current round
		endRound();
	};

	const wrongAnswer = () => {
		setLives((prev) => prev - 1);
		setStreak(0);

		// If no lives left show end, else new round
		if (lives - 1 <= 0) {
			props.setFinalScore(score);
			choices.map((e) => (e.grayOut = true));
			setTimeout(() => setEndGame(true), 1000);
		} else endRound();
	};

	// When button is pressed check if the answer is correct
	const checkAnswer = (id) => {
		// Disable buttons
		setDisable(true);

		// Check if correct
		if (props.data[0].question.author.id === id) {
			correctAnswer();
			setHighlightIds([id]);
		} else {
			wrongAnswer();
			setHighlightIds([props.data[0].question.author.id, id]);
		}

		// Reveal correct user
		setIsAnon(false);

		props.setQuestionTimes((prev) => [...prev, Date.now() - questionStartTime - 1000]);
		setQuestionStartTime(null);
	};

	/////////////////////////////////////////////////////////////////////////////
	/* POWER UPS */
	/////////////////////////////////////////////////////////////////////////////

	const powerupFifty = () => {
		setFifty(false);

		// Add grayOut property to 2 random wrong choices
		let grayOut = choices.filter((e) => e.id !== props.data[0]?.question.author.id);
		grayOut.splice(Math.floor(Math.random() * 3), 1);
		choices.map((e) => (grayOut.find((user) => user.id === e.id) ? (e.grayOut = true) : e));
	};

	const powerupPrevMsgs = () => {
		setPreviousMsgs(false);
		setShowPreviousMsgs(true);
		setTimeout(() => setShowPrevScroll(true), 500); // Add scrollbar after 1/2 sec
	};

	// Calculate height for the container to have smooth transitions
	const calculateHeight = () => {
		if (mainRef?.current?.offsetHeight) {
			let sum = 0;
			if (prevRef?.current?.offsetHeight) sum += prevRef.current.offsetHeight + 8;
			if (prevRef2?.current?.offsetHeight) sum += prevRef2.current.offsetHeight + 8;
			sum += mainRef.current.offsetHeight;
			setLastQuestionHeight(sum);
		} else setLastQuestionHeight(152);
	};

	return (
		<AnimatePresence mode="wait" onExitComplete={() => props.setScene("end")}>
			{!endGame && (
				<div className="min-h-[100dvh] flex flex-col justify-center pb-20 lg:pt-2">
					{/* Question header */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{
							y: 200,
							opacity: 0,
							transition: {
								y: { ease: "circIn", duration: 1.4 },
								opacity: { duration: 0.5 },
								delay: 0.6,
							},
						}}
						transition={{ duration: 1, type: "tween", ease: "easeInOut" }}
						className="font-poppins font-black text-xl lg:text-3xl text-white mb-1 lg:mb-2 text-shadow shadow-[#00000042]">
						<h1>Who sent:</h1>
					</motion.div>

					{/* Question container*/}
					<motion.div
						exit={{
							y: -1000,
							opacity: 0,
							transition: { ease: "circIn", duration: 0.6, delay: 1.1 },
						}}
						style={{ minHeight: lastQuestionHeight }}
						className={
							"w-full px-1 lg:px-0 min-h-[152px] max-h-[450px] flex flex-col gap-1 lg:gap-2 items-center justify-start duration-700 mb-2 lg:mb-8 " +
							(showPreviousMsgs && " [overflow:overlay] ") +
							(!showPrevScroll && showPreviousMsgs && " scrollbar-none ") +
							(showPrevScroll &&
								" scrollNormal scrollbar scrollbar-thumb-[#25364d] scrollbar-thumb-rounded-full scrollbar-w-2")
						}>
						<AnimatePresence>
							{showPreviousMsgs &&
								props.data[0]?.previousMsgs.map((e, i) => {
									return (
										<PreviousMessage
											ref={i ? prevRef2 : prevRef}
											key={e.date}
											data={e}
											count={i}
											isAnon={isAnon}
										/>
									);
								})}
						</AnimatePresence>
						{/* Question Card */}
						{/* Enables buttons after card has exited */}
						{!props.data ? (
							<div className="p-2 flex flex-col gap-2 items-center font-poppins text-whiteish text-l">
								{showFirstLoading && (
									<>
										<p>Loading question...</p>
										<LoadingSpinner color={"white"} />
									</>
								)}
							</div>
						) : (
							<AnimatePresence mode="wait" onExitComplete={() => props.nextQuestion()}>
								{questionReady && (
									<QuestionCard
										ref={mainRef}
										lastQuestionHeight={lastQuestionHeight}
										key={props.data[0]?.question?.date}
										isAnon={isAnon}
										choices={choices}
										question={props.data[0]?.question}
										calculateHeight={calculateHeight}
										highlight={highlightIds}
									/>
								)}
							</AnimatePresence>
						)}
					</motion.div>

					{/* Choices and info */}
					<motion.div
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{
							y: 700,
							opacity: 0,
							transition: { ease: "circIn", duration: 0.6, delay: 1.1 },
						}}
						transition={{ scale: { type: "tween", duration: 1, ease: "easeInOut" } }}
						className="z-10 w-full p-1">
						<div className="flex justify-center">
							{/* Top Bar */}
							<motion.div
								initial={{ y: 100 }}
								animate={{
									y: 0,
									transition: { type: "spring", delay: 1.6, stiffness: 30, velocity: 20 }, // duration: 1.4, ease: "easeOut"
								}}
								exit={{
									y: 200,
									transition: { type: "tween", ease: "easeIn", duration: 0.6, delay: 0.8 },
								}}
								className="w-full lg:w-3/4 mt-8 lg:mt-10 flex items-center justify-between gap-2 lg:gap-5 h-12 lg:h-16 mb-2">
								{/* Lives */}
								<div className="h-full w-80 flex">
									<div className="h-full bg-gradient-to-br from-[#0F2027] to-[#1a2d33] px-3 lg:px-6 rounded-xl flex items-center justify-center gap-2 shadow-md select-none">
										<h1 className="font-poppins font-bold shadow-[#9292929d] text-shadow-lg text-[#fff0f0] hidden lg:block">
											Lives:
										</h1>
										<div className="flex gap-1 shadow-[#ff6f6f9d] text-shadow-lg text-xs lg:text-base">
											<p className={"duration-500 " + (lives < 1 && "opacity-20")}>❤</p>
											<p className={"duration-500 " + (lives < 2 && "opacity-20")}>❤</p>
											<p className={"duration-500 " + (lives < 3 && "opacity-20")}>❤</p>
										</div>
									</div>
								</div>

								{/* Power-ups */}
								<div className="h-full flex gap-2 lg:gap-3">
									<PowerupButton
										type={previousMsgs}
										name={"2 previous messages"}
										function={powerupPrevMsgs}
										icon={<ChatBubbles color={"white"} />}
										disable={disable}
										dir={"bg-gradient-to-bl"}
									/>
									<PowerupButton
										type={fifty}
										name={"50/50"}
										function={powerupFifty}
										icon={<FiftyFifty color={"white"} />}
										disable={disable}
										dir={"bg-gradient-to-br"}
									/>
								</div>
								{/* Score */}
								<div className="h-full w-80 flex justify-end">
									<PointsUI ref={pointsRef} score={score} streak={streak} />
								</div>
							</motion.div>
						</div>
						{/* Choices container */}
						<div className="flex justify-center">
							<div className="h-[204px] lg:h-[240px] w-full lg:w-3/4 overflow-hidden grid grid-cols-2 gap-3 lg:gap-4 bg-[#0F2027] bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#1b3946] rounded-lg lg:rounded-xl p-4 lg:p-8 z-10 shadow-xl">
								<AnimatePresence onExitComplete={() => setShowChoices(true)}>
									{showChoices &&
										choices?.map((e, i) => {
											return (
												<ChoiceButton
													key={e.uuid}
													data={e}
													timing={i}
													checkAnswer={checkAnswer}
													highlight={highlightIds}
													disable={disable}
												/>
											);
										})}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>

					{/* DEV */}
					{/* <div className="absolute top-20 right-10 flex flex-col gap-5 z-10">
						<input ref={devPoints} type="number" defaultValue={0} className="text-center h-10" />
						<button
							onClick={() => setScore(devPoints.current.value)}
							className="p-6 bg-green-300 rounded-md text-white text-shadow-sm shadow-black font-poppins">
							Set points
						</button>
						<button
							onClick={() => setLives(0)}
							className="p-6 bg-orange-300 rounded-md text-white text-shadow-sm shadow-black font-poppins">
							0 lives
						</button>
						<button
							onClick={() => wrongAnswer()}
							className="p-6 bg-red-300 rounded-md text-white text-shadow-sm shadow-black font-poppins">
							Wrong answer
						</button>
					</div> */}
				</div>
			)}
		</AnimatePresence>
	);
};

export default WhoPlaying;
