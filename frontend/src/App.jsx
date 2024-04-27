/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import WhoStart from "./components/WhoStart";
// import WhoPlaying from "./components/WhoPlaying";
// import WhoEnd from "./components/WhoEnd";
// import useGetQuestion from "./hooks/useGetQuestion";
// import useWhoAuth from "./hooks/useWhoAuth";
import supabase from "./utils/supabase";
import { useQueryClient } from "react-query";
import useLocalStorage from "./hooks/useLocalStorage";
import useAuthenticate from "./hooks/useAuthenticate";
import useGetQuestion from "./hooks/useGetQuestion";
import WhoPlaying from "./components/WhoPlaying";
import "./App.css";
import Footer from "./components/Footer";
import { v4 as uuid } from "uuid";

const App = () => {
	// Setting user's session token used for questions
	// const [token, setToken] = useState(null);
	const queryClient = useQueryClient();
	const { getItem, setItem, removeItem } = useLocalStorage();
	const [token, setToken] = useState(getItem("WST", "token"));
	const { authData, authLoading, authIsError, refetchAuth } = useAuthenticate(token);
	const [user, setUser] = useState(null);

	const demoUserId = () => {
		let id = getItem("WST", "demo_id");
		if (!id) {
			id = uuid();
			setItem("WST", "demo_id", id);
		}
		return id;
	};

	const generateDemoUser = () => {
		const demoUser = {
			data: {
				user: {
					user_metadata: {
						provider_id: demoUserId(),
						custom_claims: {
							global_name: "Demo User",
						},
						name: "Demo User",
						avatar_url: "/anonImg.jpg",
					},
				},
			},
		};

		setUser(demoUser);
	};

	const getLoggedUser = async () => {
		const user = await supabase.auth.getUser();
		console.log(user);
		if (user && user?.data?.user) setUser(user);
	};

	// Authenticate user and save token to local storage
	useEffect(() => {
		getLoggedUser();
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			// User is signed in
			if (session) {
				// Save token
				if (session.provider_token) {
					setItem("WST", "token", session.provider_token);
					setToken(session.provider_token);
					console.log("Signed in");
				}
			}
			// No user is signed in
			else {
				console.log("No session");
				removeItem("WST", "token");
				setToken(null);
			}
			// When user signs out, clear all data
			if (event === "SIGNED_OUT") {
				console.log("Signed out");
				removeItem("WST", "token");
				setToken(null);
				queryClient.removeQueries();
			}
		});

		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

	// When token changes, check if user with that token is group member
	useEffect(() => {
		if (!token) return;
		refetchAuth();
	}, [token]);

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error("Error: ", error?.message);
	};

	// Fetching question and auth
	const { questionData, questionLoading, questionIsError, refetchQuestion, questionReset } =
		useGetQuestion(token);
	const [questions, setQuestions] = useState(null);

	// Add new question to the question array
	useEffect(() => {
		if (!questionData) return;
		if (!questions) setQuestions([questionData]);
		else setQuestions((prev) => [...prev, questionData]);
	}, [questionData]);

	useEffect(() => {
		if (questions && questions.length < 3) refetchQuestion();
	}, [questions]);

	const nextQuestion = () => {
		setQuestions((prev) => [...prev.slice(1)]);
	};

	// Game states
	const [scene, setScene] = useState("start");

	// Stats
	const [finalScore, setFinalScore] = useState(0);
	const [pageExits, setPageExits] = useState(0);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [highestStreak, setHighestStreak] = useState(0);
	const [questionTimes, setQuestionTimes] = useState([]); // Time for each question, only show average time taken for a question to user
	const [startTime, setStartTime] = useState(0); // Add endTime to "end" scene and calculate time between those two

	return (
		<main
			onMouseLeave={() => setPageExits((prev) => prev + 1)}
			className="flex flex-col items-center bg-gradient-to-br from-[#e0c3fc] to-[#8ec5fc] h-dvh overflow-y-auto scrollbar-thin scrollbar-thumb-[#3184ED] scrollbar-thumb-rounded-full">
			<div className="h-fit lg:max-w-[1280px] centerDiv">
				{/* Start scene */}
				{scene === "start" && (
					// <div>Under Construction!</div>
					<WhoStart
						setScene={setScene}
						user={user}
						generateDemoUser={generateDemoUser}
						handleLogout={handleLogout}
						auth={{ authData, authLoading, authIsError }}
					/>
				)}
				{/* Gameplay scene */}
				{scene === "playing" && (
					<WhoPlaying
						data={questions}
						loading={questionLoading}
						error={questionIsError}
						setScene={setScene}
						refetchQuestion={refetchQuestion}
						setFinalScore={setFinalScore}
						nextQuestion={nextQuestion}
						questionReset={questionReset}
						setPageExits={setPageExits}
						setCorrectAnswers={setCorrectAnswers}
						highestStreak={highestStreak}
						setHighestStreak={setHighestStreak}
						setQuestionTimes={setQuestionTimes}
						setStartTime={setStartTime}
					/>
				)}
				{/* End scene */}
				{/*{scene === "end" && (
					<WhoEnd
						setScene={setScene}
						finalScore={finalScore}
						user={user}
						reset={nextQuestion}
						correctAnswers={correctAnswers}
						highestStreak={highestStreak}
						questionTimes={questionTimes}
						startTime={startTime}
						pageExits={pageExits}
					/>
				)}*/}
			</div>
			<Footer />
		</main>
	);
};

export default App;
