import data from "../../content/skills.json";

interface SkillItem {
  name: string;
}

interface SkillCluster {
  id: string;
  label: string;
  items: SkillItem[];
}

interface Achievement {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export default function Skills() {
  const clusters = data.clusters as SkillCluster[];
  const achievements = data.achievements as Achievement[];

  return (
    <div id="skills" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] mb-12 md:mb-16 text-foreground">Skills &amp; Achievements</h2>

        <div className="mb-16 md:mb-24">
          <h3 className="text-[20px] md:text-[24px] font-semibold tracking-tight mb-6 md:mb-10 text-foreground flex items-center gap-4">
            Technical Stack <span className="h-[2px] flex-grow bg-foreground/5" />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {clusters.map((cluster) => (
              <div key={cluster.id} className="liquid-glass p-5 md:p-8 flex flex-col">
                <p className="text-[10px] md:text-[12px] font-bold tracking-[0.12em] uppercase text-[color:var(--color-accent,#B8422E)] mb-3 md:mb-4">
                  {cluster.label}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {cluster.items.map((item) => (
                    <span
                      key={item.name}
                      className="bg-muted text-foreground/80 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[11px] md:text-[13px] font-semibold border border-border/30"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[20px] md:text-[24px] font-semibold tracking-tight mb-6 md:mb-8 text-foreground">Achievements &amp; Certifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
            {achievements.map((cert) => (
              <div key={cert.id} className="liquid-glass p-4 md:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-center">
                <h4 className="font-bold text-[12px] md:text-[18px] tracking-tight mb-1 md:mb-2 text-foreground leading-tight">{cert.name}</h4>
                <p className="text-[10px] md:text-[15px] font-semibold text-muted-foreground flex items-center flex-wrap">
                  {cert.issuer} <span className="mx-1 md:mx-2 w-1 md:h-1.5 h-1 md:w-1.5 rounded-full bg-primary/40 inline-block" /> {cert.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
