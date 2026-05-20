import data from "../../content/skills.json";

interface Achievement {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export default function Skills() {
  const achievements = data.achievements as Achievement[];

  return (
    <div id="skills" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] mb-8 md:mb-12 text-foreground">Achievements &amp; Certifications</h2>

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
  );
}
