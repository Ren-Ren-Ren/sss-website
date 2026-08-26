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

// Built once, not once a second — the tick interval below fires for as long
// as Nav is on screen (i.e. every page), so a fresh formatter per tick was a
// permanent-lifetime allocation every second.
const formatter = new Intl.DateTimeFormat("en-US", CLOCK_OPTIONS);

export default function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      setTime(formatter.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <div className="clock">New York — {time}</div>;
}
