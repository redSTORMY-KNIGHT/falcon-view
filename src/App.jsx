import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import TabNavigation from "./TabNavigation";


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

// Hero Loader Component
function HeroLoader({ onComplete, animationComplete }) {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Start text animation after paths begin
    setTimeout(() => setTextVisible(true), 500);
    // Complete animation automatically
    setTimeout(() => onComplete(), 3000);
  }, [onComplete]);

  const generatePaths = () => {
    const paths = [];
    for (let i = 0; i < 24; i++) {
      const startX = -380 + i * 15;
      const startY = -189 + i * 12;
      const cp1X = -312 + i * 15;
      const cp1Y = 216 - i * 12;
      const cp2X = 152 + i * 15;
      const cp2Y = 343 - i * 12;
      const endX = 616 + i * 15;
      const endY = 470 - i * 12;
      
      paths.push({
        id: i,
        d: `M${startX} ${startY}C${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY}`,
        opacity: 0.05 + i * 0.02,
        strokeWidth: 0.5 + i * 0.05,
        duration: 15 + i * 0.5,
        delay: i * 0.1,
      });
    }
    return paths;
  };

  const paths = generatePaths();
  const title = "Falcon View Group";
  const words = title.split(" ");

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      transition: "opacity 0.8s ease-out",
      opacity: animationComplete ? 0 : 1,
    }}>
      {/* Animated paths background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          {paths.map((path) => (
            <path
              key={path.id}
              d={path.d}
              fill="none"
              stroke={NAVY}
              strokeWidth={path.strokeWidth}
              opacity={path.opacity}
              style={{
                animation: `drawPath ${path.duration}s linear infinite`,
                animationDelay: `${path.delay}s`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        textAlign: "center",
        padding: "0 24px",
        maxWidth: 980,
      }}>
        {/* Animated title */}
        <h1 style={{
          fontSize: 42,
          fontWeight: 800,
          margin: 0,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}>
          {words.map((word, wordIndex) => (
            <span key={wordIndex} style={{ display: "inline-block", marginRight: 16 }}>
              {word.split("").map((letter, letterIndex) => (
                <span
                  key={`${wordIndex}-${letterIndex}`}
                  style={{
                    display: "inline-block",
                    color: NAVY,
                    opacity: textVisible ? 1 : 0,
                    transform: textVisible ? "translateY(0)" : "translateY(60px)",
                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
                    transitionDelay: `${wordIndex * 0.1 + letterIndex * 0.03}s`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      <style>{`
        @keyframes drawPath {
          0% {
            stroke-dasharray: 0 1000;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 1000 1000;
            stroke-dashoffset: -1000;
          }
          100% {
            stroke-dasharray: 0 1000;
            stroke-dashoffset: -2000;
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [logoOk, setLogoOk] = useState(true);
  const [photoOk, setPhotoOk] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

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
  const divider = { borderTop: "1px solid #EFF1F4", margin: "62px 0" };
  const h2 = { 
    color: NAVY, 
    fontSize: 26, 
    margin: "0 0 16px", 
    fontWeight: 700,
    letterSpacing: "-0.02em",
  };
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

  // Fonts + EmailJS init + Scroll animations
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
    document.title = "Falcon View Group";
    
    // Removed scroll animations temporarily
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

  // Handle loader completion
  const handleLoaderComplete = () => {
    setAnimationComplete(true);
    setTimeout(() => {
      setShowLoader(false);
      // Start fade-in after a brief delay
      setTimeout(() => {
        setContentVisible(true);
      }, 100);
    }, 800);
  };

  if (showLoader) {
    return (
      <HeroLoader onComplete={handleLoaderComplete} animationComplete={animationComplete} />
    );
  }

  return (
    <div style={{ 
      background: "#f8f9fb", 
      minHeight: "100vh", 
      position: "relative",
      opacity: contentVisible ? 1 : 0,
      transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {/* Abstract Background Design */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 1024"
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: 0.25 }}
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: NAVY, stopOpacity: 0.6 }} />
              <stop offset="50%" style={{ stopColor: "#1a3a6e", stopOpacity: 0.4 }} />
              <stop offset="100%" style={{ stopColor: "#0b1d40", stopOpacity: 0.2 }} />
            </linearGradient>
            <filter id="blur1">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>
          
          {/* Large background circles */}
          <circle cx="120" cy="150" r="200" fill="url(#grad1)" opacity="0.3" filter="url(#blur1)" />
          <circle cx="1320" cy="400" r="300" fill={NAVY} opacity="0.15" filter="url(#blur1)" />
          <circle cx="700" cy="800" r="250" fill="#1a3a6e" opacity="0.2" filter="url(#blur1)" />
          
          {/* Flowing paths */}
          <path
            d="M0,400 Q360,300 720,400 T1440,400"
            fill="none"
            stroke={NAVY}
            strokeWidth="2"
            opacity="0.1"
          />
          <path
            d="M0,600 Q360,500 720,600 T1440,600"
            fill="none"
            stroke="#1a3a6e"
            strokeWidth="1.5"
            opacity="0.08"
          />
          
          {/* Geometric shapes */}
          <polygon
            points="1200,100 1350,200 1200,300 1050,200"
            fill={NAVY}
            opacity="0.1"
            transform="rotate(45 1200 200)"
          />
          <polygon
            points="200,700 350,800 200,900 50,800"
            fill="#1a3a6e"
            opacity="0.12"
            transform="rotate(-30 200 800)"
          />
        </svg>
        
        {/* Additional floating elements */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: 300,
            height: 300,
            background: `radial-gradient(circle, ${NAVY}22 0%, transparent 70%)`,
            borderRadius: "50%",
            animation: "float 20s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: 400,
            height: 400,
            background: "radial-gradient(circle, #1a3a6e18 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 25s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Quick CSS: sticky-header offset + mobile polish */}
      <style>{`
        /* Smooth scrolling + anchor offset for sticky header */
        html { scroll-behavior: smooth; }
        
        /* Floating animation */
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Header height estimate (adjust if you tweak logo/brand size) */
        :root { --header-h: 104px; }             /* desktop/tablet with tab navigation */
        @media (max-width: 640px) {
          :root { --header-h: 72px; }          /* mobile with cleaner header */
        }

        /* Make anchor targets stop below the sticky header */
        section[id], main[id] { scroll-margin-top: calc(var(--header-h) + 8px); }
        
        /* Removed animations temporarily to fix visibility issue */

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
        
        /* Responsive grid for Why AI section */
        @media (max-width: 768px) {
          #why-ai-grid {
            grid-template-columns: 1fr !important;
          }
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
            padding: "16px 24px",
            minHeight: "72px",
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
          <div className="desktop-nav">
            <TabNavigation darkMode={false} />
          </div>

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

      <main id="top" style={{ 
        ...container, 
        paddingTop: 56, 
        paddingBottom: 60, 
        position: "relative", 
        zIndex: 1,
        background: "white",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(11, 29, 64, 0.08)",
        marginTop: 24,
        marginBottom: 24,
      }}>
        {/* Hero */}
        <section aria-labelledby="hero-title" style={{ marginBottom: 8, position: "relative" }}>
          <h1
            id="hero-title"
            style={{
              color: NAVY,
              fontSize: 44,
              lineHeight: 1.15,
              margin: "0 0 16px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
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

        <div style={{ ...divider, position: "relative" }}>
          <div style={{
            position: "absolute",
            top: "-2px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${NAVY}20, transparent)`,
            borderRadius: 2,
          }} />
        </div>

        {/* How we help — Strategy + Software with examples */}
        <section id="help" aria-labelledby="help-title">
          <h2 id="help-title" style={h2}>How we help</h2>
          <div style={tileWrap}>
            <div style={tile}>
              <div data-tile-title style={{ ...tileTitle, fontSize: 17 }}>
                AI Strategy Consulting
              </div>
              <div style={{ fontSize: 14, color: "#3a4250", marginBottom: 12 }}>
                We help organizations understand and exploit AI's potential in their specific market context. Our experience spans from advising professional sports leagues to financial institutions.
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5, color: "#5c6474" }}>
                <li>Identify where AI can move real metrics</li>
                <li>Design operating models with proper governance</li>
                <li>Create practical roadmaps with clear ROI</li>
                <li>Make informed buy/build/partner decisions</li>
              </ul>
            </div>

            <div style={tile}>
              <div data-tile-title style={{ ...tileTitle, fontSize: 17 }}>
                Bespoke AI-Powered Software
              </div>
              <div style={{ fontSize: 14, color: "#3a4250", marginBottom: 16 }}>
                Custom applications that leverage AI to solve critical business challenges.
              </div>
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: "pointer", color: NAVY, fontSize: 14, fontWeight: 600 }}>
                  View examples ▾
                </summary>
                <div style={{ fontSize: 13.5, color: "#3a4250", marginTop: 12 }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, color: NAVY, marginBottom: 4 }}>
                      Investment Intelligence Platform
                    </div>
                    <a
                      href="https://insiderperformance.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: NAVY, textDecoration: "none", borderBottom: `1px solid ${NAVY}`, fontSize: 13 }}
                    >
                      InsiderPerformance.com
                    </a>
                    <ul style={{ margin: "4px 0 0 0", paddingLeft: 20, fontSize: 12.5, color: "#5c6474" }}>
                      <li>ML + NLP analysis of insider trading filings</li>
                      <li>Proprietary metrics beyond basic buy/sell signals</li>
                      <li>Real-time monitoring with drift detection</li>
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: NAVY, marginBottom: 4 }}>
                      Legal Operations AI
                    </div>
                    <div style={{ fontSize: 13, color: "#5c6474", marginBottom: 4 }}>Major Professional Sports Leagues</div>
                    <ul style={{ margin: "4px 0 0 0", paddingLeft: 20, fontSize: 12.5, color: "#5c6474" }}>
                      <li>Intelligent policy management & retrieval</li>
                      <li>AI-powered query processing</li>
                      <li>Automated drafting with compliance guardrails</li>
                    </ul>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>

        <div style={{ ...divider, position: "relative" }}>
          <div style={{
            position: "absolute",
            top: "-2px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${NAVY}20, transparent)`,
            borderRadius: 2,
          }} />
        </div>

        {/* Why AI Changes Everything */}
        <section id="why-ai" aria-labelledby="why-ai-title">
          <h2 id="why-ai-title" style={{ ...h2, textAlign: "center" }}>Why AI Changes Everything</h2>
          <p style={{ 
            fontSize: 16, 
            color: "#3a4250", 
            textAlign: "center",
            maxWidth: 680,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.8,
            marginTop: 24,
          }}>
            Traditional software development requires large teams and long timelines. 
            Our AI-assisted approach enables us to build enterprise-grade solutions with small, 
            agile teams—rapidly prototyping based on real user feedback and creating custom 
            ML models tailored to your specific business logic.
          </p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginTop: 32,
            flexWrap: "wrap",
          }}>
            <div style={{ textAlign: "center", position: "relative" }}>
              <div style={{ 
                fontSize: 42, 
                fontWeight: 700, 
                color: NAVY, 
                marginBottom: 6,
                background: `linear-gradient(135deg, ${NAVY}, #1a3a6e)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>5x</div>
              <div style={{ fontSize: 13, color: "#5c6474", letterSpacing: "0.5px", textTransform: "uppercase" }}>More efficient</div>
            </div>
            <div style={{ textAlign: "center", position: "relative" }}>
              <div style={{ 
                fontSize: 42, 
                fontWeight: 700, 
                color: NAVY, 
                marginBottom: 6,
                background: `linear-gradient(135deg, ${NAVY}, #1a3a6e)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Small</div>
              <div style={{ fontSize: 13, color: "#5c6474", letterSpacing: "0.5px", textTransform: "uppercase" }}>Agile teams</div>
            </div>
            <div style={{ textAlign: "center", position: "relative" }}>
              <div style={{ 
                fontSize: 42, 
                fontWeight: 700, 
                color: NAVY, 
                marginBottom: 6,
                background: `linear-gradient(135deg, ${NAVY}, #1a3a6e)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Fast</div>
              <div style={{ fontSize: 13, color: "#5c6474", letterSpacing: "0.5px", textTransform: "uppercase" }}>Time to market</div>
            </div>
          </div>
        </section>

        <div style={{ ...divider, position: "relative" }}>
          <div style={{
            position: "absolute",
            top: "-2px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${NAVY}20, transparent)`,
            borderRadius: 2,
          }} />
        </div>

        {/* The Falcon View Advantage */}
        <section id="advantage" aria-labelledby="advantage-title">
          <h2 id="advantage-title" style={{ ...h2, textAlign: "center" }}>The Falcon View Advantage</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}>
            {[
              {
                title: "Deep AI Integration",
                description: "AI at the core, not just chatbots"
              },
              {
                title: "Industry-First",
                description: "Start with your challenges, not our tech"
              },
              {
                title: "Proven Track Record",
                description: "From the NFL to Riot Games"
              },
              {
                title: "Future-Proof",
                description: "Built to evolve with AI"
              }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  border: "1px solid #E7EAF0",
                  borderRadius: 12,
                  padding: "32px 20px 28px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(11, 29, 64, 0.08)";
                  e.currentTarget.style.borderColor = `${NAVY}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#E7EAF0";
                }}
              >
                {/* Subtle geometric accent */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, transparent, ${NAVY}, transparent)`,
                  opacity: 0.3,
                }} />
                {/* Very subtle background gradient */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at top, ${NAVY}03, transparent 70%)`,
                  pointerEvents: "none",
                }} />
                <h3 style={{ color: NAVY, fontSize: 15, margin: "0 0 8px", fontWeight: 700, letterSpacing: "0.3px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: "#5c6474", margin: 0, lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ ...divider, position: "relative" }}>
          <div style={{
            position: "absolute",
            top: "-2px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${NAVY}20, transparent)`,
            borderRadius: 2,
          }} />
        </div>

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
              Alex Francois — Former NFL Director of Business Strategy and led the global launch of VALORANT esports at Riot Games. I help organizations harness AI through strategy and custom software—and partner with domain experts to co-build niche SaaS where we see real, defensible value.
            </p>
          </div>
        </section>

        <div style={{ ...divider, position: "relative" }}>
          <div style={{
            position: "absolute",
            top: "-2px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${NAVY}20, transparent)`,
            borderRadius: 2,
          }} />
        </div>

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

      <footer style={{ 
        borderTop: "1px solid #EFF1F4",
        background: "white",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ 
          ...container, 
          padding: "20px 24px", 
          color: "#5c6474", 
          fontSize: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}>
          <span>© {new Date().getFullYear()} Falcon View Group</span>
          <a 
            href="https://www.linkedin.com/company/falcon-view-group/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: "#5c6474",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = NAVY}
            onMouseLeave={(e) => e.currentTarget.style.color = "#5c6474"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}
