import LoadingSpinner from "../assets/LoadingSpinner";
import useLocalStorage from "../hooks/useLocalStorage";
import LoginButton from "./login/LoginButton";
import anonImg from "../assets/anonImg.jpg";

const WhoStartButton = (props) => {
	const { getItem } = useLocalStorage();
	const token = getItem("WST", "token");

	const startAsDemoUser = () => {
		props.generateDemoUser();
		props.startGame();
	};

	// Show login button if user is not logged in
	if (props.user?.data?.user === null || !token) {
		return (
			<>
				<LoginButton />
				<p className="font-hanken font-medium text-whiteish text-shadow-normal shadow-[#3a3a3a81] mt-2 z-10">
					or
				</p>
				<button
					className="font-hanken text-whiteish text-shadow-normal shadow-[#3a3a3a81] underline cursor-pointer font-normal"
					onClick={startAsDemoUser}>
					Play as a demo user
				</button>
			</>
		);
	}

	// If error occurred while checking user's group membership
	if (props.auth?.authIsError) {
		return (
			<>
				<div className="bg-gradient-to-br bg-[#313131] to-transparent from-[#5c5c5c] opacity-30 w-48 lg:w-60 h-[4.25rem] lg:h-20 rounded-2xl duration-150 flex items-center justify-center">
					<p className="text-whiteish font-poppins text-3xl lg:text-4xl font-bold text-shadow-lg shadow-[#0000005b] select-none">
						Play
					</p>
				</div>
				<p className="font-hanken font-medium text-whiteish bg-red-500 rounded-lg py-1 px-2 bg-opacity-80 mt-2 text-shadow-normal shadow-[#0000004b]">
					An error occurred, please try again later
				</p>
			</>
		);
	}

	// If user is not authorized to play
	if (
		props.auth?.authData !== undefined &&
		!props.auth?.authData?.success &&
		!props.auth?.authLoading
	) {
		return (
			<>
				<button
					className="flex items-center justify-center bg-gradient-to-br bg-[#2F80ED] to-transparent from-[#56CCF2] w-48 lg:w-60 h-[4.25rem] lg:h-20 rounded-2xl duration-150 shadow-[12px_12px_38px_#1567ffa1,-12px_-12px_38px_#ffffff8c] hover:bg-[#b12fed] hover:scale-[1.04] hover:shadow-[12px_12px_38px_#b12fedaf,-12px_-12px_38px_#ffffff8c]"
					onClick={() => props.startGame()}>
					<p className="text-whiteish font-poppins text-3xl lg:text-4xl font-bold text-shadow-lg shadow-[#0000005b] select-none">
						Play
					</p>
				</button>
				{/* Logged user data */}
				{props.user?.data?.user && (
					<div className="flex items-center justify-between gap-2 mt-2 min-w-48 lg:min-w-60 p-1 bg-[#2F80ED40] rounded-md">
						<span className="flex items-center justify-center gap-2">
							<img
								src={props.user?.data?.user?.user_metadata?.avatar_url || anonImg}
								alt="User image"
								className="rounded-full w-4 lg:w-6 h-4 lg:h-6 drop-shadow-md shadow-[#0000004b]"
							/>
							<p className="font-hanken font-medium text-sm text-whiteish text-shadow-sm shadow-[#0000004b]">
								{props.user?.data?.user?.user_metadata?.custom_claims?.global_name ||
									props.user?.data?.user?.user_metadata?.name ||
									"Unknown"}
							</p>
						</span>
						<button
							onClick={props.handleLogout}
							className="underline text-whiteish ml-3 text-sm text-shadow-sm shadow-[#0000004b]">
							Log out
						</button>
					</div>
				)}
				<p className="font-hanken font-medium text-whiteish text-xs lg:text-base bg-blackish rounded-lg py-1 px-2 bg-opacity-80 mt-2 text-shadow-normal shadow-[#0000004b]">
					Only group members could play normally,
					<br />
					but this is a demo, so anyone can test it out!
				</p>
			</>
		);
	}

	// Otherwise show the play button or loading state
	return (
		<>
			<button
				className={
					"flex items-center justify-center bg-gradient-to-br bg-[#2F80ED] to-transparent from-[#56CCF2] w-48 lg:w-60 h-[4.25rem] lg:h-20 rounded-2xl duration-150 shadow-[12px_12px_38px_#1567ffa1,-12px_-12px_38px_#ffffff8c] " +
					(!props.auth?.authLoading &&
						props.auth?.authData?.success &&
						"hover:bg-[#b12fed] hover:scale-[1.04] hover:shadow-[12px_12px_38px_#b12fedaf,-12px_-12px_38px_#ffffff8c]")
				}
				disabled={props.auth?.authData?.success ? false : true}
				onClick={() => props.auth?.authData?.success && props.startGame()}>
				<p className="text-whiteish font-poppins text-3xl lg:text-4xl font-bold text-shadow-lg shadow-[#0000005b] select-none">
					{props.auth?.authData?.success ? "Play" : <LoadingSpinner color={"white"} />}
				</p>
			</button>
			{/* Logged user data */}
			{props.user?.data?.user && (
				<div className="flex items-center justify-between gap-2 mt-2 w-full p-1 bg-[#2F80ED40] rounded-md">
					<span className="flex items-center justify-center gap-2">
						<img
							src={props.user?.data?.user?.user_metadata?.avatar_url || anonImg}
							alt="User image"
							className="rounded-full w-4 lg:w-6 h-4 lg:h-6 drop-shadow-md shadow-[#0000004b]"
						/>
						<p className="font-hanken font-medium text-sm text-whiteish text-shadow-sm shadow-[#0000004b]">
							{props.user?.data?.user?.user_metadata?.custom_claims?.global_name ||
								props.user?.data?.user?.user_metadata?.name ||
								"Unknown"}
						</p>
					</span>
					<button
						onClick={props.handleLogout}
						className="underline text-whiteish ml-3 text-sm text-shadow-sm shadow-[#0000004b]">
						Log out
					</button>
				</div>
			)}
		</>
	);
};

export default WhoStartButton;
