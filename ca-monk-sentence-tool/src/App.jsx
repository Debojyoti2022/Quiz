import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SentenceCard from "./components/SentenceCard";

function App() {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [timer, setTimer] = useState(30);
  const [canProceed, setCanProceed] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch questions
  useEffect(() => {
    fetch("http://localhost:3001/questions")
      .then((res) => res.json())
      .then((data) => setQuestionsData(data))
      .catch((err) => console.error("Failed to load questions:", err));
  }, []);

  const currentQuestion = questionsData[currentIndex];

  // ✅ Timer logic
  useEffect(() => {
    if (!currentQuestion) return;

    if (timer === 0) {
      handleNext(); // Auto next
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, currentQuestion]);

  // ✅ Reset on question change
  useEffect(() => {
    setTimer(30);
    setUserAnswer([]);
    setCanProceed(false);
  }, [currentIndex]);

  const handleNext = () => {
    // Save the answer for current question
    setAllAnswers((prev) => [...prev, userAnswer]);

    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate("/feedback", {
        state: {
          questions: questionsData,
          answers: [...allAnswers, userAnswer], // include last answer
        },
      });
    }
  };

  const handleQuit = () => {
    navigate("/feedback", {
      state: {
        questions: questionsData,
        answers: [...allAnswers, userAnswer],
      },
    });
  };

  const handleAnswerFilled = (answers) => {
    setUserAnswer(answers);
    setCanProceed(true);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      {questionsData.length > 0 && currentQuestion ? (
        <>
          {/* Header: Timer + Quit */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-red-600">
              Time left: {timer}s
            </h2>
            <button
              onClick={handleQuit}
              className="text-sm text-black hover:text-red-500 border border-gray-300 px-3 py-1 rounded"
            >
              Quit
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-center gap-2 mb-6">
            {questionsData.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index < currentIndex ? "bg-yellow-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Sentence Question */}
          <SentenceCard
            question={currentQuestion}
            onFilled={handleAnswerFilled}
          />

          {/* Next Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-6 py-2 rounded text-white font-medium transition-all ${
                canProceed
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Loading question...</p>
      )}
    </div>
  );
}

export default App;
