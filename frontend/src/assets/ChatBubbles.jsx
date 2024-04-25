const ChatBubbles = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		id="Layer_2"
		viewBox="0 0 335.13 305.39"
		width="100%"
		height="100%">
		<g id="Layer_1-2">
			<path
				d="M66.98 203.11v22.35c0 17.12 13.88 31 31 31h117.26l46.32 41.42.26-41.16 34.81-.26c17.12 0 31-13.88 31-31V109.4c0-17.12-13.88-31-31-31H97.98c-17.12 0-31 13.88-31 31v93.71"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="15px"
				fill="none"
				stroke={props.color}
			/>
			<rect
				width={159.87}
				height={16.26}
				x={116.53}
				y={133.37}
				rx={8.13}
				ry={8.13}
				fill={props.color}
			/>
			<rect
				width={159.87}
				height={16.26}
				x={116.53}
				y={187.76}
				rx={8.13}
				ry={8.13}
				fill={props.color}
			/>
			<path
				d="M297.95 72.7c0-17.12-13.88-31-31-31H68.31c-17.12 0-31 13.88-31 31v93.71M37.31 166.41v22.35c0 14.96 10.6 27.45 24.7 30.36"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="15px"
				fill="none"
				stroke={props.color}
			/>
			<path
				d="M268.15 38.5c0-17.12-13.88-31-31-31H38.5c-17.12 0-31 13.88-31 31v93.71M7.5 132.21v22.35c0 14.96 10.6 27.45 24.7 30.36"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="15px"
				fill="none"
				stroke={props.color}
			/>
		</g>
	</svg>
);
export default ChatBubbles;
