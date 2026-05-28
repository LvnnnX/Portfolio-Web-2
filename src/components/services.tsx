type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
};

type TierBand = {
  price: string;
  scope: string;
};

type Tier = {
  n: string | number;
  name: string;
  range: string;
  timeline: string;
  featured?: boolean;
  deck: string;
  bands?: TierBand[];
  features: string[];
  bonus?: string[];
  cocok: string;
};

type AddOnItem = {
  label: string;
  price: string;
};

type PaymentCardProps = {
  tier: string;
  scheme: string;
  note: string;
};

type ProcessStepProps = {
  number: string | number;
  title: string;
  description: string;
};

type ContactCTAProps = {
  whatsapp: string;
  email: string;
  linkedin: string;
  github: string;
  location: string;
};
// ============================================================================
// services.components.jsx
// ----------------------------------------------------------------------------
// Drop-in components untuk services.mdx
// Stack: React 19 + Tailwind v4 + Framer Motion (optional)
// Path: src/components/services.tsx
// ============================================================================

import { motion } from "framer-motion";

// ----- Atoms -----------------------------------------------------------------

export function GlassCard({ children, className = "", featured = false }: GlassCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border backdrop-blur-2xl ${
        featured
          ? "border-[var(--svc-rule-strong)] bg-gradient-to-br from-[var(--svc-glass-from)] via-[var(--svc-glass-via)] to-[var(--svc-glass-to)] shadow-[var(--svc-glass-shadow-featured)]"
          : "border-[var(--svc-rule)] bg-[var(--svc-surface)] shadow-[var(--svc-glass-shadow)]"
      } ${className}`}
    >
      <div className="pointer-events-none absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--svc-glass-hairline)] to-transparent" />
      {children}
    </div>
  );
}

// ----- Tier Table (overview) ------------------------------------------------

export function TierTable({ tiers }: { tiers: Tier[] }) {
  return (
    <GlassCard className="mt-12 p-1">
      <div className="rounded-3xl overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 text-[11px] tracking-[0.18em] uppercase text-[var(--svc-ink-40)] font-medium border-b border-[var(--svc-rule)]">
          <div className="col-span-1">Tier</div>
          <div className="col-span-5">Layanan</div>
          <div className="col-span-4 text-right">Range Harga</div>
          <div className="col-span-2 text-right">Timeline</div>
        </div>
        {tiers.map((tier, i) => (
          <motion.a
            key={tier.n}
            href={`#tier-${tier.n}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="group grid grid-cols-12 px-6 py-5 items-center border-b border-[var(--svc-rule-soft)] last:border-b-0 hover:bg-[var(--svc-surface-2)] transition-colors"
          >
            <div className="col-span-1 font-display italic text-2xl text-[var(--svc-accent)] font-light">
              {tier.n}
            </div>
            <div className="col-span-5 font-display text-lg text-[var(--svc-ink)] font-light tracking-tight">
              {tier.name}
            </div>
            <div className="col-span-4 text-right font-display text-base text-[var(--svc-ink-90)]">
              {tier.range}
            </div>
            <div className="col-span-2 text-right text-xs text-[var(--svc-ink-40)] font-mono tracking-wider">
              {tier.timeline}
            </div>
          </motion.a>
        ))}
      </div>
    </GlassCard>
  );
}

// ----- Tier Card (detail) ---------------------------------------------------

export function TierCard({ tier }: { tier: Tier }) {
  return (
    <motion.div
      id={`tier-${tier.n}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-24 my-6"
    >
      <GlassCard featured={tier.featured} className="p-8 md:p-10 relative">
        {tier.featured && (
          <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium bg-[var(--svc-accent-bg)] text-[var(--svc-accent)] border border-[var(--svc-accent-border)]">
            Paling Dipilih
          </div>
        )}

        <div className="grid grid-cols-12 gap-6 items-baseline mb-6 mt-6 md:mt-0">
          <div className="col-span-12 md:col-span-1">
            <div className="font-display italic text-4xl text-[var(--svc-accent)] font-light leading-none">
              {tier.n}
            </div>
          </div>
          <div className="col-span-12 md:col-span-7">
            <h3 className="font-display text-3xl md:text-4xl font-light tracking-tight text-[var(--svc-ink)] leading-tight">
              {tier.name}
            </h3>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--svc-ink-40)] font-mono mb-1">
              Mulai dari
            </div>
            <div className="font-display text-2xl text-[var(--svc-ink)] font-light">{tier.range}</div>
            <div className="text-xs text-[var(--svc-ink-40)] mt-1 font-mono tracking-wider">
              {tier.timeline}
            </div>
          </div>
        </div>

        <p className="text-[var(--svc-ink-70)] font-light leading-relaxed max-w-3xl mb-6 italic">
          {tier.deck}
        </p>

        {tier.bands && (
          <div className="mb-6 rounded-2xl border-l-2 border-[var(--svc-accent)] bg-[var(--svc-surface-2)] p-5">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--svc-accent)] font-mono mb-3">
              Catatan Transparan tentang Range
            </div>
            <ul className="space-y-2.5">
              {tier.bands.map((band) => (
                <li key={band.price} className="grid grid-cols-12 gap-3 text-sm">
                  <span className="col-span-12 md:col-span-3 text-[var(--svc-ink)] font-medium font-mono text-xs tracking-wider pt-0.5">
                    {band.price}
                  </span>
                  <span className="col-span-12 md:col-span-9 text-[var(--svc-ink-60)] font-light leading-relaxed">
                    {band.scope}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs italic text-[var(--svc-ink-40)]">
              Jujur dari awal supaya kamu dapat nilai sesuai budget — bukan ekspektasi salah.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--svc-ink-40)] font-mono mb-3">
              Yang Termasuk
            </div>
            <ul className="space-y-2">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-[var(--svc-ink-70)] font-light leading-relaxed">
                  <span className="text-[var(--svc-accent)] font-medium mt-0.5 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          {tier.bonus && (
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--svc-accent)] font-mono mb-3">
                Bonus Range Atas
              </div>
              <ul className="space-y-2">
                {tier.bonus.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-[var(--svc-ink-70)] font-light leading-relaxed">
                    <span className="text-[var(--svc-accent)] font-medium mt-0.5 shrink-0">★</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--svc-rule)] pt-4 mt-4">
          <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--svc-ink-40)] font-mono mb-1.5">
            Cocok Untuk
          </div>
          <p className="text-sm text-[var(--svc-ink-60)] font-light italic leading-relaxed">{tier.cocok}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ----- Add-on Table ---------------------------------------------------------

export function AddOnTable({ items }: { items: AddOnItem[] }) {
  return (
    <GlassCard className="mt-10 p-2">
      <div className="rounded-3xl overflow-hidden">
        {items.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="flex justify-between items-center px-6 py-4 border-b border-[var(--svc-rule-soft)] last:border-b-0 hover:bg-[var(--svc-surface-2)] transition-colors"
          >
            <span className="text-[var(--svc-ink-80)] font-light">{a.label}</span>
            <span className="text-[var(--svc-ink)] font-mono text-sm tracking-wider whitespace-nowrap">
              {a.price}
            </span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

// ----- Payment Card ---------------------------------------------------------

export function PaymentCard({ tier, scheme, note }: PaymentCardProps) {
  return (
    <GlassCard className="p-6 h-full">
      <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--svc-accent)] font-mono mb-3">
        {tier}
      </div>
      <div className="font-display text-3xl text-[var(--svc-ink)] font-light mb-3 tracking-tight">
        {scheme}
      </div>
      <p className="text-sm text-[var(--svc-ink-60)] font-light leading-relaxed">{note}</p>
    </GlassCard>
  );
}

// ----- Process Step ---------------------------------------------------------

export function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <GlassCard className="p-6 h-full">
      <div className="font-display italic text-3xl text-[var(--svc-accent)] font-light mb-3 leading-none">
        {number}
      </div>
      <div className="font-display text-lg text-[var(--svc-ink)] font-light tracking-tight mb-1.5">
        {title}
      </div>
      <p className="text-sm text-[var(--svc-ink-60)] font-light leading-relaxed">{description}</p>
    </GlassCard>
  );
}

// ----- Contact CTA ----------------------------------------------------------

export function ContactCTA({ whatsapp, email, linkedin, github, location }: ContactCTAProps) {
  const waLink = `https://wa.me/${whatsapp}?text=Halo%20Dani%2C%20saya%20mau%20konsultasi%20website`;
  return (
    <div className="mt-10">
      <GlassCard featured className="p-10 md:p-16 text-center">
        <h2 className="font-display text-4xl md:text-6xl font-light tracking-tight text-[var(--svc-ink)] leading-tight">
          Punya ide, dan <em className="italic text-[var(--svc-accent)]">budget yang masuk akal</em>?
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-lg text-[var(--svc-ink-60)] font-light leading-relaxed">
          Konsultasi awal selalu gratis. Kasih tau scope kasar via WhatsApp atau email — aku balas
          dalam 24 jam.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={waLink}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--svc-ink)] text-[var(--svc-paper)] text-sm font-medium tracking-tight hover:opacity-90 transition-all"
          >
            WhatsApp +{whatsapp.slice(0, 2)} {whatsapp.slice(2, 5)}-{whatsapp.slice(5, 9)}-{whatsapp.slice(9)}
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[var(--svc-rule-strong)] bg-[var(--svc-surface)] backdrop-blur-xl text-[var(--svc-ink)] text-sm font-medium tracking-tight hover:bg-[var(--svc-surface-2)] hover:border-[var(--svc-ink-40)] transition-all"
          >
            {email}
          </a>
        </div>

        <div className="mt-10 pt-8 border-t border-[var(--svc-rule)] grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--svc-accent)] font-mono mb-1">
              LinkedIn
            </div>
            <div className="text-sm text-[var(--svc-ink-80)] font-light">linkedin.com/in/{linkedin}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--svc-accent)] font-mono mb-1">
              GitHub
            </div>
            <div className="text-sm text-[var(--svc-ink-80)] font-light">github.com/{github}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--svc-accent)] font-mono mb-1">
              Lokasi
            </div>
            <div className="text-sm text-[var(--svc-ink-80)] font-light">{location}</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
