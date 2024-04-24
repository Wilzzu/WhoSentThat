import { motion } from "framer-motion";
import { useState } from "react";

const colors = {
	normal: "to-[#56CCF2]",
	correct: "to-[#1eff00c5]",
	wrong: "to-[#f84343ff]",
};

const ChoiceButton = (props) => {
	const [disable, setDisable] = useState(true);

	return (
		<motion.button
			initial={{ scale: 0.6, opacity: 0 }}
			animate={{
				scale: 1,
				opacity: 1,
				transition: { delay: disable ? 1 + props.timing * 0.2 : 0 },
			}}
			exit={{
				scale: 0.4,
				opacity: 0,
				transition: {
					scale: {
						type: "tween",
						ease: "backOut",
						duration: 0.6,
					},
					opacity: { duration: 0.15 },
					delay: props.timing * 0.1,
				},
			}}
			transition={{
				scale: { type: "tween", ease: "backOut", duration: 0.2 },
				delay: 1 + props.timing * 0.2,
				duration: 0.2,
			}}
			whileTap={
				!props.disable &&
				!props.data.grayOut && { scale: 0.98, transition: { delay: 0, duration: 0.15 } }
			}
			// Enable button only after the animation has ended
			onAnimationComplete={() => setDisable(false)}
			disabled={disable || props.disable || props.data.grayOut}
			className={`flex items-center justify-center gap-2 lg:gap-5 px-1 lg:px-2 bg-gradient-to-l bg-[#2F80ED] from-transparent rounded-lg h-20 shadow-inner shadow-[#ffffff38] 
			${!props.disable && !props.data.grayOut && "hover:bg-[#68a9ff]"} 
			${
				props.highlight.length >= 1
					? props.highlight[0] === props.data.id
						? colors.correct
						: props.highlight[1] === props.data.id
						? colors.wrong
						: colors.normal
					: colors.normal
			}
			${!disable && "duration-150"}
			${
				props.data.grayOut &&
				(props.highlight[0] === props.data.id || props.highlight[1] === props.data.id
					? "bg-opacity-10 shadow-none duration-500"
					: "bg-opacity-10 to-[#56cbf217] shadow-none duration-500")
			}`}
			onClick={() => props.checkAnswer(props.data.id)}>
			<img
				draggable="false"
				className={`rounded-full h-9 lg:h-[3.75rem] ${
					props.data.grayOut && "opacity-20 duration-500"
				}`}
				src={props.data.avatar}
				alt=""
			/>
			<h1
				className={`text-whiteish font-poppins text-base lg:text-xl truncate ${
					props.data.grayOut && "opacity-20 duration-500"
				}`}>
				{props.data.nickname}
			</h1>
		</motion.button>
	);
};

export default ChoiceButton;
