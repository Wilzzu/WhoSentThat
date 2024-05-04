import { useEffect, useState } from "react";
import { heroMessagesSafe, heroMessagesShowOnlyForGroupMembers } from "../configs/config.json";

const useShuffleHero = (auth) => {
	const [messages, setMessages] = useState(null);
	const [shuffledArray, setShuffledArray] = useState(null);
	const [finalArray, setFinalArray] = useState(null);

	// If user is group member show all messages, if not only safe messages
	useEffect(() => {
		if (auth?.success) setMessages([...heroMessagesSafe, ...heroMessagesShowOnlyForGroupMembers]);
		else setMessages(heroMessagesSafe);
	}, [auth]);

	// Shuffle all messages
	useEffect(() => {
		if (!messages) return;
		setShuffledArray(shuffle(messages));
	}, [messages]);

	// Add timings to the array
	useEffect(() => {
		if (!shuffledArray) return;
		setFinalArray(constructFinalArray(shuffledArray));
	}, [shuffledArray]);

	function shuffle(messages) {
		let currentIndex = messages.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex != 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// Swap it with the current element.
			[messages[currentIndex], messages[randomIndex]] = [
				messages[randomIndex],
				messages[currentIndex],
			];
		}

		return messages;
	}

	// Create timing array
	function constructFinalArray(array) {
		const timingArray = [];
		const stitchArray = [];
		for (let i = 0; i < array.length; i++) {
			if (i === 0) timingArray.push(2000);
			else timingArray.push(4000);
		}

		array.forEach((e, i) => {
			stitchArray.push(array[i], timingArray[i]);
		});

		return stitchArray;
	}
	return finalArray;
};

export default useShuffleHero;
