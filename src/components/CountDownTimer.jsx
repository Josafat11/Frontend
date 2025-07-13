import { useEffect, useState } from "react";

const CountdownTimer = ({ theme }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
  });

  useEffect(() => {
    // Fecha objetivo (puedes cambiarla)
    const targetDate = new Date("2025-07-14T00:00:00Z");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: "00", hours: "00", minutes: "00" });
        return;
      }

      const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0");
      const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0");
      const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0");

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`mt-8 flex gap-4 ${
        theme === "dark" ? "text-gray-300" : "text-gray-200"
      }`}
    >
      <div className="text-center">
        <div
          className={`text-2xl font-bold px-4 py-2 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-green-800"
          }`}
        >
          {timeLeft.days}
        </div>
        <span className="mt-1 text-sm">Días</span>
      </div>
      <div className="text-center">
        <div
          className={`text-2xl font-bold px-4 py-2 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-green-800"
          }`}
        >
          {timeLeft.hours}
        </div>
        <span className="mt-1 text-sm">Horas</span>
      </div>
      <div className="text-center">
        <div
          className={`text-2xl font-bold px-4 py-2 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-green-800"
          }`}
        >
          {timeLeft.minutes}
        </div>
        <span className="mt-1 text-sm">Min</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
