"use client";

import { useEffect, useState } from "react";

const CLOCK_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  weekday: "short",
  month: "short",
  day: "numeric",
};

export default function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      setTime(new Intl.DateTimeFormat("en-US", CLOCK_OPTIONS).format(new Date()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <div className="clock">New York — {time}</div>;
}
