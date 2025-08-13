import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";


/**
 * Falcon View Group — Single Page (Strategy + Software)
 * - Sticky header; anchors land below it (CSS offset)
 * - Larger logo + brand
 * - Headline: "Find—and build—advantage with AI"
 * - Software tile has "Show examples" disclosure (+ InsiderPerformance link)
 * - Founder section: exact user text + larger photo
 * - Contact: EmailJS form -> info@falconviewgroup.io
 */

const NAVY = "#0b1d40";
const LOGO_URL_DEFAULT =
  "https://i.postimg.cc/Hx341F19/Chat-GPT-Image-Apr-14-2025-11-55-00-AM.png";
const LOGO_HEIGHT = 56;            // header logo size
const BRAND_FONT_SIZE = 18;        // header "Falcon View Group" text size
const FOUNDER_PHOTO_URL =
  "https://i.postimg.cc/y6nGmj8t/139-k-Twdqu3up-CM.jpg";
const FOUNDER_PHOTO_SIZE = 120;    // founder portrait size

// EmailJS config (provided)
const EMAILJS_SERVICE_ID = "service_7ss2s0l";
const EMAILJS_TEMPLATE_ID = "template_vy2y36q";
const EMAILJS_PUBLIC_KEY = "yrE4rcKrf6Wy1PbZ8";
const DESTINATION_EMAIL = "info@falconviewgroup.io";

// Inline fallback monogram (never breaks builds)
const FALLBACK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 64 64'>
     <rect width='64' height='64' rx='10' fill='${NAVY}'/>
     <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
           font-family='Inter, system-ui, Arial, sans-serif' font-size='26'
           fill='white' font-weight='700'>FV</text>
   </svg>`
)}`;

export default function App() {
  const [logoOk, setLogoOk] = useState(true);
  const [photoOk, setPhotoOk] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoSrc =
    (typeof window !== "undefined" && window.__FALCON_LOGO_URL__) ||
    LOGO_URL_DEFAULT ||
    FALLBACK_SVG;

  // Layout helpers
  const container = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "0 24px",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    color: "#1f2430",
  };
  const divider = { borderTop: "1px solid #EFF1F4", margin: "44px 0" };
  const h2 = { color: NAVY, fontSize: 24, margin: "0 0 10px", fontWeight: 700 };
  const tileWrap = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  };
  const tile = {
    border: "1px solid #E7EAF0",
    borderRadius: 12,
    padding: "14px 14px",
    background: "#fff",
  };
  const tileTitle = { color: NAVY, fontWeight: 600, margin: "0 0 6px" };
  const linkStyle = {
    color: "#5c6474",
    textDecoration: "none",
    padding: "6px 8px",
    borderRadius: 8,
  };

  // Fonts + EmailJS init
  useEffect(() => {
    if (!document.getElementById("inter-font")) {
      const link = document.createElement("link");
      link.id = "inter-font";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap";
      document.head.appendChild(link);
    }
    emailjs.init(EMAILJS_PUBLIC_KEY);
    document.title = "Falcon View Group — Strategy & Software";
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setSent(false);
    setErr("");

    const form = e.currentTarget;
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      company: form.company.value.trim(),
      interest: form.interest.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          company: formData.company,
          interest: formData.interest,
          message: formData.message,
          to_email: DESTINATION_EMAIL,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSending(false);
      setSent(true);
      form.reset();
    } catch (error) {
      setSending(false);
      setErr("Something went wrong. Please try again or email info@falconviewgroup.io.");
      console.error("[EmailJS] send failed:", error);
    }
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Quick CSS: sticky-header offset + mobile polish */}
      <style>{`
        /* Smooth scrolling + anchor offset for sticky header */
        html { scroll-behavior: smooth; }

        /* Header height estimate (adjust if you tweak logo/brand size) */
        :root { --header-h: 88px; }             /* desktop/tablet */
        @media (max-width: 640px) {
          :root { --header-h: 72px; }          /* mobile with cleaner header */
        }

        /* Make anchor targets stop below the sticky header */
        section[id] { scroll-margin-top: calc(var(--header-h) + 8px); }

        /* Mobile Navigation */
        @media (max-width: 640px) {
          /* Hide desktop nav, show mobile toggle */
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle { display: block !important; }
          
          /* Hero and content adjustments */
          #hero-title { font-size: 32px !important; line-height: 1.2; }
          #hero-sub   { font-size: 16px !important; }
          main        { padding-top: 44px !important; padding-bottom: 44px !important; }
        }
        
        /* Desktop Navigation */
        @media (min-width: 641px) {
          .mobile-menu-toggle { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>

      {/* Header (sticky) */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #EFF1F4",
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "saturate(120%) blur(6px)",
          WebkitBackdropFilter: "saturate(120%) blur(6px)",
        }}
      >
        <div
          style={{
            ...container,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
          }}
        >
          <a
            href="#top"
            style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
            aria-label="Go to top"
          >
            <img
              src={logoOk ? logoSrc : FALLBACK_SVG}
              onError={() => setLogoOk(false)}
              alt="Falcon View Group logo"
              style={{ height: LOGO_HEIGHT, width: "auto", display: "block" }}
            />
            <span
              style={{
                color: NAVY,
                fontWeight: 700,
                letterSpacing: ".2px",
                fontSize: BRAND_FONT_SIZE,
              }}
            >
              Falcon View Group
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav data-role="nav" className="desktop-nav" style={{ display: "flex", gap: 18 }}>
            <a href="#help" style={linkStyle}>How we help</a>
            <a href="#about" style={linkStyle}>About</a>
            <a href="#contact" style={linkStyle}>Contact</a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{
              display: "none",
              background: "none",
              border: "none",
              padding: 8,
              cursor: "pointer",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav
            className="mobile-nav"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "rgba(255,255,255,0.98)",
              borderBottom: "1px solid #EFF1F4",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <a href="#help" onClick={() => setMobileMenuOpen(false)} style={{...linkStyle, display: "block", padding: "8px 0"}}>How we help</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{...linkStyle, display: "block", padding: "8px 0"}}>About</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{...linkStyle, display: "block", padding: "8px 0"}}>Contact</a>
          </nav>
        )}
      </header>

      <main id="top" style={{ ...container, paddingTop: 56, paddingBottom: 60 }}>
        {/* Hero */}
        <section aria-labelledby="hero-title" style={{ marginBottom: 8 }}>
          <h1
            id="hero-title"
            style={{
              color: NAVY,
              fontSize: 42,
              lineHeight: 1.15,
              margin: "0 0 12px",
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            Find—and build—advantage with AI
          </h1>
          <p id="hero-sub" style={{ fontSize: 18, maxWidth: 860, margin: 0 }}>
            We leverage AI to transform how businesses operate—from strategic planning to custom
            software development. Our unique approach combines deep industry knowledge with
            cutting-edge AI capabilities to create competitive advantages that weren't possible just
            a few years ago.
          </p>
          <div style={{ marginTop: 18 }}>
            <a
              href="#contact"
              style={{
                display: "inline-block",
                border: `1px solid ${NAVY}`,
                color: NAVY,
                padding: "10px 14px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Start a conversation
            </a>
          </div>
        </section>

        <div style={divider} />

        {/* How we help — Strategy + Software with examples */}
        <section id="help" aria-labelledby="help-title">
          <h2 id="help-title" style={h2}>How we help</h2>
          <div style={tileWrap}>
            <div style={tile}>
              <div data-tile-title style={tileTitle}>Strategy</div>
              <div style={{ fontSize: 14, color: "#3a4250" }}>
                We identify where AI can move real metrics, align initiatives to business goals, and design the
                operating model to support them—governance, risk guardrails, data foundations, and roles. Then we
                prioritize a practical roadmap, define success metrics, and make buy/build/partner decisions. Opportunity
                sizing is part of the plan, not the plan.
              </div>
            </div>

            <div style={tile}>
              <div data-tile-title style={tileTitle}>Software</div>
              <div style={{ fontSize: 14, color: "#3a4250" }}>
                Bespoke apps & automations that embed Machine Learning (ML) and Natural Language Processing (NLP) into real workflows—prototyped with users and shipped fast,
                with measurement baked in.
              </div>
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: "pointer", color: NAVY, fontSize: 14 }}>
                  Show examples ▾
                </summary>
                <div style={{ fontSize: 13.5, color: "#3a4250", marginTop: 8 }}>
                  <p style={{ margin: "0 0 8px" }}>
                    <strong style={{ color: NAVY }}>
                      <a
                        href="https://insiderperformance.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: NAVY, textDecoration: "none", borderBottom: `1px solid ${NAVY}` }}
                      >
                        InsiderPerformance.com
                      </a>
                    </strong>{" "}
                    — An investment intelligence product that uses ML + NLP to parse insider trading filings (Forms 3/4/5),
                    derive proprietary features beyond simple net-buy/net-sell, and generate confidence-scored signals.
                    The system powers watchlists and alerting with an evaluation harness against baselines and live monitoring
                    for drift.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: NAVY }}>Legal operations (professional sports leagues)</strong> — “legal operations”
                    tooling combining policy corpus retrieval, semantic search, structured query handling, and AI-assisted drafting
                    for correspondence. Includes smart document classification and role-aware guardrails, reducing turnaround time
                    while preserving compliance.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>

        <div style={divider} />

        {/* Founder — exact text + larger photo */}
        <section id="about" aria-labelledby="about-title">
          <h2 id="about-title" style={h2}>Founder</h2>
          <div style={{ display: "grid", gridTemplateColumns: `${FOUNDER_PHOTO_SIZE}px 1fr`, gap: 16, alignItems: "start" }}>
            <img
              id="founder-photo"
              src={photoOk ? FOUNDER_PHOTO_URL : ""}
              onError={() => setPhotoOk(false)}
              alt="Portrait of Alex Francois"
              style={{
                width: FOUNDER_PHOTO_SIZE,
                height: FOUNDER_PHOTO_SIZE,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid #E7EAF0",
              }}
            />
            <p id="founder-text" style={{ margin: 0, maxWidth: 860 }}>
              Alex Francois — Former NFL Director of Business Strategy (8 years) and led the global launch of VALORANT esports at Riot Games. I help organizations harness AI through strategy and custom software—and partner with domain experts to co-build niche SaaS where we see real, defensible value.
            </p>
          </div>
        </section>

        <div style={divider} />

        {/* Contact — EmailJS short form */}
        <section id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title" style={h2}>Contact</h2>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
            <input
              name="name"
              required
              placeholder="Name"
              aria-label="Name"
              style={{ border: "1px solid #E7EAF0", borderRadius: 10, padding: "10px 12px", fontSize: 14 }}
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              aria-label="Email"
              style={{ border: "1px solid #E7EAF0", borderRadius: 10, padding: "10px 12px", fontSize: 14 }}
            />
            <input
              name="company"
              placeholder="Company (optional)"
              aria-label="Company"
              style={{ border: "1px solid #E7EAF0", borderRadius: 10, padding: "10px 12px", fontSize: 14 }}
            />
            <select
              name="interest"
              aria-label="Interest"
              defaultValue=""
              style={{ border: "1px solid #E7EAF0", borderRadius: 10, padding: "10px 12px", fontSize: 14, color: "#3a4250" }}
            >
              <option value="" disabled>
                I’m interested in…
              </option>
              <option>Strategy</option>
              <option>Software</option>
              <option>Niche SaaS</option>
              <option>Other</option>
            </select>
            <textarea
              name="message"
              required
              placeholder="How can we help?"
              aria-label="Message"
              rows={5}
              style={{ border: "1px solid #E7EAF0", borderRadius: 10, padding: "10px 12px", fontSize: 14 }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={sending}
                style={{
                  border: `1px solid ${NAVY}`,
                  color: NAVY,
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontWeight: 600,
                  background: "transparent",
                  cursor: "pointer",
                  minWidth: 120,
                }}
              >
                {sending ? "Sending…" : "Send"}
              </button>
              {sent && (
                <span style={{ fontSize: 13, color: "#1d7a37" }}>
                  Thanks — we’ll be in touch shortly.
                </span>
              )}
              {err && (
                <span style={{ fontSize: 13, color: "#b00020" }}>
                  {err}
                </span>
              )}
              {!sent && !err && (
                <span style={{ fontSize: 12, color: "#5c6474" }}>
                  Goes to <strong>{DESTINATION_EMAIL}</strong>
                </span>
              )}
            </div>
          </form>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #EFF1F4" }}>
        <div style={{ ...container, padding: "20px 24px", color: "#5c6474", fontSize: 14 }}>
          © {new Date().getFullYear()} Falcon View Group
        </div>
      </footer>
    </div>
  );
}
