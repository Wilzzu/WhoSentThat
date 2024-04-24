import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useGetQuestion = (auth = null) => {
	const queryClient = useQueryClient();
	const {
		data: questionData,
		isLoading: questionLoading,
		isError: questionIsError,
		refetch,
	} = useQuery(
		["question"],
		async () => {
			return axios
				.get(`${import.meta.env.VITE_API_URL}/api/new`, {
					headers: { Authorization: `Bearer ${auth}` },
				})
				.then((res, err) => {
					if (res) return res.data;
					else console.log(err);
				});
		},
		{ enabled: false, retry: false }
	);

	const refetchQuestion = () => {
		refetch();
	};

	const questionReset = () => {
		queryClient.removeQueries("question");
	};

	return { questionData, questionLoading, questionIsError, refetchQuestion, questionReset };
};

export default useGetQuestion;
