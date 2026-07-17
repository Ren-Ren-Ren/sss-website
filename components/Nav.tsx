import Link from "next/link";
import Clock from "./Clock";

export default function Nav() {
  return (
    <nav>
      <div className="nav-tag">A Creative House</div>
      <div className="nav-row nav-3col">
        <Link className="mark" href="/">
          Studio Stone Soup
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
            <Link href="/#contact">Contact</Link>
          </li>
          <li>
            <a href="https://www.instagram.com/studiostonesoup/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
