/* eslint-disable react/display-name */
import Linkify from "react-linkify";
import { motion } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./zoom.css";
import { useState } from "react";
import LoadingSpinner from "../assets/LoadingSpinner";
import { forwardRef } from "react";

const PreviousMessage = forwardRef((props, ref) => {
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
		setTimeout(() => {
			setMediaLoaded(true);
		}, 300);
	};

	return (
		<motion.div
			ref={ref}
			initial={{
				y: -50 * (props.count + 1) * -1,
				opacity: 0,
			}}
			animate={{
				y: 0,
				rotate: 0,
				scale: 1,
				opacity: 1,
				transition: { delay: (props.count - 1) * -0.2, duration: 0.4, ease: "easeOut" },
			}}
			exit={{
				scale: 0,
				opacity: 0,
				transition: { delay: props.count * 0.1, duration: 0.55, ease: "easeIn" },
			}}
			transition={{
				rotate: { type: "spring", stiffness: 35 },
				height: { type: "tween", duration: 0.6 },
				minHeight: { type: "tween", duration: 0.6 },
				maxHeight: { type: "tween", duration: 0.6 },
			}}
			className={
				"w-full lg:w-1/2 pl-4 lg:pl-14 bg-blackishLight rounded-xl py-4 pr-2 lg:pr-8 " +
				(props.count ? "bg-opacity-[0.90]" : "bg-opacity-[0.85]")
			}>
			{/* Main question */}
			<div className="max-h-[215px] w-full flex gap-4 font-poppins">
				{/* Question and name div */}
				<p className="text-left mt-[2px] text-sm lg:text-lg font-medium opacity-50 text-whiteish select-none">
					{props.isAnon ? "?????" : props.data.author.name}:
				</p>
				<div className="max-h-[100px] w-full pr-3 overflow-y-auto break-words scrollNormal scrollbar-thin scrollbar-w-1 scrollbar-thumb-whiteish scrollbar-thumb-rounded-full">
					{/* Text field */}
					{props.data.content.length > 0 && (
						<div className="text-lg lg:text-2xl font-hanken text-white text-left">
							<Linkify componentDecorator={componentDecorator}>
								<p className="select-none">{props.data.content}</p>
							</Linkify>
						</div>
					)}
					{/* Embeds */}
					{props.data.embeds.length > 0 && (
						<div className="max-h-[215px] w-full flex gap-4 pl-[4.5rem] mt-4">
							{props.data.embeds.map((e) => {
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
					{props.data.attachments.length > 0 && (
						<div className="max-h-[215px] w-full flex gap-4 pl-[4.5rem] mt-4 duration-500">
							{props.data.attachments.map((e) => {
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
				</div>
			</div>
		</motion.div>
	);
});

export default PreviousMessage;
