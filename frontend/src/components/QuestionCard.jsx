/* eslint-disable react/display-name */
import Linkify from "react-linkify";
import anonImg from "../assets/anonImg.jpg";
import { motion } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./zoom.css";
import { useState } from "react";
import LoadingSpinner from "../assets/LoadingSpinner";
import { forwardRef } from "react";

const colors = {
	default: "from-transparent",
	correct: "from-[#00ff0010]", //shadow-custom shadow-[#33ff004b]
	wrong: "from-[#ff00000c]", // shadow-custom shadow-[#ff00004b]
};

const QuestionCard = forwardRef((props, ref) => {
	const [mediaLoaded, setMediaLoaded] = useState(false);
	const [mediaError, setMediaError] = useState(false);
	const [removeImgDuration, setRemoveImgDuration] = useState(false);
	const componentDecorator = (href, text, key) => (
		<a className="text-cyan-500" title={href} href={href} key={key} target="_blank">
			{text.replace(/^(https?:\/\/)?(www\.)?/, "").slice(0, 20) + "..."}
		</a>
	);

	// Delay image loading to make the animation look better
	const imgLoaded = () => {
		setTimeout(() => setMediaLoaded(true), 300);
	};

	return (
		<div className="w-full duration-700 flex flex-col items-center justify-center gap-2 z-[1]">
			<motion.div
				initial={{
					y: 280,
					rotate: -10,
					scale: 0.6,
					opacity: 0,
					maxHeight: props.lastQuestionHeight,
				}}
				animate={{
					y: 0,
					rotate: 0,
					scale: 1,
					opacity: 1,
					maxHeight: 500,
				}}
				exit={{
					y: 0,
					rotate: 10,
					scale: 0,
					opacity: 0,
					transition: { type: "tween", ease: "backIn", duration: 0.6 },
				}}
				transition={{
					y: { type: "spring", stiffness: 45, velocity: -100 },
					rotate: { type: "spring", stiffness: 35 },
					height: { type: "tween", duration: 0.6 },
					minHeight: { type: "tween", duration: 0.6 },
					maxHeight: { type: "tween", duration: 0.6 },
				}}
				onAnimationStart={() => props.calculateHeight()}
				onAnimationComplete={() => props.calculateHeight()}
				ref={ref}
				className={
					"w-full lg:w-1/2 bg-gradient-to-t bg-blackishLight via-transparent to-transparent rounded-xl overflow-hidden py-6 lg:py-12 pr-1 lg:pr-8 pl-6 lg:pl-14 " +
					(props.highlight.length === 1
						? colors.correct
						: props.highlight.length === 2
						? colors.wrong
						: colors.default)
				}>
				{/* Main question */}
				<div
					className={
						"max-h-[215px] w-full flex gap-3 lg:gap-4 font-poppins " +
						(props.question?.content.length <= 0 && "mb-[-28px] lg:mb-[-36px]")
					}>
					{/* Avatar div */}
					<div className="w-12 lg:w-16 shrink">
						<img
							draggable="false"
							src={
								props.isAnon
									? anonImg
									: props.choices.find((e) => e.id === props.question?.author.id).avatar
							}
							alt="User avatar"
							className="max-w-full rounded-full"
						/>
					</div>
					{/* Question and name div */}
					<div className="h-full w-full shrink overflow-hidden">
						<h1 className="text-left text-sm lg:text-base font-medium opacity-50 text-whiteish select-none">
							{props.isAnon
								? "?????"
								: props.choices.find((e) => e.id === props.question?.author.id).nickname}
						</h1>
						<div className="max-h-[100px] w-full pr-3 overflow-y-auto break-words scrollNormal scrollbar scrollbar-thumb-whiteish scrollbar-thumb-rounded-full scrollbar-w-2">
							{/* Text field */}
							<div className="text-lg lg:text-2xl font-hanken text-white text-left">
								<Linkify componentDecorator={componentDecorator}>
									<p className="select-none">{props.question?.content}</p>
								</Linkify>
							</div>
						</div>
					</div>
				</div>
				{/* Embeds */}
				{props.question?.embeds.length > 0 && (
					<div className="max-h-[215px] w-1/2 lg:w-full flex gap-4 pl-14 lg:pl-[4.5rem] mt-2 lg:mt-4">
						{props.question?.embeds.map((e) => {
							return (
								<div key={e.url} className="duration-500">
									{!mediaLoaded &&
										(mediaError ? (
											<h1 className="text-left text-red-500 font-hanken">
												❌ Image could not be loaded
											</h1>
										) : (
											e.thumbnail?.url && <LoadingSpinner color={"white"} />
										))}
									<img
										onClick={() => window.open(e.url, "_blank")}
										style={mediaLoaded ? { maxHeight: "200px" } : { maxHeight: 0 }}
										onLoad={() => imgLoaded(true)}
										onError={() => setMediaError(true)}
										key={e.url}
										src={e.thumbnail?.url}
										alt={e.url}
										className="max-h-[200px] rounded-xl duration-500 origin-top-right hover:cursor-pointer"
									/>
								</div>
							);
						})}
					</div>
				)}
				{/* Attachments */}
				{props.question?.attachments.length > 0 && (
					<div className="max-h-[215px] w-1/2 lg:w-full flex gap-4 pl-14 lg:pl-[4.5rem] mt-2 lg:mt-4 duration-500">
						{props.question?.attachments.map((e) => {
							// Show vid or img
							if (/\.(mpg|mp2|mpeg|mpe|mpv|mp4|mov)$/i.test(e.url)) {
								return (
									<div key={e.url} className="duration-500 w-full">
										{!mediaLoaded &&
											(mediaError ? (
												<h1 className="text-left text-red-500 font-hanken">
													❌ Image could not be loaded
												</h1>
											) : (
												<LoadingSpinner color={"white"} />
											))}
										<video
											style={
												mediaLoaded
													? { maxHeight: "200px", transitionDelay: "0s" }
													: { maxHeight: 0, transitionDelay: "250ms" }
											}
											onDurationChange={() => setMediaLoaded(true)}
											key={e.url}
											src={e.url}
											onError={() => setMediaError(true)}
											controls
											className="max-h-[200px] w-full rounded-xl duration-500"
										/>
									</div>
								);
							} else {
								// Image
								return (
									<div key={e.url} className="duration-500">
										{!mediaLoaded &&
											(mediaError ? (
												<h1 className="text-left text-red-500 font-hanken">
													❌ Image could not be loaded
												</h1>
											) : (
												e.url && <LoadingSpinner color={"white"} />
											))}
										<Zoom key={e.url} zoomMargin={50} classDialog="custom-zoom">
											<img
												style={mediaLoaded ? { maxHeight: "200px" } : { maxHeight: 0 }}
												onClick={() => setRemoveImgDuration(true)}
												onLoad={() => setMediaLoaded(true)}
												src={e.url}
												alt={e.fileName}
												onError={() => setMediaError(true)}
												className={
													"max-h-[200px] rounded-xl origin-top-right" +
													(!removeImgDuration && " duration-500")
												}
											/>
										</Zoom>
									</div>
								);
							}
						})}
					</div>
				)}
			</motion.div>
		</div>
	);
});

export default QuestionCard;
