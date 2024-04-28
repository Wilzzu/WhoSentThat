import { useQuery } from "react-query";
import axios from "axios";

const useGetScoreboard = () => {
	const {
		data: scoreboardData,
		isLoading: scoreboardIsLoading,
		isError: scoreboardIsError,
	} = useQuery(["scoreboard"], async () => {
		return axios.get(`${import.meta.env.VITE_API_URL}/api/scoreboard`).then(async (res) => {
			return res.data.sort((a, b) => b.score - a.score);
		});
	});

	return { scoreboardData, scoreboardIsLoading, scoreboardIsError };
};

export default useGetScoreboard;
