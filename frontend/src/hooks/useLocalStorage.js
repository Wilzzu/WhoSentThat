const useLocalStorage = () => {
	// Key: Name of the group of items eg. "WST", Item: Name of the item eg. "token", Value: Value of the item
	const setItem = (key, item, value) => {
		try {
			const data = JSON.parse(localStorage.getItem(key) || "{}");
			data[item] = value;
			localStorage.setItem(key, JSON.stringify(data));
		} catch (e) {
			console.error(e);
		}
	};

	const getItem = (key, item) => {
		try {
			const data = JSON.parse(localStorage.getItem(key) || "{}");
			return data[item];
		} catch (e) {
			console.error(e);
		}
	};

	const removeItem = (key, item) => {
		try {
			const data = JSON.parse(localStorage.getItem(key) || "{}");
			delete data[item];
			localStorage.setItem(key, JSON.stringify(data));
		} catch (e) {
			console.error(e);
		}
	};

	return {
		getItem,
		setItem,
		removeItem,
	};
};

export default useLocalStorage;
