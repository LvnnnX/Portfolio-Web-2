const SKILLS = [
  { name: "Python", level: 95 },
  { name: "Machine Learning / Deep Learning", level: 90 },
  { name: "C++", level: 85 },
  { name: "JavaScript / TypeScript", level: 80 },
  { name: "Computer Vision (YOLOv8, OpenCV)", level: 80 },
  { name: "Speech Recognition & Audio Processing", level: 80 },
  { name: "LLM Protocols (MCP, RAG)", level: 75 },
  { name: "Data Engineering (SQL, ETL, Azure)", level: 75 },
  { name: "Web Frameworks (Flask, Next.js, Vite)", level: 70 },
];

const ACHIEVEMENTS = [
  {
    id: 1,
    name: "Bangkit Academy – Machine Learning Cohort",
    issuer: "Google, GoTo & Traveloka",
    year: "2023–2024",
  },
  {
    id: 2,
    name: "Microsoft Data Engineer Program (6 Certificates)",
    issuer: "Microsoft × MariBelajar",
    year: "2024",
  },
  {
    id: 3,
    name: "PKM Funded – Voice-Controlled Wheelchair",
    issuer: "Kemdikbudristek",
    year: "2023",
  },
  {
    id: 4,
    name: "Silver Medal – Educamp 2.0 National (Informatics)",
    issuer: "Educamp National",
    year: "2020",
  },
  {
    id: 5,
    name: "Bronze Medal – OLIMPIA National (Informatics)",
    issuer: "OLIMPIA",
    year: "2020",
  },
  {
    id: 6,
    name: "1st Place – District Science Competition (Informatics)",
    issuer: "National HS Competition",
    year: "2020",
  },
];

export default function Skills() {
  return (
    <div id="skills" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[40px] font-semibold tracking-[-0.02em] mb-16 text-foreground">Skills & Achievements</h2>
        
        <div className="mb-24">
          <h3 className="text-[24px] font-semibold tracking-tight mb-8 text-foreground">Technical Skills</h3>
          <div className="space-y-8 max-w-2xl p-10 liquid-glass">
            {SKILLS.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-[16px] tracking-tight">{skill.name}</span>
                  <span className="text-primary text-[15px] font-bold">{skill.level}%</span>
                </div>
                <div className="w-full bg-border/20 rounded-full h-[8px] relative overflow-hidden backdrop-blur-sm">
                  <div
                    className="bg-primary h-full rounded-full absolute top-0 left-0 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,113,227,0.5)]"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[24px] font-semibold tracking-tight mb-8 text-foreground">Achievements & Certifications</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {ACHIEVEMENTS.map((cert) => (
              <div key={cert.id} className="liquid-glass p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <h4 className="font-bold text-[18px] tracking-tight mb-2 text-foreground">{cert.name}</h4>
                <p className="text-[15px] font-semibold text-muted-foreground flex items-center">
                  {cert.issuer} <span className="mx-2 w-1.5 h-1.5 rounded-full bg-primary/40 inline-block" /> {cert.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}