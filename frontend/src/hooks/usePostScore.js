import { useQuery } from "react-query";
import axios from "axios";
import CryptoJS from "crypto-js";

const usePostScore = (
	id,
	name,
	avatar,
	score,
	correct,
	highestStreak,
	time,
	timePerQ,
	pageExits,
	auth = null
) => {
	// Encrypt user score
	const encryptedScore = CryptoJS.AES.encrypt(
		JSON.stringify({
			id,
			name,
			avatar,
			score,
			correct,
			highestStreak,
			time,
			timePerQ,
			pageExits,
			crypto: import.meta.env.VITE_CRYPTOWORD,
		}),
		import.meta.env.VITE_CRYPTOPASS
	).toString();
	const {
		data: postData,
		isLoading: postLoading,
		isError: postIsError,
	} = useQuery(["whoPost"], async () => {
		return axios
			.post(
				`${import.meta.env.VITE_API_URL}/api/addScore`,
				{ score: encryptedScore },
				{
					headers: { Authorization: `Bearer ${auth}` },
				}
			)
			.then((res) => {
				return res.status;
			})
			.catch((error) => {
				console.error("There was an error!", error);
				return 500;
			});
	});

	return { postData, postLoading, postIsError };
};

export default usePostScore;
