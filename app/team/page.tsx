import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: "Team — Studio Stone Soup",
};

const services = [
  "Creative Strategy",
  "Creative Direction",
  "Art Direction",
  "Photography",
  "Motion",
  "Production",
  "Post-Production",
];

const clients = [
  "Nette",
  "Aventine Skin",
  "Faro Studio",
  "Marlow & Co.",
  "Hearth Supply",
  "North & Fable",
];

export default function TeamPage() {
  return (
    <>
      <Nav />

      <div className={styles.page}>
        <div className={styles.columns}>
          <div className={styles.intro}>
            <p>
              Studio Stone Soup began in a rented room in Bushwick — four
              walls and good light, open to whoever asked.
            </p>
            <p>
              What we learned running that space is that production,
              direction, and branding hold up better at the same table than
              handed between vendors. That&apos;s still how we work now,
              whether the job is a single campaign or a system built to
              outlast it.
            </p>
            <p>We&apos;re based in Brooklyn, working across New York and beyond.</p>
          </div>

          <div>
            <div className={styles.block}>
              <div className={styles.heading}>Services</div>
              <ul className={styles.list}>
                {services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className={styles.block}>
              <div className={styles.heading}>Clients</div>
              <ul className={styles.list}>
                {clients.map((client) => (
                  <li key={client}>{client}</li>
                ))}
              </ul>
            </div>

            <div className={styles.block}>
              <div className={styles.heading}>Inquiries</div>
              <a className={styles.emailLink} href="mailto:contact@stonesoup.info">
                contact@stonesoup.info
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
