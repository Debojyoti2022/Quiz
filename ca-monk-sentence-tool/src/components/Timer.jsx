import { useEffect, useState } from "react";

const Timer = ({ onTimeout, keyTrigger }) => {
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    setSecondsLeft(30); // Reset timer on new question
  }, [keyTrigger]);

  useEffect(() => {
    if (secondsLeft === 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeout]);

  return (
    <div className="mb-4 text-right text-lg font-semibold">
      ⏱️ Time left: {secondsLeft}s
    </div>
  );
};

export default Timer;
