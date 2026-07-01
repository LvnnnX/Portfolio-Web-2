import data from "../../content/skills.json";
import Reveal from "./Reveal";

interface Achievement {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export default function Skills() {
  const achievements = data.achievements as Achievement[];

  // Group by year
  const byYear = achievements.reduce<Record<string, Achievement[]>>((acc, cert) => {
    (acc[cert.year] ??= []).push(cert);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  return (
    <div id="skills" className="py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <h2 className="text-[24px] md:text-[32px] font-extrabold tracking-tight text-foreground mb-8 md:mb-10">
            Achievements &amp; Certifications
          </h2>
        </Reveal>

        <div className="flex flex-col gap-8 md:gap-10">
          {years.map((year, i) => (
            <Reveal key={year} delay={i * 0.06}>
              <div className="flex gap-4 md:gap-6">
                <h3 className="text-[32px] md:text-[48px] font-extrabold text-foreground/10 tracking-tight leading-none shrink-0 w-16 md:w-20">
                  {year}
                </h3>
                <div className="flex flex-col gap-3 pt-1">
                  {byYear[year].map((cert) => (
                    <div key={cert.id}>
                      <h4 className="font-bold text-[14px] md:text-[17px] tracking-tight text-foreground leading-tight">
                        {cert.name}
                      </h4>
                      <p className="text-[11px] md:text-[13px] text-muted-foreground font-medium mt-0.5">
                        {cert.issuer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
