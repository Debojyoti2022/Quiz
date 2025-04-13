import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions = [], answers = [] } = location.state || {};
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!questions.length) navigate("/"); // Redirect if accessed directly

    let tempScore = 0;
    questions.forEach((q, idx) => {
      const isCorrect = JSON.stringify(q.correctAnswer) === JSON.stringify(answers[idx]);
      if (isCorrect) tempScore += 1;
    });
    setScore(tempScore);
  }, [questions, answers, navigate]);
  

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          Quiz Completed!
        </h1>

        <div className="bg-blue-100 text-center rounded-xl py-6 mb-10 border border-blue-200">
          <h2 className="text-2xl font-semibold text-blue-800">Your Score</h2>
          <p className="text-5xl font-extrabold text-green-600 mt-2">
            {score} / {questions.length}
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAnswer = answers[idx] || [];
            const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(q.correctAnswer);

            return (
              <div
                key={q.questionId}
                className={`rounded-xl p-5 shadow transition ${
                  isCorrect
                    ? "bg-green-50 border border-green-300"
                    : "bg-red-50 border border-red-300"
                }`}
              >
                <p className="font-semibold text-gray-800 mb-2">
                  Q{idx + 1}. {q.question}
                </p>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">Your Answer: </span>
                    <span
                      className={isCorrect ? "text-green-700" : "text-red-700"}
                    >
                      {userAnswer.length ? userAnswer.join(", ") : "Not answered"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Correct Answer: </span>
                    <span className="text-green-800">{q.correctAnswer.join(", ")}</span>
                  </p>
                  <p
                    className={`font-semibold ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isCorrect ? "✅ Correct" : "❌ Incorrect"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition"
          >
             Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
