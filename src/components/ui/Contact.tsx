const CONTACT_DATA = {
  email: "pandedani5@gmail.com",
  phone: "+62 851 5614 8613",
  address: "Karangasem, Bali",
  linkedin: "https://www.linkedin.com/in/kokopandan",
};

export default function Contact() {
  return (
    <div id="contact" className="min-h-screen py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-bold tracking-[-0.02em] mb-4 text-foreground">Get in Touch</h2>
          <p className="text-[18px] text-muted-foreground max-w-xl mx-auto font-medium">
            Interested in AI solutions, machine learning consulting, or research collaboration? Let's connect.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
          <div className="liquid-glass p-10 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl text-center group">
            <h3 className="text-[13px] font-bold mb-3 text-primary tracking-widest uppercase">Email</h3>
            <a href={`mailto:${CONTACT_DATA.email}`} className="text-[18px] text-foreground hover:text-primary transition-colors font-bold break-all">
              {CONTACT_DATA.email}
            </a>
          </div>
          
          <div className="liquid-glass p-10 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl text-center group">
            <h3 className="text-[13px] font-bold mb-3 text-primary tracking-widest uppercase">Phone</h3>
            <a href={`tel:${CONTACT_DATA.phone}`} className="text-[18px] text-foreground hover:text-primary transition-colors font-bold break-all">
              {CONTACT_DATA.phone}
            </a>
          </div>
          
          <div className="liquid-glass p-10 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl text-center group">
            <h3 className="text-[13px] font-bold mb-3 text-primary tracking-widest uppercase">Location</h3>
            <p className="text-[18px] font-bold text-foreground break-all">{CONTACT_DATA.address}</p>
          </div>
          
          <div className="liquid-glass p-10 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl text-center group">
            <h3 className="text-[13px] font-bold mb-3 text-primary tracking-widest uppercase">LinkedIn</h3>
            <a 
              href={CONTACT_DATA.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[18px] text-foreground hover:text-primary transition-colors font-bold break-all"
            >
              linkedin.com/in/kokopandan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}