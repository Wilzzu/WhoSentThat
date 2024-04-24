import { useQuery } from "react-query";
import axios from "axios";

const useAuthenticate = (token) => {
	const {
		data: authData,
		isLoading: authLoading,
		isError: authIsError,
		refetch,
	} = useQuery(
		["authenticate"],
		async () => {
			return axios
				.get(`${import.meta.env.VITE_API_URL}/api/authenticate`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res, err) => {
					if (res) return res.data;
					else console.log(err);
				});
		},
		{ enabled: false, retry: false }
	);

	const refetchAuth = () => {
		refetch();
	};

	return { authData, authLoading, authIsError, refetchAuth };
};

export default useAuthenticate;
