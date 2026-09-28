import { CSSProperties, FormEvent, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, initMotion } from "./motion";
import { site } from "./site";

type IconName =
  | "arrow"
  | "menu"
  | "close"
  | "sun"
  | "expand"
  | "layers"
  | "store"
  | "spark"
  | "tools"
  | "check"
  | "phone"
  | "mail"
  | "pin"
  | "instagram"
  | "linkedin"
  | "chevron";

const images = {
  hero: "https://images.unsplash.com/photo-1667054787679-85c5f4bb374a?auto=format&fit=crop&w=2200&q=90",
  about:
    "https://images.unsplash.com/photo-1614886205583-92fe9eaa38fb?auto=format&fit=crop&w=1400&q=85",
  projects: [
    "https://images.unsplash.com/photo-1571839154183-6bb84a567903?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1646688821941-c4f9107e0b95?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1582711012153-0ef6ef75d08f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1680445530925-af01b317e0a6?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1676584811471-0ae57de07360?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1717903774049-0b35f9e65da0?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1724855946376-cdd00ba0bbd7?auto=format&fit=crop&w=1200&q=85",
  ],
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    menu: <><path d="M4 8h16" /><path d="M4 16h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
    expand: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /><path d="m3 8 6-5M21 8l-6-5M3 16l6 5M21 16l-6 5" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    store: <><path d="M4 10v11h16V10" /><path d="M3 10h18l-2-6H5l-2 6Z" /><path d="M8 21v-7h8v7" /></>,
    spark: <><path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4L12 2Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    tools: <><path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.6 7 6.3 4.7a4 4 0 0 0 5 5L20 18.4 18.4 20l-8.7-8.7" /><path d="m3 21 6-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    phone: <path d="M6.6 2h3l1.5 5-2.2 1.5a15 15 0 0 0 6.6 6.6l1.5-2.2 5 1.5v3c0 2-1.6 3.6-3.6 3.5C9.5 20.4 2.6 13.5 2 4.6 1.9 3.2 3.1 2 4.6 2h2Z" />,
    mail: <><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".5" /></>,
    linkedin: <><path d="M6 9v12M6 5v.01M10 21v-7a4 4 0 0 1 8 0v7M10 9v12" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Heading({ level = 2, className = "", children }: { level?: 1 | 2 | 3 | 4; className?: string; children: ReactNode }) {
  const Tag = ({ 1: "h1", 2: "h2", 3: "h3", 4: "h4" } as const)[level];
  return <Tag className={className}>{children}</Tag>;
}

function Link({ href, className = "", children, onClick, style }: { href: string; className?: string; children: ReactNode; onClick?: () => void; style?: CSSProperties }) {
  return <a href={href} className={className} onClick={onClick} style={style}>{children}</a>;
}

function Button({ children, variant = "primary", className = "", type = "button", onClick, disabled = false, ariaLabel }: {
  children?: ReactNode; variant?: "primary" | "secondary" | "text" | "icon"; className?: string;
  type?: "button" | "submit"; onClick?: () => void; disabled?: boolean; ariaLabel?: string;
}) {
  return <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>{children}</button>;
}

function SectionIntro({ eyebrow, title, text, align = "left" }: { eyebrow: string; title: string; text?: string; align?: "left" | "center" }) {
  return <div className={`section-intro ${align}`} data-reveal data-motion="Effect: fade + rise 32; Trigger: scroll; Duration: .8s; Ease: power3.out">
    <span className="eyebrow">{eyebrow}</span>
    <Heading>{title}</Heading>
    {text && <p>{text}</p>}
  </div>;
}

const services: { icon: IconName; title: string; text: string }[] = [
  { icon: "sun", title: "Indoor LED Screens", text: "Ultra-fine pixel pitch displays with exceptional color and clarity for every interior." },
  { icon: "expand", title: "Outdoor LED Displays", text: "Weather-ready, daylight-bright screens engineered for maximum outdoor impact." },
  { icon: "layers", title: "Event & Stage Rental", text: "Seamless LED walls, technical direction and support for unforgettable live events." },
  { icon: "store", title: "Retail & Advertising", text: "High-impact digital experiences designed to turn attention into action." },
  { icon: "spark", title: "Custom LED Solutions", text: "Creative shapes, curves and configurations tailored to your space and vision." },
  { icon: "tools", title: "Install & Maintenance", text: "End-to-end installation, calibration and reliable ongoing technical care." },
];

const projects = [
  { title: "Aurora Live", category: "Concerts", image: images.projects[0], tall: true },
  { title: "Spectrum Pavilion", category: "Exhibitions", image: images.projects[1] },
  { title: "Pulse Arena", category: "Corporate", image: images.projects[2] },
  { title: "Immersive Sessions", category: "Concerts", image: images.projects[3], tall: true },
  { title: "Atelier Launch", category: "Retail", image: images.projects[4] },
  { title: "Future Gallery", category: "Exhibitions", image: images.projects[5] },
  { title: "Celestial Reception", category: "Weddings", image: images.projects[6], tall: true },
];

const motionSpecs = [
  ["Navigation", "Slide + fade / link stagger", "Load · 0.8s · power3.out · stagger .08"],
  ["Hero copy", "Split words rise 40 + fade", "Load · 0.9s · power3.out · stagger .1"],
  ["Hero media", "Slow zoom 1.08 → 1", "Load · 6s · power2.out"],
  ["Section reveals", "Rise 32 + fade", "ScrollTrigger top 80% · .8s · power3.out"],
  ["Service cards", "Rise 50 + stagger", "ScrollTrigger top 80% · .7s · stagger .12"],
  ["Project filter", "Scale/fade + layout reflow", "Click · .55s · power3.inOut"],
  ["Project hover", "Image zoom + caption rise", "Hover · .4s · power2.out"],
  ["Map pin", "Drop + bounce + ripple", "ScrollTrigger top 80% · .9s · elastic.out"],
];

function Counter({ end, suffix = "", decimals = 0 }: { end: number; suffix?: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const started = performance.now();
      const duration = 1500;
      const tick = (now: number) => {
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(end * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: .6 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [end]);

  return <strong ref={ref}>{value.toFixed(decimals)}{suffix}</strong>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [quote, setQuote] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [specOpen, setSpecOpen] = useState<"style" | "motion" | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const root = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-35% 0px -50% 0px", threshold: [0, .2, .5] });
    root.current?.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

    const moveCursor = (event: MouseEvent) => {
      if (!cursor.current) return;
      cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    window.addEventListener("mousemove", moveCursor, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", moveCursor);
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setQuote((current) => (current + 1) % 3), 6000);
    return () => window.clearInterval(timer);
  }, []);

  useLayoutEffect(() => (root.current ? initMotion(root.current) : undefined), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightbox(null); setSpecOpen(null); setMenuOpen(false); }
      if (lightbox !== null && e.key === "ArrowRight") setLightbox((lightbox + 1) % projects.length);
      if (lightbox !== null && e.key === "ArrowLeft") setLightbox((lightbox - 1 + projects.length) % projects.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const changeFilter = (chip: string) => {
    flipState.current = Flip.getState(".project");
    setFilter(chip);
  };
  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      targets: ".project", duration: 0.55, ease: "power3.inOut", scale: true, absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }),
    });
    flipState.current = null;
  }, [filter]);

  const filtered = filter === "All" ? projects : projects.filter((project) => project.category === filter);
  const quotes = [
    ["VIP didn't just deliver a screen — they transformed the room. Every detail was flawless, from planning to the final pixel.", "Sophia Bennett", "North & Co. Events"],
    ["The clarity, service and calm technical direction were exceptional. VIP has become our first call for every launch.", "Marcus Chen", "Aster Retail Group"],
    ["A truly premium partner. The installation disappeared into our architecture and the content has never looked better.", "Elena Rossi", "Form Studio"],
  ];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const d = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const text = [
      "New quote request (Vision in Pixels website)",
      `Name: ${d.name}`, `Email: ${d.email}`, `Phone: ${d.phone || "-"}`,
      `Event type: ${d.eventType || "-"}`, `Date: ${d.date || "-"}`,
      `Screen size / needs: ${d.needs || "-"}`, `Details: ${d.message || "-"}`,
    ].join("\n");
    setSubmitted(true);
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return <div className="app" ref={root}>
    <span className="scroll-progress" ref={progressBar} aria-hidden="true" />
    <span className="cursor-glow" ref={cursor} aria-hidden="true" />
    <header className={`nav ${scrolled ? "scrolled" : ""}`} data-motion="Effect: slide down + fade; Trigger: load; Duration: .8s; Ease: power3.out">
      <div className="nav-inner">
        <Link href="#home" className="brand" aria-label="Vision in Pixels home">
          <span className="brand-badge"><b>VIP</b></span>
          <span className="brand-copy"><b>Vision in Pixels</b><small>LED experiences</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {["Home", "About", "Services", "Gallery", "Contact"].map((item, index) =>
            <Link href={`#${item.toLowerCase()}`} className={activeSection === item.toLowerCase() ? "active" : ""} key={item} style={{ "--i": index } as React.CSSProperties}>{item}</Link>)}
        </nav>
        <Link href="#contact" className="btn btn-primary nav-quote">Get a free quote <Icon name="arrow" size={18} /></Link>
        <Button variant="icon" className="menu-toggle" onClick={() => setMenuOpen(true)} ariaLabel="Open menu"><Icon name="menu" size={26} /></Button>
      </div>
    </header>

    <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
      <div className="mobile-menu-top"><span className="brand-badge"><b>VIP</b></span><Button variant="icon" onClick={() => setMenuOpen(false)} ariaLabel="Close menu"><Icon name="close" /></Button></div>
      <nav>{["Home", "About", "Services", "Gallery", "Contact"].map((item, index) =>
        <Link href={`#${item.toLowerCase()}`} key={item} onClick={() => setMenuOpen(false)} style={{ "--i": index } as React.CSSProperties}>{item}<Icon name="arrow" /></Link>)}</nav>
      <Link href="#contact" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Get a free quote <Icon name="arrow" /></Link>
    </div>

    <main>
      <section className="hero" id="home">
        <div className="hero-media" data-motion="Effect: scale 1.08 → 1; Trigger: load; Duration: 6s; Ease: power2.out">
          <img src={images.hero} alt="Large LED installation casting colorful light in a modern venue" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <span className="eyebrow hero-eyebrow">Premium LED experiences</span>
          <Heading level={1} className="hero-title" data-motion="Effect: split words rise 40 + fade; Trigger: load; Duration: .9s; Ease: power3.out; Stagger: .1s">
            <span>Make every</span><span><em>pixel</em> count.</span>
          </Heading>
          <p className="hero-sub">Premium LED screens for events, retail and brands. Designed to be seen. Built to be remembered.</p>
          <div className="hero-actions">
            <Link href="#contact" className="btn btn-primary">Book your event <Icon name="arrow" /></Link>
            <Link href="#services" className="btn btn-secondary">Explore services</Link>
          </div>
          <div className="trust-row">
            {["Sales, rental & installation", "Free site survey", "Full technical support"].map((item) => <span key={item}><Icon name="check" size={15} />{item}</span>)}
          </div>
        </div>
        <Link href="#about" className="scroll-cue" aria-label="Scroll to about"><span>Scroll</span><i /></Link>
      </section>
      <div className="capability-marquee" aria-label="Vision in Pixels capabilities">
        <div>{["Events", "Retail", "Corporate", "Installations", "Concerts", "Exhibitions", "Events", "Retail", "Corporate", "Installations", "Concerts", "Exhibitions"].map((item, index) => <span key={`${item}-${index}`}>{item}<i /></span>)}</div>
      </div>

      <section className="section about" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-copy">
              <SectionIntro eyebrow="About Vision in Pixels" title="Technology with a human touch." />
              <p className="lead" data-reveal>We bring premium LED screens to events, shops and brands. From one-night shows to permanent installations, every project gets our full attention, from choosing the right pixel pitch to the final calibration.</p>
              <div className="values" data-reveal>
                {[["sun", "Brightness & clarity"], ["expand", "Built to any size"], ["spark", "End-to-end service"]].map(([icon, text]) =>
                  <div className="value" key={text}><span><Icon name={icon as IconName} /></span><b>{text}</b></div>)}
              </div>
              <Link href="#services" className="text-link" data-reveal>Discover our approach <Icon name="arrow" /></Link>
            </div>
            <div className="about-visual" data-reveal data-motion="Effect: clip-path wipe left → right; Trigger: scroll; Duration: 1.1s; Ease: power3.inOut">
              <img src={images.about} alt="LED technician carefully installing a large display" />
              <div className="floating-stat"><strong>Free</strong><span>Site survey with<br />every quote</span></div>
            </div>
          </div>
          <div className="stats" data-reveal>
            {[["Indoor + Outdoor", "Screens for every space"], ["Sales + Rental", "Buy it or hire it"], ["Any size", "Custom sizes and shapes"], ["One team", "From survey to support"]].map(([title, text]) =>
              <div className="stat" key={title}><strong>{title}</strong><span>{text}</span></div>)}
          </div>
          <div className="timeline" data-reveal data-motion="Effect: line draws, nodes stagger; Trigger: scroll; Duration: 1.2s; Ease: power3.out">
            <div className="timeline-line" />
            {[["Step 1", "Consultation", "We learn about your space, audience and budget."], ["Step 2", "Design & quote", "Right screen, right pixel pitch, clear pricing."], ["Step 3", "Installation", "Safe mounting, wiring and calibration on site."], ["Step 4", "Ongoing support", "Training, maintenance and fast technical help."]].map(([year, title, text]) =>
              <div className="milestone" key={year}><i /><span>{year}</span><b>{title}</b><p>{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="container">
          <SectionIntro eyebrow="What we do" title="A screen for every vision." text="From intimate spaces to stadium-scale moments, we make complex display technology feel beautifully simple." />
          <div className="service-grid">
            {services.map((service, index) => <article className="service-card" key={service.title} data-reveal style={{ "--i": index } as React.CSSProperties} data-motion="Effect: y 50 + fade; Trigger: scroll; Duration: .7s; Ease: power3.out; Stagger: .12s">
              <span className="service-number">0{index + 1}</span>
              <span className="service-icon"><Icon name={service.icon} size={27} /></span>
              <Heading level={3}>{service.title}</Heading>
              <p>{service.text}</p>
              <Link href="#contact" className="text-link">Learn more <Icon name="arrow" size={18} /></Link>
            </article>)}
          </div>
        </div>
      </section>

      <section className="section gallery" id="gallery">
        <div className="container">
          <div className="gallery-head">
            <SectionIntro eyebrow="Selected work" title="Made for the moment." text="Explore luminous spaces and live experiences brought to life by Vision in Pixels." />
            <div className="filters" role="group" aria-label="Filter projects">
              {["All", "Weddings", "Corporate", "Concerts", "Retail", "Exhibitions"].map((chip) =>
                <Button key={chip} variant="text" className={`chip ${filter === chip ? "active" : ""}`} onClick={() => changeFilter(chip)}>{chip}</Button>)}
            </div>
          </div>
          <div className="gallery-meta"><span>{String(filtered.length).padStart(2, "0")} curated projects</span><span>Drag or select to explore</span></div>
          <div className="project-grid" data-motion="Effect: Flip reflow + scale fade; Trigger: filter click; Duration: .55s; Ease: power3.inOut">
            {filtered.map((project) => {
              const originalIndex = projects.indexOf(project);
              return <article className={`project ${project.tall ? "tall" : ""}`} key={project.title}>
                <img src={project.image} alt={`${project.title} LED screen project`} />
                <div className="project-caption"><span>{project.category}</span><Heading level={3}>{project.title}</Heading></div>
                <Button variant="icon" className="project-open" onClick={() => setLightbox(originalIndex)} ariaLabel={`Open ${project.title} project`}><Icon name="expand" /></Button>
              </article>;
            })}
          </div>
        </div>
      </section>

      {site.showTestimonials && <section className="section testimonials">
        <div className="container">
          <span className="eyebrow">Trusted in every detail</span>
          <div className="quote" key={quote} data-motion="Effect: crossfade + x 24; Trigger: auto every 6s; Duration: .6s; Ease: power3.out">
            <span className="quote-mark">“</span>
            <blockquote>{quotes[quote][0]}</blockquote>
            <cite><b>{quotes[quote][1]}</b><span>{quotes[quote][2]}</span></cite>
          </div>
          <div className="quote-dots">{quotes.map((_, index) => <Button key={index} variant="icon" className={quote === index ? "active" : ""} onClick={() => setQuote(index)} ariaLabel={`Show testimonial ${index + 1}`} />)}</div>
          <div className="client-logos" data-reveal>{["MONUMENT", "North & Co.", "ASTER", "FORM / STUDIO", "LUMEN"].map((logo) => <span key={logo}>{logo}</span>)}</div>
        </div>
      </section>}

      <section className="section contact" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-wrap">
              <SectionIntro eyebrow="Start a project" title="Let's make it brilliant." text="Tell us a little about your vision. Our team will come back with clear ideas and a tailored quote." />
              <form onSubmit={submit}>
                <div className="form-grid" data-reveal data-motion="Effect: fields rise + stagger; Trigger: scroll; Duration: .7s; Ease: power3.out; Stagger: .08s">
                  <label><input name="name" required placeholder=" " /><span>Name</span></label>
                  <label><input name="email" type="email" required placeholder=" " /><span>Email</span></label>
                  <label><input name="phone" type="tel" placeholder=" " /><span>Phone</span></label>
                  <label className="select-label"><select name="eventType" defaultValue=""><option value="" disabled>Event type</option><option>Corporate event</option><option>Concert / stage</option><option>Retail installation</option><option>Wedding</option><option>Other</option></select><Icon name="chevron" size={16} /></label>
                  <label><input name="date" type="date" placeholder=" " /><span>Event date</span></label>
                  <label><input name="needs" placeholder=" " /><span>Screen size / needs</span></label>
                  <label className="full"><textarea name="message" placeholder=" " rows={3} /><span>Tell us about your project</span></label>
                </div>
                <Button type="submit" className={submitted ? "submitted" : ""}>{submitted ? <><Icon name="check" /> Request received</> : <>Request my quote <Icon name="arrow" /></>}</Button>
              </form>
            </div>
            <div className="contact-side">
              <div className="map-card" data-reveal>
                <div className="map-art" aria-label="Stylized map showing Vision in Pixels location">
                  <span className="road r1" /><span className="road r2" /><span className="road r3" /><span className="road r4" />
                  <span className="map-pin" data-motion="Effect: pin drops + ripple; Trigger: scroll; Duration: .9s; Ease: elastic.out"><Icon name="pin" size={30} /></span>
                  <span className="map-label"><b>VIP Studio</b><small>Visit by appointment</small></span>
                </div>
              </div>
              <div className="contact-details" data-reveal>
                <Link href={`tel:${site.phoneHref}`}><Icon name="phone" /><span><small>Call us</small><b>{site.phone}</b></span></Link>
                <Link href={`mailto:${site.email}`}><Icon name="mail" /><span><small>Email</small><b>{site.email}</b></span></Link>
                <div><Icon name="pin" /><span><small>Studio</small><b>{site.address}</b></span></div>
              </div>
              <Link href={`https://wa.me/${site.whatsapp}`} className="btn btn-secondary full-btn">Chat on WhatsApp <Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer className="footer">
      <div className="container">
        <div className="footer-grid" data-reveal data-motion="Effect: columns fade up; Trigger: scroll; Duration: .7s; Ease: power3.out; Stagger: .1s">
          <div className="footer-brand"><span className="brand-badge"><b>VIP</b></span><Heading level={3}>Vision in Pixels</Heading><p>Premium LED experiences, engineered to make every pixel count.</p></div>
          <div><b className="footer-title">Explore</b>{["About", "Services", "Gallery", "Contact"].map((item) => <Link href={`#${item.toLowerCase()}`} key={item}>{item}</Link>)}</div>
          <div><b className="footer-title">Services</b>{["LED screen rental", "Permanent installs", "Creative solutions", "Technical support"].map((item) => <Link href="#services" key={item}>{item}</Link>)}</div>
          <div className="newsletter"><b className="footer-title">A brighter inbox</b><p>Occasional projects, ideas and behind-the-scenes stories.</p><label><input type="email" placeholder="Email address" aria-label="Newsletter email" /><Button variant="icon" ariaLabel="Subscribe"><Icon name="arrow" /></Button></label></div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Vision in Pixels. All rights reserved.</span>
          <div><Button variant="text" onClick={() => setSpecOpen("style")}>Style guide</Button><Button variant="text" onClick={() => setSpecOpen("motion")}>Motion spec</Button></div>
          <div className="socials"><Link href={site.instagram} aria-label="Instagram"><Icon name="instagram" /></Link><Link href={site.linkedin} aria-label="LinkedIn"><Icon name="linkedin" /></Link></div>
        </div>
      </div>
    </footer>

    <div className="mobile-bar"><Link href={`tel:${site.phoneHref}`} className="btn btn-secondary"><Icon name="phone" /> Call</Link><Link href="#contact" className="btn btn-primary">Get quote <Icon name="arrow" /></Link></div>

    {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Project lightbox">
      <Button variant="icon" className="lightbox-close" onClick={() => setLightbox(null)} ariaLabel="Close lightbox"><Icon name="close" /></Button>
      <Button variant="icon" className="lightbox-prev" onClick={() => setLightbox((lightbox - 1 + projects.length) % projects.length)} ariaLabel="Previous project"><Icon name="chevron" /></Button>
      <img src={projects[lightbox].image} alt={`${projects[lightbox].title} LED screen project`} />
      <div><span>{projects[lightbox].category}</span><Heading level={3}>{projects[lightbox].title}</Heading></div>
      <Button variant="icon" className="lightbox-next" onClick={() => setLightbox((lightbox + 1) % projects.length)} ariaLabel="Next project"><Icon name="chevron" /></Button>
    </div>}

    {specOpen && <div className="spec-modal" role="dialog" aria-modal="true" aria-label={`${specOpen} specification`}>
      <div className="spec-panel">
        <div className="spec-head"><div><span className="eyebrow">Developer handoff</span><Heading>{specOpen === "style" ? "Style guide" : "Motion spec"}</Heading></div><Button variant="icon" onClick={() => setSpecOpen(null)} ariaLabel="Close specification"><Icon name="close" /></Button></div>
        {specOpen === "style" ? <div className="style-spec">
          <div><Heading level={3}>Color system</Heading><div className="swatches">{[["Warm white", "#FAF8F3"], ["Pure white", "#FFFFFF"], ["Soft ivory", "#F3EFE4"], ["Charcoal", "#1E1E1E"], ["Gold", "#C9A24B"], ["Light gold", "#F2E3A9"], ["Cyan", "#00C2E0"]].map(([name, color]) => <span key={name}><i style={{ background: color }} /><b>{name}</b><small>{color}</small></span>)}</div></div>
          <div className="type-spec"><Heading level={3}>Typography</Heading><Heading level={1}>Playfair Display</Heading><p>Inter for body copy, interface labels and supporting text. Built on an 8pt spacing system.</p></div>
          <div><Heading level={3}>Component states</Heading><div className="component-row"><Button>Primary <Icon name="arrow" /></Button><Button variant="secondary">Secondary</Button><Button disabled>Disabled</Button><Button variant="text">Text action <Icon name="arrow" /></Button></div></div>
        </div> : <div className="motion-spec"><p>GSAP-ready timing and trigger notes. Every animated production element is tagged in the DOM with a <code>data-motion</code> annotation.</p>{motionSpecs.map(([element, effect, timing]) => <div key={element}><b>{element}</b><span>{effect}</span><small>{timing}</small></div>)}<aside><b>Reduced motion</b><p>Disable parallax and transforms; preserve simple 0.2s opacity fades. Mobile reveal distance reduces to 24px.</p></aside></div>}
      </div>
    </div>}
  </div>;
}
