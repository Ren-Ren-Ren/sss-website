import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getTeamContent } from "@/content/pages";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: "Team — Studio Stone Soup",
};

export default function TeamPage() {
  const team = getTeamContent();

  return (
    <>
      <Nav />

      <div className={styles.page}>
        <div className={styles.columns}>
          <div className={styles.intro}>
            {team.intro.map((paragraph, i) => {
              const isLead = i === 0;
              const isManifesto = i === team.intro.length - 1;
              return (
                <p
                  key={paragraph}
                  className={isLead ? styles.introLead : isManifesto ? styles.introManifesto : undefined}
                >
                  {paragraph}
                </p>
              );
            })}

            <div className={styles.block}>
              <div className={styles.heading}>Inquiries</div>
              <a className={styles.emailLink} href={`mailto:${team.email}`}>
                {team.email}
              </a>
            </div>
          </div>

          <div className={styles.servicesColumn}>
            <div className={styles.block}>
              <div className={styles.heading}>Services</div>
              <ul className={styles.list}>
                {team.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.clientsColumn}>
            <div className={styles.block}>
              <div className={styles.heading}>Clients</div>
              <ul className={`${styles.list} ${styles.clientsList}`}>
                {team.clients.map((client) => (
                  <li key={client}>{client}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
