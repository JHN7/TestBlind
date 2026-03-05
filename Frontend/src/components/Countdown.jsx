// src/components/Countdown.jsx
import { useEffect, useState } from "react";

function Countdown({ onFinish }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onFinish();
    }
  }, [count, onFinish]);

  return (
    <h1 className="text-6xl font-bold mb-4">{count}</h1>
  );
}

export default Countdown;