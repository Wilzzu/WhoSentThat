/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";
import supabase from "./utils/supabase";
import WhoStart from "./components/WhoStart";
import WhoPlaying from "./components/WhoPlaying";
import useLocalStorage from "./hooks/useLocalStorage";
import useAuthenticate from "./hooks/useAuthenticate";
import useGetQuestion from "./hooks/useGetQuestion";
import WhoEnd from "./components/WhoEnd";
import Footer from "./components/Footer";
import "./App.css";
import GDPRPopup from "./components/GDPRPopup";

const App = () => {
	// Setting user's session token used for questions
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
				}
			}
			// No user is signed in
			else {
				removeItem("WST", "token");
				setToken(null);
			}
			// When user signs out, clear all data
			if (event === "SIGNED_OUT") {
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
			className="flex flex-col items-center bg-gradient-to-br from-[#e0c3fc] to-[#8ec5fc] h-dvh overflow-y-auto scrollbar-thin scrollbar-w-1 lg:scrollbar-w-2 scrollbar-track-transparent scrollbar-thumb-[#3184ED] scrollbar-thumb-rounded-full">
			<div className="h-fit w-full lg:w-auto lg:max-w-[1280px] centerDiv">
				{/* Start scene */}
				{scene === "start" && (
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
				{scene === "end" && (
					<WhoEnd
						setScene={setScene}
						finalScore={finalScore}
						user={user?.data?.user?.user_metadata}
						reset={nextQuestion}
						correctAnswers={correctAnswers}
						highestStreak={highestStreak}
						questionTimes={questionTimes}
						startTime={startTime}
						pageExits={pageExits}
					/>
				)}
			</div>
			<GDPRPopup />
			<Footer />
		</main>
	);
};

export default App;
