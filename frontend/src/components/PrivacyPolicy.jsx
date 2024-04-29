import { useEffect, useRef } from "react";
import { Modal } from "react-responsive-modal";

const PrivacyPolicy = ({ open, setOpen }) => {
	const ref = useRef(null);

	// Scroll to top when modal opens
	useEffect(() => {
		setTimeout(() => {
			if (ref.current)
				// Probably not the best way to get the container, but it works
				document.getElementById("modalContainer").scrollTo({ top: 0, behavior: "smooth" });
		}, 100);
	}, [ref]);

	return (
		<Modal
			ref={ref}
			open={open}
			onClose={() => setOpen(false)}
			classNames={{ modal: "customModal" }}
			containerId="modalContainer">
			<span className="gdpr font-poppins text-blackish">
				<h1>Cookie and Privacy Policy</h1>
				<br />
				<h2>Introduction</h2>
				<p>
					This website, whosentthat.wilzzu.dev, values your privacy. This policy explains our use of
					local storage and cookies, and how we use third party services to provide a functional and
					secure website experience.
				</p>
				<br />

				<h2>Local Storage</h2>
				<h3>What is local storage?</h3>
				<p>
					Local storage is a browser feature allowing websites to store small amounts of data on
					your device. It is used to save user preferences and settings.
				</p>
				<h3>How we use local storage</h3>
				<p>
					If you are logged in, your Discord token will be encrypted and saved to local storage to
					make future requests. The token is used to check if you are part of the correct Discord
					server. This token will only exist on your machine until you log off. If you rather play
					as a demo user, we will generate a random ID for you on the first session and save it to
					local storage. This ID is used to update your position on the leaderboard.
				</p>
				<h3>How to manage local storage</h3>
				<p>
					You can adjust your browser settings to manage or delete local storage data. Note that
					disabling it may prevent preference saving on our website.
				</p>
				<br />

				<h2>Cookies</h2>
				<h3>What are cookies?</h3>
				<p>
					Cookies are small files that are stored on your device when you visit a website. They are
					used to remember your preferences and provide a personalized experience.
				</p>
				<h3>How we use cookies</h3>
				<p>
					We use cookies to provide secure login functionality and website protection. We use
					trusted external providers to handle these services.
				</p>

				<h3>How to manage cookies</h3>
				<p>
					You can adjust your browser settings to manage or delete cookies. Note that disabling them
					may prevent some website functionality.
				</p>
				<br />

				<h2>Third Party Services</h2>
				<p>We use essential third-party services to provide necessary website functionality:</p>

				<h3>Supabase</h3>
				<p>
					We use Supabase for secure login functionality and user data storage. Supabase may use
					cookies to manage secure login sessions. For details, please refer to{" "}
					<a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">
						their privacy policy
					</a>
					.
				</p>

				<h3>Cloudflare</h3>
				<p>
					We use Cloudflare for website protection and performance optimization. Cloudflare may use
					cookies to manage website protection and performance. For details, please refer to{" "}
					<a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">
						their privacy policy
					</a>{" "}
					and{" "}
					<a
						href="https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/"
						target="_blank"
						rel="noreferrer">
						cookie policy
					</a>
					.
				</p>

				<br />

				<h2>Data we collect</h2>
				<h3>Through Local Storage:</h3>
				<p>
					Non-identifying data associated with your user preferences, as outlined in the{" "}
					{'"Local Storage"'} section.
				</p>
				<h3>Through Supabase:</h3>
				<p>
					Data associated with your user account, as outlined in{" "}
					<a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">
						{"Supabase's"} privacy policy
					</a>
					.
				</p>
				<h3>Through Cloudflare:</h3>
				<p>
					Non-identifying data associated with website protection and performance, as outlined in{" "}
					<a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">
						{"Cloudflare's"} privacy policy
					</a>
					.
				</p>
				<br />

				<h2>Data Security</h2>
				<p>
					We take data security seriously and have implemented measures to protect your data. We use
					secure and trusted third-party services to handle user data and website protection.
				</p>
				<br />

				<h2>Your Rights under GDPR</h2>
				<p>
					You have the right to access, update, or delete your personal data. If you wish to
					exercise these rights, you can:
				</p>
				<ul>
					<li>
						<b>
							Submit a request through our{" "}
							<a href="https://forms.gle/T8n1GeVGkZ6HWRSw6" target="_blank" rel="noreferrer">
								GDPR Data Request Form
							</a>
							.
						</b>
					</li>
					<li>
						<b>Contact us at:</b> <a href="mailto:wilzzudev@gmail.com">wilzzudev@gmail.com</a>
					</li>
				</ul>
				<br />
				<h2>Changes to this policy</h2>
				<p>
					We may update this policy to reflect changes in our practices or for other operational,
					legal, or regulatory reasons.
				</p>
				<br />
				<h2>Contact us</h2>
				<p>
					If you have any questions or concerns about our privacy policy, please contact us at{" "}
					<a href="mailto:wilzzudev@gmail.com">wilzzudev@gmail.com</a>.
				</p>
				<br />
			</span>
		</Modal>
	);
};

export default PrivacyPolicy;
