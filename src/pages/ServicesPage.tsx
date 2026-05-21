import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/seo/SEO";
import {
  TierTable,
  TierCard,
  AddOnTable,
  PaymentCard,
  ProcessStep,
  ContactCTA,
} from "../components/services";
import "../blog/styles/services.css";

const tiers = [
  {
    n: "01",
    name: "Micro-site / Landing",
    range: "Rp 100rb – 1 jt",
    timeline: "1–5 hari",
    deck:
      "Halaman tunggal yang fokus pada satu pesan — undangan digital, landing campaign, atau profil singkat yang harus jadi cepat.",
    bands: [
      { price: "Rp 100 – 300 rb", scope: "Template-based, kustomisasi minimal (warna, teks, foto). Cocok untuk undangan digital, link-in-bio, landing event 1 hari." },
      { price: "Rp 400 – 700 rb", scope: "Template + light customization (layout adjust, animation, branding match)." },
      { price: "Rp 800 rb – 1 jt", scope: "Full custom design dari nol, struktur fleksibel, brand-aligned." },
    ],
    features: [
      "Responsive mobile + desktop",
      "Form kontak / WhatsApp redirect",
      "Setup domain + hosting Cloudflare Pages",
      "2× revisi minor",
      "Source code diserahkan",
    ],
    bonus: ["Custom design dari nol (di range Rp 800rb+)", "CSS animation halus", "Konsultasi visual identity awal"],
    cocok: "Undangan digital, landing campaign event, micro-portfolio, profil singkat freelancer, link-in-bio premium.",
  },
  {
    n: "02",
    name: "Company Profile / Portfolio",
    range: "Rp 1 – 4 jt",
    timeline: "1–2 minggu",
    featured: true,
    deck:
      "Website 3–5 halaman dengan design system yang konsisten. Cocok untuk yang sudah punya brand dan butuh kehadiran serius di web.",
    bands: [
      { price: "Rp 1 – 2 jt", scope: "Template kustomisasi medium (3 halaman), branding adjust, content masuk dari Notion/Markdown." },
      { price: "Rp 2 – 3 jt", scope: "Custom design 4–5 halaman dengan design system, animation menengah, SEO basics." },
      { price: "Rp 3 – 4 jt", scope: "Full custom dari nol, design system lengkap, micro-interactions, performance audit." },
    ],
    features: [
      "3–5 halaman (Home, About, Services, Projects, Contact)",
      "Design system custom (tokens, tipografi, palette)",
      "Content management via Markdown / Notion",
      "Form kontak + integrasi email (Resend / EmailJS)",
      "SEO basics (meta tags, sitemap, OG image)",
      "Analytics (Plausible / Cloudflare)",
      "Domain + hosting setup",
      "3× revisi",
    ],
    cocok: "Studio arsitek/desain, konsultan, agency kecil, freelancer profesional, brand UMKM yang serius.",
  },
  {
    n: "03",
    name: "Business Website + CMS",
    range: "Rp 4 – 8 jt",
    timeline: "2–3 minggu",
    deck:
      "Website yang bisa di-update sendiri oleh tim non-teknis, dengan blog, multi-bahasa, dan SEO yang serius.",
    features: [
      "6–12 halaman + dynamic routing",
      "Headless CMS (Sanity / Notion / Strapi) — admin bisa edit sendiri",
      "Blog / News section",
      "Search internal",
      "Multi-bahasa (Indonesia + English) opsional",
      "Newsletter signup (Resend / ConvertKit)",
      "SEO advanced + schema.org",
      "Performance audit (Lighthouse 95+)",
      "Training admin 1× sesi",
      "4× revisi",
    ],
    cocok: "Bisnis menengah, restoran/villa butuh booking inquiry, brand dengan content rutin, lembaga pendidikan, NGO.",
  },
  {
    n: "04",
    name: "Custom Web App / E-commerce",
    range: "Rp 8 – 20 jt",
    timeline: "4–6 minggu",
    deck:
      "Aplikasi web custom dengan database, autentikasi, payment gateway, dan dashboard admin. Spec lengkap diserahkan sebelum coding.",
    features: [
      "Custom multi-page application",
      "Auth (email/password + Google OAuth)",
      "Database (Supabase / Postgres) + Row Level Security",
      "Payment integration (Midtrans / Xendit)",
      "Admin dashboard + role-based access",
      "Email transactional (order confirmation, receipt)",
      "Storage (Cloudflare R2 / S3) untuk file/foto",
      "Spec triad delivered (SRS + CLAUDE.md + DESIGN.md)",
      "QA + UAT testing",
      "Garansi bug-fix 30 hari",
      "Training + dokumentasi",
      "5× revisi",
    ],
    cocok: "Marketplace digital file, e-commerce kecil-menengah, SaaS MVP, sistem manajemen custom (booking, inventory, CRM kecil).",
  },
  {
    n: "05",
    name: "Enterprise / Custom Scope",
    range: "Rp 20 jt+",
    timeline: "6 minggu+",
    deck:
      "Untuk proyek dengan skala kompleks — multi-modul, integrasi berat, atau kebutuhan AI/ML. Konsultasi dulu, atau pakai retainer per bulan.",
    features: [
      "Aplikasi multi-modul (HR + finance + operations)",
      "Integrasi ERP / accounting existing",
      "AI/ML feature (chatbot, recommendation, image processing)",
      "Real-time (WebSocket, live update)",
      "Mobile-first dengan progressive web app",
      "Konsultasi arsitektur + roadmap",
      "Retainer monthly (mulai Rp 5 jt / bulan)",
    ],
    cocok: "Korporasi, startup growth-stage, project AI/ML internal, sistem yang butuh ongoing development.",
  },
];

const addOns = [
  { label: "Domain registration (.com / .id, 1 tahun)", price: "Rp 200 – 400 rb" },
  { label: "Hosting maintenance bulanan", price: "Rp 100 rb / bulan" },
  { label: "Logo + brand identity (3 variant)", price: "Rp 800 rb – 1,5 jt" },
  { label: "Content writing (per halaman, ID/EN)", price: "Rp 150 – 400 rb" },
  { label: "Photography arrangement", price: "Rp 800 rb – 2 jt" },
  { label: "SEO audit + optimization", price: "Rp 800 rb – 1,5 jt" },
  { label: "Maintenance retainer (5 jam / bulan)", price: "Rp 800 rb / bulan" },
  { label: "Migrasi WordPress → modern stack", price: "Rp 1,5 – 4 jt" },
  { label: "Translation Indonesia ↔ English", price: "Rp 100 rb / 500 kata" },
];

const payments = [
  { tier: "Tier 01", scheme: "50 / 50", note: "DP 50% saat kickoff, sisa 50% sebelum publish." },
  { tier: "Tier 02", scheme: "40 / 30 / 30", note: "DP 40%, mid-design 30%, sebelum publish 30%." },
  { tier: "Tier 03", scheme: "30 / 40 / 30", note: "DP 30%, after dev 40%, handover 30%." },
  { tier: "Tier 04", scheme: "25 × 4", note: "DP 25%, dua phase 25%, handover 25%." },
];

const processSteps = [
  { t: "Kontak Awal", d: "Via WhatsApp atau email — kasih tau scope kasar." },
  { t: "Discovery Call", d: "30–45 menit, gratis. Bahas kebutuhan, anggaran, timeline." },
  { t: "Quote + Kontrak", d: "Dikirim maksimal 2 hari kerja setelah discovery." },
  { t: "DP + Kickoff", d: "Proyek officially dimulai setelah DP masuk." },
  { t: "Design Phase", d: "Mockup interactive, revisi sampai approved." },
  { t: "Development Phase", d: "Weekly progress update via WhatsApp / email." },
  { t: "UAT + Revisi Final", d: "Kamu test dulu di staging URL." },
  { t: "Pelunasan + Handover", d: "Source code, akses hosting, dokumentasi." },
  { t: "Garansi 30 Hari", d: "Bug-fix gratis untuk masalah setelah handover." },
];

const notIncluded = [
  "Penulisan konten teks panjang (kecuali ditambahkan via add-on)",
  "Foto / video produksi (kecuali arrangement add-on)",
  "Pembelian stock photo licensed",
  "Iklan berbayar — Google Ads / Meta Ads setup",
  "Lisensi font berbayar di luar Google Fonts",
  "Maintenance setelah masa garansi (kecuali pakai retainer)",
];

export default function ServicesPage() {
  return (
    <div className="svc bg-[var(--svc-paper)] text-[var(--svc-ink)] min-h-screen transition-colors">
      <SEO
        title="Services — Daniwismagatha"
        description="Lima tier layanan pembuatan website — dari landing page sampai aplikasi web custom. Range harga jujur, scope transparan, tanpa biaya tersembunyi."
        path="/services"
      />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--svc-ink-60)] hover:text-[var(--svc-accent)] transition-colors"
        >
          <ArrowLeft size={12} /> Back to portfolio
        </Link>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 pb-12"
      >
        <p className="text-[11px] tracking-[0.20em] uppercase text-[var(--svc-accent)] mb-4">
          Daftar Layanan · Edisi MMXXVI
        </p>
        <h1 className="font-display italic text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-tight max-w-3xl">
          Web yang dibangun <em className="text-[var(--svc-accent)] not-italic font-light">jujur</em>, dengan harga yang masuk akal.
        </h1>
        <p className="mt-6 text-[var(--svc-ink-70)] text-base sm:text-lg max-w-2xl leading-relaxed">
          Lima tier layanan — dari landing page sederhana sampai aplikasi web custom. Range harga jujur, scope transparan, tanpa biaya tersembunyi.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#tiers"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--svc-accent)] px-5 py-3 text-sm font-medium text-[var(--svc-cta-fg)] hover:bg-[var(--svc-accent-soft)] transition-colors"
          >
            Lihat Semua Tier →
          </a>
          <a
            href="https://wa.me/6285156148613?text=Halo%20Dani%2C%20saya%20mau%20konsultasi%20website"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--svc-rule-strong)] px-5 py-3 text-sm font-medium text-[var(--svc-ink)] hover:border-[var(--svc-ink-40)] transition-colors"
          >
            Konsultasi Gratis
          </a>
        </div>
      </motion.section>

      <section id="tiers" className="max-w-5xl mx-auto px-6 py-12 scroll-mt-16">
        <h2 className="font-display italic text-3xl font-light tracking-tight max-w-2xl">
          Lima tingkat keterlibatan, <em className="text-[var(--svc-accent)] not-italic">tanpa gap</em>.
        </h2>
        <p className="mt-4 text-[var(--svc-ink-60)] max-w-2xl">
          Tiap tier disusun saling menyambung — batas atas tier sebelumnya jadi batas bawah berikutnya. Tidak ada celah harga yang membingungkan.
        </p>
        <TierTable tiers={tiers} />
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        {tiers.map((tier) => (
          <TierCard key={tier.n} tier={tier} />
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-display italic text-3xl font-light tracking-tight">Add-ons</h2>
        <p className="mt-4 text-[var(--svc-ink-60)] max-w-2xl">Tambahan opsional di luar tier utama.</p>
        <AddOnTable items={addOns} />
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-display italic text-3xl font-light tracking-tight">Termin Pembayaran</h2>
        <p className="mt-4 text-[var(--svc-ink-60)]">
          Bayar bertahap, <em className="text-[var(--svc-accent)] not-italic">tidak harus lunas dulu</em>.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {payments.map((p) => (
            <PaymentCard key={p.tier} {...p} />
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--svc-ink-50)] italic border-l-2 border-[var(--svc-accent-border)] pl-4">
          Pembayaran via transfer BCA / BNI / Mandiri. Invoice resmi disediakan setiap termin.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-display italic text-3xl font-light tracking-tight">Cara Kerja</h2>
        <p className="mt-4 text-[var(--svc-ink-60)]">
          Sembilan langkah, <em className="text-[var(--svc-accent)] not-italic">satu janji</em>.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {processSteps.map((step, i) => (
            <ProcessStep
              key={step.t}
              number={String(i + 1).padStart(2, "0")}
              title={step.t}
              description={step.d}
            />
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-display italic text-3xl font-light tracking-tight">Yang Tidak Termasuk</h2>
        <p className="mt-4 text-[var(--svc-ink-60)]">
          Transparan dari <em className="text-[var(--svc-accent)] not-italic">awal</em>.
        </p>
        <ul className="mt-8 space-y-3">
          {notIncluded.map((item) => (
            <li
              key={item}
              className="text-[var(--svc-ink-70)] text-base leading-relaxed border-l border-[var(--svc-rule)] pl-4"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-display italic text-3xl font-light tracking-tight">Mulai Proyek</h2>
        <ContactCTA
          whatsapp="6285156148613"
          email="pandedani5@gmail.com"
          linkedin="kokopandan"
          github="LvnnnX"
          location="Karang Asem, Bali"
        />
      </section>

      <footer className="max-w-5xl mx-auto px-6 pt-12 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs tracking-[0.10em] uppercase text-[var(--svc-ink-40)] border-t border-[var(--svc-rule)] pt-6">
          <span>Daniwismagatha.my.id · Pricelist 2026</span>
          <span>Berlaku Mei 2026 — Karang Asem, Bali</span>
        </div>
      </footer>
    </div>
  );
}
