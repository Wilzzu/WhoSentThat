import { useEffect, useState } from "react";
import WhoStatsItem from "./WhoStatsItem";

const WhoStats = (props) => {
	const [time, setTime] = useState(0);
	const [avgTime, setAvgTime] = useState(0);

	// Calculate times
	const formatTime = (time, addPadding) => {
		const date = new Date(time);
		const min = date.getUTCMinutes();
		let sec = date.getUTCSeconds();
		const hour = date.getUTCHours();
		if (sec < 10 && addPadding) sec = sec.toString().padStart(2, "0");

		return `${hour > 0 ? hour + "h " : ""}${min > 0 ? min + "m " : ""}${sec}s`;
	};

	useEffect(() => {
		setTime(formatTime(props.time, true));

		const avgTime = Math.ceil(props.qTimes.reduce((a, b) => a + b, 0) / props.qTimes.length);
		if (avgTime >= 1000) setAvgTime("~" + formatTime(avgTime));
		else setAvgTime("~" + avgTime + "ms");
	}, []);

	return (
		<div className="grid grid-cols-2 gap-3 lg:gap-0 lg:flex items-center justify-between w-full px-4">
			<WhoStatsItem text={"Correct answers"} value={props.correct} />
			<WhoStatsItem text={"Longest streak"} value={props.streak} />
			<WhoStatsItem text={"Time"} value={time} />
			<WhoStatsItem text={"Time Per Question"} value={avgTime} />
		</div>
	);
};

export default WhoStats;
