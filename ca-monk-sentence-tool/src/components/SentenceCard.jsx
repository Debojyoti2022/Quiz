import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SentenceCard = ({ question, onFilled }) => {
  const [blanks, setBlanks] = useState(Array(question.correctAnswer.length).fill(""));
  const [usedWords, setUsedWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setBlanks(Array(question.correctAnswer.length).fill(""));
    setUsedWords([]);
  }, [question]);

  const handleOptionClick = (word) => {
    if (usedWords.includes(word)) return;

    const nextBlank = blanks.findIndex((b) => b === "");
    if (nextBlank !== -1) {
      const updated = [...blanks];
      updated[nextBlank] = word;
      setBlanks(updated);
      setUsedWords([...usedWords, word]);

      if (updated.every((b) => b !== "")) {
        onFilled(updated);
      }
    }
  };

  const handleBlankClick = (index) => {
    const word = blanks[index];
    if (!word) return;

    const updated = [...blanks];
    updated[index] = "";
    setBlanks(updated);
    setUsedWords(usedWords.filter((w) => w !== word));
  };

  const handleQuit = () => {
    navigate("/feedback", {
      state: {
        questions: [question], // you can pass full questionsData if available in parent
        answers: [blanks],
        quitEarly: true,
      },
    });
  };

  const sentenceParts = question.question.split("_____________");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6 border border-gray-200">

      {/* Progress & Quit Bar */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-600 font-semibold">
          Select the missing words in the correct order
        </span>
        <div className="flex gap-2 flex-1 justify-center ml-4 mr-4">
          {blanks.map((_, index) => (
            <span
              key={index}
              className={`h-1 w-6 rounded-sm transition-all duration-300 ${
                blanks[index] ? "bg-yellow-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
       
      </div>

      {/* Sentence display */}
      <p className="text-lg text-gray-700 leading-loose">
        {sentenceParts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < blanks.length && (
              <span
                onClick={() => handleBlankClick(idx)}
                className={`inline-block min-w-[100px] h-[34px] text-center border-b-2 mx-1 font-medium cursor-pointer transition 
                  ${
                    blanks[idx]
                      ? "text-blue-600 border-blue-500"
                      : "text-gray-400 border-gray-300"
                  }`}
              >
                {blanks[idx] || "______"}
              </span>
            )}
          </span>
        ))}
      </p>

      {/* Word options */}
      <div className="flex flex-wrap gap-3 mt-6">
        {question.options.map((word, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(word)}
            disabled={usedWords.includes(word)}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              usedWords.includes(word)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SentenceCard;
