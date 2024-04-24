const PowerupButton = (props) => {
	return (
		<button
			disabled={!props.type || props.disable}
			onClick={() => props.function()}
			className={
				props.dir +
				" bg-[#3985e7] to-[#46c0e9] from-transparent rounded-lg h-full aspect-[3/2] duration-150 flex items-center justify-center hover:scale-105 disabled:hover:scale-100 " +
				(!props.type && "opacity-30") +
				(props.name === "50/50" ? " p-4 lg:p-6" : " p-5 lg:p-7")
			}>
			<div className={"shadow-black drop-shadow-md duration-500 " + (!props.type && "opacity-50")}>
				{props.icon}
			</div>
		</button>
	);
};

export default PowerupButton;
