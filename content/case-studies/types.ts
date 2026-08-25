export type Credit = { role: string; name: string };

export type CaseStudyContent = {
  title: string;
  subtitle: string;
  description: string;
  services: string[];
  credits: Credit[];
  year: string;
};
