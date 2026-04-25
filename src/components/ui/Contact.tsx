import { MessageCircle, Mail } from "lucide-react";

const Instagram = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Github = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const Linkedin = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const CONTACT_DATA = {
  email: "pandedani5@gmail.com",
  phone: "+62 851 5614 8613",
  address: "Karangasem, Bali",
  linkedin: "https://www.linkedin.com/in/kokopandan",
  github: "https://github.com/LvnnnX",
};

export default function Contact() {
  return (
    <div id="contact" className="pt-10 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.02em] mb-3 text-foreground">Get in Touch</h2>
          <p className="text-[14px] md:text-[18px] text-muted-foreground max-w-xl mx-auto font-medium">
            Interested in AI solutions or research collaboration? Let's connect.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-10">
          {[
            {
              name: "GitHub",
              icon: <Github size={24} />,
              href: CONTACT_DATA.github,
              color: "hover:text-primary"
            },
            {
              name: "LinkedIn",
              icon: <Linkedin size={24} />,
              href: CONTACT_DATA.linkedin,
              color: "hover:text-[#0A66C2]"
            },
            {
              name: "Instagram",
              icon: <Instagram size={24} />,
              href: "https://www.instagram.com/pande.dani13",
              color: "hover:text-[#E4405F]"
            },
            {
              name: "WhatsApp",
              icon: <MessageCircle size={24} />,
              href: "https://wa.me/6285156148613",
              color: "hover:text-[#25D366]"
            },
            {
              name: "Email",
              icon: <Mail size={24} />,
              href: `mailto:${CONTACT_DATA.email}`,
              color: "hover:text-primary"
            },
          ].map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`liquid-glass p-5 md:p-8 transition-all duration-300 hover:scale-110 hover:shadow-2xl text-foreground ${social.color} group`}
              aria-label={social.name}
            >
              <div className="transform transition-transform group-hover:rotate-12">
                {social.icon}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}