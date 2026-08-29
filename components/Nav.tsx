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
          <span className="wordmark">
            {/* Individual letters spread edge-to-edge (via flex
                justify-content: space-between + the parent stretching this
                line to match wordmark-line2's width) to match the source
                lockup — "STUDIO"'s S and O line up with the start of
                "STONE" and end of "SOUP" below, not just letter-spaced
                from the left. aria-hidden + the sr-only span below keep
                the link's accessible name as a normal "Studio", not six
                separately-announced letters. */}
            <span className="wordmark-line1" aria-hidden="true">
              <span>S</span>
              <span>T</span>
              <span>U</span>
              <span>D</span>
              <span>I</span>
              <span>O</span>
            </span>
            <span className="sr-only">Studio</span>
            <span className="wordmark-line2">
              <span>Stone</span>
              <span>Soup</span>
            </span>
          </span>
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
