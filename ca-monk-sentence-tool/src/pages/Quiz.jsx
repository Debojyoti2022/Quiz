import { useEffect, useState } from "react";
import SentenceCard from "../components/SentenceCard";
import Timer from "../components/Timer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [canProceed, setCanProceed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleTimeout = () => {
    handleNext(); // auto go to next
  };
  
  <motion.div
  key={currentIndex}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  <SentenceCard
    question={currentQuestion}
    onFilled={handleAnswerFilled}
  />
</motion.div>

  const handleAnswerFilled = (userAnswer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = userAnswer;
    setAnswers(updatedAnswers);
    setCanProceed(true);
  };

  const handleNext = () => {
    setCanProceed(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/feedback", { state: { questions, answers } });
    }
  };

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Pass currentIndex as keyTrigger to reset timer */}
      <Timer onTimeout={handleTimeout} keyTrigger={currentIndex} />
      
      <SentenceCard
        question={questions[currentIndex]}
        onFilled={handleAnswerFilled}
      />
      
      <button
        disabled={!canProceed}
        onClick={handleNext}
        className={`mt-4 px-6 py-2 rounded ${
          canProceed
            ? "bg-green-600 text-white"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Quiz;
