import { useState } from "react";
import "react-responsive-modal/styles.css";
import PrivacyPolicy from "./PrivacyPolicy";

const Footer = () => {
	const [open, setOpen] = useState(false);

	return (
		<footer>
			<ul className="flex items-center justify-center py-5 gap-2 text-shadow-sm shadow-[#00000073] font-poppins text-whiteish">
				<li>
					<a href="https://github.com/Wilzzu">© 2024 Wilzzu</a>
				</li>
				<li>
					<button onClick={() => setOpen(true)}>
						<span className="underline text-whiteish text-shadow-sm shadow-[#00000073] hover:no-underline">
							Privacy Policy
						</span>
					</button>
				</li>
			</ul>
			{open && <PrivacyPolicy open={open} setOpen={setOpen} />}
		</footer>
	);
};

export default Footer;
