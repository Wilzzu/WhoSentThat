import { useEffect, useRef, useState } from "react";
import WhoLeaderboardItem from "./WhoLeaderboardItem";
import LoadingSpinner from "../../assets/LoadingSpinner";
import { useReward } from "react-rewards";

const WhoLeaderboard = (props) => {
	const [initialized, setInitialized] = useState(false);
	const [showScrollbar, setShowScrollbar] = useState(false);
	const [newShadowDur, setNewShadowDur] = useState(false);
	const [confettiAmount, setConfettiAmount] = useState(0);

	const leaderboard = useRef(null);
	const botShadow = useRef(null);

	// Confetti
	const { reward } = useReward("reward", "confetti", {
		lifetime: 1000,
		spread: 150,
		startVelocity: 40,
		elementCount: 110,
		elementSize: 12,
		zIndex: 10,
	});

	// Check when shadow should be shown
	const handleShadow = (element) => {
		if (!showScrollbar) return;
		const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
		if (distanceFromBottom < 20) botShadow.current.style.opacity = 0;
		else botShadow.current.style.opacity = 0.18;

		// Shorten shadow duration after initial transition
		if (!newShadowDur) {
			setNewShadowDur(true);
			setTimeout(() => (botShadow.current.style.transitionDuration = "0.15s"), 1000);
		}
	};

	// When highscore show more confetti
	useEffect(() => {
		if (confettiAmount && confettiAmount <= 2) {
			const confettiInterval = setInterval(() => {
				reward();
				setConfettiAmount((prev) => prev + 1);
			}, 800);

			return () => clearInterval(confettiInterval);
		}
	}, [confettiAmount]);

	useEffect(() => {
		// Check if the shadow should be shown instantly, before scrolling
		handleShadow(leaderboard?.current);

		// If user got new score, show confetti after scrolling is done
		if (
			showScrollbar &&
			(props.newScoreAnimate === 200 ||
				props.newScoreAnimate === 201 ||
				props.newScoreAnimate === 202)
		) {
			reward();

			// If highscore, show more confetti and send discord notification
			if (props.newScoreAnimate === 202) setConfettiAmount(1);
		}
	}, [showScrollbar]);

	// Scroll to the bottom of the leaderboard if new score
	useEffect(() => {
		if (!props.data || props.loading || props.error || initialized) return;
		// If user didn't reach higher score than before, don't scroll down and show the scrollbar and shadows instantly
		if (!props.newScoreAnimate) {
			setShowScrollbar(true);
			handleShadow(leaderboard?.current);
		}
		// If user got new highscore, scroll down
		else {
			leaderboard?.current.scrollTo({
				top: leaderboard?.current.scrollHeight,
				behavior: "instant",
			});
			// Check if user got the lowest score. If so show scroll and shadows instantly
			const minValue = Math.min(...props.data.map((e) => e.score));
			const userNewScore = props.data.find((e) => e.newScore === true);
			if (userNewScore.score <= minValue) {
				setShowScrollbar(true);
				handleShadow(leaderboard?.current);
			}
		}
		setInitialized(true);
	}, [props.data]);

	return (
		<div
			ref={leaderboard}
			onScroll={(e) => handleShadow(e.target)}
			style={{ WebkitMaskPosition: showScrollbar && "left top" }} // Animate scrollbar to show smoothly
			className="relative w-full overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-[#F8F8F8] scrollOpacity">
			{/* Items */}
			{props.error ? (
				<p className="text-red-500 text-shadow-sm shadow-[#ff979783] font-hanken font-medium text-lg">
					Leaderboard could not be loaded
				</p>
			) : props.loading || !props.showScoreboard ? (
				<div className="p-2 flex flex-col gap-2 items-center font-hanken text-whiteish text-lg opacity-50">
					<p>Loading leaderboard...</p>
					<LoadingSpinner color={"white"} />
				</div>
			) : props.data ? (
				<div className="p-1 lg:p-2 pr-2 lg:pr-4 flex flex-col gap-2">
					{props.data &&
						props.data.map((e, i) => {
							return (
								<WhoLeaderboardItem
									key={e.id}
									data={e}
									pos={i}
									setShowScrollbar={setShowScrollbar}
								/>
							);
						})}
				</div>
			) : (
				<div className="p-2 flex flex-col gap-2 items-center font-hanken text-whiteish text-lg opacity-50">
					<p>Loading leaderboard...</p>
					<LoadingSpinner color={"white"} />
				</div>
			)}
			{/* Bottom Shadow */}
			<div
				ref={botShadow}
				style={{ opacity: 0, transitionDuration: "1s" }}
				className="sticky w-[150%] translate-x-[-17%] z-10 bottom-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-black via-transparent to-transparent h-[3.5rem] mt-[-3.5rem]"
			/>
		</div>
	);
};

export default WhoLeaderboard;
