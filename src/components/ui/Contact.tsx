import { MessageCircle, Mail } from "lucide-react";

const Instagram = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
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
};

export default function Contact() {
  return (
    <div id="contact" className="pt-16 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-bold tracking-[-0.02em] mb-4 text-foreground">Get in Touch</h2>
          <p className="text-[18px] text-muted-foreground max-w-xl mx-auto font-medium">
            Interested in AI solutions, machine learning consulting, or research collaboration? Let's connect.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {[
            {
              name: "Instagram",
              icon: <Instagram size={32} />,
              href: "https://www.instagram.com/pande.dani13",
              color: "hover:text-[#E4405F]"
            },
            {
              name: "WhatsApp",
              icon: <MessageCircle size={32} />,
              href: "https://wa.me/6285156148613",
              color: "hover:text-[#25D366]"
            },
            {
              name: "LinkedIn",
              icon: <Linkedin size={32} />,
              href: CONTACT_DATA.linkedin,
              color: "hover:text-[#0A66C2]"
            },
            {
              name: "Email",
              icon: <Mail size={32} />,
              href: `mailto:${CONTACT_DATA.email}`,
              color: "hover:text-primary"
            },
          ].map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`liquid-glass p-8 transition-all duration-300 hover:scale-110 hover:shadow-2xl text-foreground ${social.color} group`}
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