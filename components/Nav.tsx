import Link from "next/link";
import Clock from "./Clock";
import LogoMark from "./LogoMark";
import { getNavContent } from "@/content/pages";

export default function Nav() {
  const nav = getNavContent();
  return (
    <nav>
      <div className="nav-row nav-top">
        <Link className="mark" href="/">
          <LogoMark />
          <span>Studio Stone Soup</span>
        </Link>
        <Clock />
        <ul>
          <li>
            <Link href="/projects">Projects</Link>
          </li>
          <li>
            <Link href="/team">Team</Link>
          </li>
          <li>
            <a href="mailto:contact@stonesoup.info">Email</a>
          </li>
          <li>
            <a href="https://www.instagram.com/studiostonesoup/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
        </ul>
      </div>
      <div className="nav-tag">{nav.tagline}</div>
    </nav>
  );
}
