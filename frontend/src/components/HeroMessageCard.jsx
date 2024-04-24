import anonImg from "../assets/anonImg.jpg";
import { TypeAnimation } from "react-type-animation";
import useShuffleHero from "../hooks/useShuffleHero";

const HeroMessageCard = (props) => {
	const messageArray = useShuffleHero(props.auth);

	return (
		<div className="w-full flex gap-2 lg:gap-4 font-poppins">
			{/* Avatar div */}
			<div className="w-10 lg:w-16">
				<img
					draggable="false"
					src={anonImg}
					alt="User avatar"
					className="max-w-full rounded-full"
				/>
			</div>
			{/* Question and name div */}
			<div className="h-full w-full shrink overflow-hidden">
				<h1 className="text-left text-xs lg:text-base font-medium opacity-50 text-whiteish select-none">
					?????
				</h1>
				<div className="max-h-[100px] w-full pr-3">
					{/* First message card */}
					<div className="lg:text-2xl font-hanken text-white text-left select-none h-5 lg:h-8">
						{messageArray && (
							<TypeAnimation
								sequence={messageArray}
								wrapper="span"
								cursor={true}
								repeat={Infinity}
								speed={{ type: "keyStrokeDelayInMs", value: 110 }}
								deletionSpeed={80}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroMessageCard;
