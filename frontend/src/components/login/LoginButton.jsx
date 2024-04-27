import supabase from "../../utils/supabase";
import { FaDiscord } from "react-icons/fa";

const LoginButton = () => {
	async function signInWithDiscord() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "discord",
			options: { scopes: "guilds" },
		});
		if (error) console.log(error);
	}

	return (
		<button
			className="flex items-center justify-center gap-2 bg-gradient-to-br bg-[#2F80ED] to-transparent from-[#56CCF2] w-48 lg:w-60 h-[4.25rem] lg:h-20 rounded-2xl duration-150 shadow-[12px_12px_38px_#1567ffa1,-12px_-12px_38px_#ffffff8c] hover:bg-[#b12fed] hover:scale-[1.03] hover:shadow-[12px_12px_38px_#b12fedaf,-12px_-12px_38px_#ffffff8c]"
			onClick={signInWithDiscord}>
			<FaDiscord className="text-whiteish text-3xl lg:text-4xl drop-shadow-md" />
			<p className="text-whiteish font-poppins text-1xl lg:text-2xl font-bold text-shadow-lg shadow-[#00000038] select-none">
				Login
			</p>
		</button>
	);
};

export default LoginButton;
