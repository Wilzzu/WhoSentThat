import supabase from "../../utils/supabase";

const LoginButton = () => {
	async function signInWithDiscord() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "discord",
			options: { scopes: "guilds" },
		});
		if (error) console.log(error);
	}

	return <button onClick={signInWithDiscord}>Login</button>;
};

export default LoginButton;
