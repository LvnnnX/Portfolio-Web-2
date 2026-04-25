import Nametag from "./Nametag";

const ABOUT_DATA = {
  name: "Pande Gede Dani Wismagatha, S.Kom",
  title: "Data Scientist & AI Specialist",
  bio: "A dedicated Data Scientist aspiring to specialize in AI, bringing three years of hands-on experience in Machine Learning and Data Analytics. Supported by 900+ hours of intensive training from elite programs like Bangkit Academy (Google, GoTo & Traveloka) and Microsoft, I have a proven ability to develop robust classification and regression models using real-world data — driven by a passion for using data to tackle complex challenges and foster innovation.",
};

export default function AboutMe() {
  return (
    <div id="about" className="pt-10 pb-4 md:py-16 px-3 md:px-6 relative z-40">
      <div className="max-w-5xl mx-auto">
        <div className="liquid-glass pt-5 pb-2 px-5 md:p-16 !overflow-visible">
          {/* Stack on mobile, side-by-side on desktop */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">

            {/* ── Left: bio text ──────────────────────────────── */}
            <div className="flex-1 min-w-0">
              <h2 className="text-[20px] md:text-[36px] font-bold leading-[1.1] tracking-[-0.02em] mb-3 md:mb-4 text-foreground text-center md:text-left">
                {ABOUT_DATA.name}
              </h2>
              <p className="text-[14px] md:text-[24px] font-bold text-primary mb-4 md:mb-6 tracking-tight text-center md:text-left">
                {ABOUT_DATA.title}
              </p>
              <p className="text-[12px] md:text-[19px] leading-[1.6] md:leading-[1.75] tracking-[-0.015em] text-foreground/85 font-medium text-center md:text-left">
                {ABOUT_DATA.bio}
              </p>

              {/* Quick-stat pills */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 mt-6 md:mt-8">
                {[
                  { label: "ML Experience", value: "3+ yrs" },
                  { label: "Training Hours", value: "900+" },
                  { label: "GPA", value: "3.98" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center px-3 py-1.5 md:px-5 md:py-3 rounded-lg md:rounded-2xl"
                    style={{
                      background: "rgba(41,151,255,0.08)",
                      border: "1px solid rgba(41,151,255,0.18)",
                    }}
                  >
                    <span className="text-[14px] md:text-[22px] font-extrabold text-primary leading-none">{value}</span>
                    <span className="text-[8px] md:text-[11px] text-muted-foreground font-semibold tracking-wide mt-0.5 md:mt-1 uppercase">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: interactive nametag ───────────────────── */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1 self-center md:self-start pt-1">
              <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] mr-[-0.2em] text-muted-foreground font-semibold mb-1 text-center">
                Drag!
              </p>
              <div className="scale-[0.8] md:scale-100 origin-top">
                <Nametag />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}