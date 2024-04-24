const WhoStatsItem = (props) => {
	return (
		<div className="flex flex-col items-center justify-center">
			<p className="font-hanken text-sm lg:text-base font-bold text-blackishLight opacity-90">
				{props.text}
			</p>
			<p className="font-poppins lg:text-lg font-bold text-blue-500">{props.value}</p>
		</div>
	);
};

export default WhoStatsItem;
