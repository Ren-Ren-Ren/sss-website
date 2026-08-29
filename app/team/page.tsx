import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getTeamContent } from "@/content/pages";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Studio Stone Soup is founded and led by Weiren Jheng, a New York–based creative director, working across creative direction, photography, motion, and post-production.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  const team = getTeamContent();
  // "Weiren Jheng — Founder & Creative Director" → name + title, so the
  // same content.txt line drives both the on-page text and the Person
  // structured data below.
  const [founderName, founderTitle] = team.founder.split(" — ").map((s) => s.trim());

  const personJsonLd = founderName
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: founderName,
        jobTitle: founderTitle || undefined,
        worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        affiliation: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        url: `${SITE_URL}/team`,
      }
    : null;

  return (
    <>
      <Nav />

      {personJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      )}

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

            {team.founder && (
              <div className={styles.block}>
                <div className={styles.heading}>Founder</div>
                <div className={styles.founderName}>{team.founder}</div>
              </div>
            )}

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
