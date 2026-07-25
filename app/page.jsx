"use client";
// app/page.jsx  —  erkanerdem.online  ·  Next.js (App Router) multi-page simulation
// Tek dosyada toplanmış sayfa bileşenleri; gerçek Next.js projesinde her sayfa
// app/(sayfa)/page.jsx olarak bölünebilir. Tema: cyberpunk neon.
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView, useScroll, useSpring } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  GÖRSELLER                                                          */
/* ------------------------------------------------------------------ */
const IMG = {
  avatar: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/1f13f3e01-e128-4421-bd7f-497529ce6876.png",
  dashboard: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/151bd4f8d-07dc-4dd1-8971-8d5b8d0a7c14.png",
  chat: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/189845bfd-5934-43b8-a43e-8fd53297fbf1.png",
  shop: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/144703cbc-5c5b-47ce-bb4b-41ffa0e57f2f.png",
  bank: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/1e652d3fe-84c4-4fa5-9a9b-758fef7c3414.png",
  webgl: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/10d4be8f8-d262-40a5-bf03-f7be4bee6436.png",
  code: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/19f447268-91ac-4d77-bf30-950aa90c41c1.png",
};

/* ------------------------------------------------------------------ */
/*  VERİLER                                                            */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { id: "home", label: "ANA SAYFA" },
  { id: "about", label: "HAKKIMDA" },
  { id: "projects", label: "PROJELER" },
  { id: "writings", label: "YAZILAR" },
  { id: "contact", label: "İLETİŞİM" },
];

const TECHS = ["REACT", "NEXT.JS", "TYPESCRIPT", "NODE.JS", "THREE.JS", "TAILWIND", "POSTGRESQL", "DOCKER", "PYTHON", "TENSORFLOW", "FASTAPI", "GRAPHQL"];

const PROJECTS = [
  { id: "01", title: "NöroDash", cat: "ai", catLabel: "YAPAY ZEKA", img: IMG.dashboard, desc: "Gerçek zamanlı veri akışını yapay zeka ile yorumlayan, anomalileri saniyeler içinde tespit eden analitik platformu.", tags: ["Next.js", "TensorFlow", "WebSocket", "D3.js"], year: "2026", featured: true },
  { id: "02", title: "SynthChat", cat: "ai", catLabel: "YAPAY ZEKA", img: IMG.chat, desc: "Doğal dilde konuşan, bağlamı hatırlayan ve 12 dilde hizmet veren yeni nesil sohbet asistanı.", tags: ["React", "OpenAI API", "Node.js", "Redis"], year: "2026", featured: true },
  { id: "03", title: "NeoMarket", cat: "web", catLabel: "WEB", img: IMG.shop, desc: "Headless mimariyle kurulmuş, %99.9 uptime ile çalışan, saniyede 10.000 istek karşılayan e-ticaret altyapısı.", tags: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"], year: "2025", featured: true },
  { id: "04", title: "PulsePay", cat: "mobil", catLabel: "MOBİL", img: IMG.bank, desc: "Biyometrik doğrulamalı, anlık para transferi ve akıllı bütçe analizi sunan mobil bankacılık uygulaması.", tags: ["React Native", "Expo", "Fastify", "MongoDB"], year: "2024" },
  { id: "05", title: "HoloFolio", cat: "opensource", catLabel: "AÇIK KAYNAK", img: IMG.webgl, desc: "Three.js tabanlı, 60 FPS'de çalışan interaktif 3D portfolyo şablonu. GitHub'da 2.4k yıldız.", tags: ["Three.js", "WebGL", "GSAP", "Vite"], year: "2024" },
  { id: "06", title: "CodeNeon", cat: "opensource", catLabel: "AÇIK KAYNAK", img: IMG.code, desc: "50.000+ indirmeye ulaşan, göz yormayan neon renk paletli VS Code tema ve eklenti koleksiyonu.", tags: ["TypeScript", "VS Code API", "Node.js"], year: "2023" },
];

const POSTS = [
  { id: 1, glyph: "NX", color: "#00f0ff", title: "Next.js App Router ile Sunucu Bileşenlerini Derinlemesine Anlamak", date: "18 TEM 2026", read: "12 DK", tags: ["Next.js", "React"], excerpt: "Server Components'in render yaşam döngüsünü, streaming mimarisini ve istemci sınırlarını gerçek projeler üzerinden inceliyoruz.", featured: true },
  { id: 2, glyph: "3D", color: "#ff2bd6", title: "Three.js ile İlk 3D Web Deneyiminizi İnşa Edin", date: "02 TEM 2026", read: "9 DK", tags: ["Three.js", "WebGL"], excerpt: "Sahne, kamera ve renderer üçlüsünden başlayarak tarayıcıda akıcı 3D animasyonlar oluşturmanın temelleri." },
  { id: 3, glyph: "⚡", color: "#c8ff3e", title: "React'ta Performans: Gereksiz Render'ları Önlemenin 7 Yolu", date: "14 HAZ 2026", read: "8 DK", tags: ["React", "Performans"], excerpt: "memo, useMemo, useCallback ne zaman gerçekten gerekli? Profiler ile ölçerek kanıtlanmış optimizasyon teknikleri." },
  { id: 4, glyph: "AI", color: "#7a5cff", title: "Yapay Zeka Destekli Arayüzler: LLM'i Ürüne Entegre Etmek", date: "28 MAY 2026", read: "14 DK", tags: ["Yapay Zeka", "UX"], excerpt: "Streaming yanıtlar, fonksiyon çağrıları ve hata toleranslı tasarımlarla üretim kalitesinde AI özellikleri geliştirme rehberi." },
  { id: 5, glyph: "TS", color: "#00f0ff", title: "TypeScript ile Kırılmaz Tip Güvenliği: İleri Seviye Kalıplar", date: "09 MAY 2026", read: "11 DK", tags: ["TypeScript"], excerpt: "Generic constraint'ler, conditional tipler ve template literal tiplerle hata sınıflarını derleme anında yok edin." },
  { id: 6, glyph: "MD", color: "#ff2bd6", title: "Bu Siteyi Nasıl Yaptım: Next.js + MDX Blog Mimarisi", date: "21 NİS 2026", read: "7 DK", tags: ["Next.js", "MDX"], excerpt: "İçerik yönetiminden SEO'ya, karanlık tema optimizasyonundan deploy hattına kadar bu sitenin tüm anatomisi." },
];

const SKILLS = [
  { name: "JavaScript / TypeScript", lvl: 92 },
  { name: "React / Next.js", lvl: 90 },
  { name: "Python / FastAPI", lvl: 85 },
  { name: "PostgreSQL / Veri Modelleme", lvl: 88 },
  { name: "Three.js / WebGL", lvl: 78 },
  { name: "Yapay Zeka / Makine Öğrenmesi", lvl: 74 },
  { name: "Docker / DevOps", lvl: 80 },
  { name: "Excel VBA / Otomasyon", lvl: 95 },
];

const SOCIALS = [
  { name: "GITHUB", handle: "@erkanerdem" },
  { name: "LINKEDIN", handle: "/in/erkanerdem" },
  { name: "X / TWITTER", handle: "@erkanerdem" },
  { name: "YOUTUBE", handle: "@erkanerdem" },
];

/* ------------------------------------------------------------------ */
/*  KÜÇÜK HOOK'LAR / BİLEŞENLER                                        */
/* ------------------------------------------------------------------ */
function useTypewriter(words, typeSpeed = 65, deleteSpeed = 35, pause = 1500) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[i % words.length];
    let t;
    if (!del && text === word) {
      t = setTimeout(() => setDel(true), pause);
    } else if (del && text === "") {
      t = setTimeout(() => {
        setDel(false);
        setI((v) => v + 1);
      }, 0);
    } else {
      t = setTimeout(() => setText(word.slice(0, text.length + (del ? -1 : 1))), del ? deleteSpeed : typeSpeed);
    }
    return () => clearTimeout(t);
  }, [text, del, i, words, typeSpeed, deleteSpeed, pause]);
  return text;
}

function Reveal({ children, delay = 0, y = 30, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}



function SectionHead({ kicker, title, action, actionLabel }) {
  return (
    <Reveal>
      <div className="sec-head">
        <div>
          <div className="sec-kicker">{kicker}</div>
          <h2 className="sec-title">{title}</h2>
        </div>
        {action && (
          <button className="link-more" onClick={action}>
            {actionLabel}
          </button>
        )}
      </div>
    </Reveal>
  );
}

function PageHead({ crumb, title, big, sub }) {
  return (
    <div className="page-head">
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <motion.div className="crumb" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ~/erkanerdem.online/<b>{crumb}</b>
        </motion.div>
        <motion.h1 className="glitch" data-text={title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {title}
        </motion.h1>
        <motion.p className="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          {sub}
        </motion.p>
      </div>
      <span className="big-bg">{big}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  THREE.JS — NÖRAL AĞ                                                */
/* ------------------------------------------------------------------ */
function NeuralCore() {
  const grp = useRef();
  const { nodePos, linePos } = useMemo(() => {
    const N = 80;
    const pts = [];
    let r = 137;
    const rand = () => { r = (r * 16807 + 0) % 2147483647; return (r - 1) / 2147483646; };
    for (let k = 0; k < N; k++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(1.35 + rand() * 0.85);
      pts.push(v);
    }
    const np = new Float32Array(N * 3);
    pts.forEach((p, idx) => {
      np[idx * 3] = p.x;
      np[idx * 3 + 1] = p.y;
      np[idx * 3 + 2] = p.z;
    });
    const lp = [];
    for (let a = 0; a < N; a++)
      for (let b = a + 1; b < N; b++)
        if (pts[a].distanceTo(pts[b]) < 1.05) lp.push(pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z);
    return { nodePos: np, linePos: new Float32Array(lp) };
  }, []);
  useFrame((state, delta) => {
    if (!grp.current) return;
    grp.current.rotation.y += delta * 0.16;
    grp.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.18;
  });
  return (
    <group ref={grp}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#00f0ff" size={0.055} sizeAttenuation transparent opacity={0.95} depthWrite={false} />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ff2bd6" size={0.13} sizeAttenuation transparent opacity={0.16} depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#7a5cff" transparent opacity={0.32} />
      </lineSegments>
    </group>
  );
}

function NeuralScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.6], fov: 55 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <NeuralCore />
      <Sparkles count={90} scale={5} size={1.6} speed={0.35} opacity={0.5} color="#00f0ff" />
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */
/*  PROJE KARTI                                                        */
/* ------------------------------------------------------------------ */
function ProjectCard({ p, delay = 0, inGrid = false }) {
  const card = (
    <article className="card pcard">
      <div className="thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.img} alt={p.title} loading="lazy" />
        <div className="scanfx" />
        <span className="num">/{p.id}</span>
        <span className="cat">{p.catLabel}</span>
      </div>
      <div className="body">
        <h3>{p.title}</h3>
        <p>{p.desc}</p>
        <div className="tags">
          {p.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="links">
          <button className="plink">CANLI DEMO ↗</button>
          <button className="plink">GITHUB ↗</button>
          <span className="pyear">{p.year}</span>
        </div>
      </div>
    </article>
  );
  if (inGrid) return card;
  return (
    <Reveal delay={delay} className="grid-cell">
      {card}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  ANA SAYFA                                                          */
/* ------------------------------------------------------------------ */
function HomePage({ navigate, projects, posts }) {
  const role = useTypewriter(["VETERİNER HEKİM", "FULL-STACK GELİŞTİRİCİ", "AI & ML ENTHUSIAST", "MÜZİK PRODÜKSİYONU"]);
  const latest = (posts.length ? posts : POSTS).slice(0, 3);
  return (
    <>
      <section className="wrap">
        <div className="hero">
          <div>
            <motion.div className="hero-term" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="dot-live" /> SİSTEM ÇEVRİMİÇİ — erkanerdem.online v5.0.0
            </motion.div>
            <motion.h1 className="hero-name" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <span className="l1">ERKAN</span>
              <span className="l2 glitch" data-text="ERDEM">
                ERDEM
              </span>
            </motion.h1>
            <div className="hero-role">
              &gt; uzmanlık: <span className="typed">{role}</span>
              <span className="caret" />
            </div>
            <motion.p className="hero-desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              2005 yılında Excel formülleri ve VBA makroları ile başlayan yazılım merakım, bugün modern web teknolojileri ve yapay zeka ile profesyonel uygulamalar geliştirmeye evrildi. 17+ yıllık bu yolculukta her adım bir önceki adımın üzerine inşa edildi.
            </motion.p>
            <motion.div className="hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
              <button className="btn solid" onClick={() => navigate("projects")}>
                ◢ Projeleri Gör
              </button>
              <button className="btn alt" onClick={() => navigate("contact")}>
                İletişime Geç
              </button>
            </motion.div>
          </div>
          <motion.div className="hud" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45, duration: 0.7 }}>
            <span className="hud-corner tl" />
            <span className="hud-corner tr" />
            <span className="hud-corner bl" />
            <span className="hud-corner br" />
            <div className="hud-top">
              <span>NÖRAL AĞ // GÖRSELLEŞTİRME</span>
              <span style={{ color: "var(--acid)" }}>● CANLI</span>
            </div>
            <NeuralScene />
            <div className="hud-scan" />
            <div className="hud-bottom">
              <span>ÇEKİRDEK: 88.420 NÖRON</span>
              <span>TARANIYOR...</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Marquee />

    
      <section className="wrap">
        <SectionHead
          kicker="// 01 — PORTFOLYO"
          title={
            <>
              ÖNE ÇIKAN <span className="hl">PROJELER</span>
            </>
          }
          action={() => navigate("projects")}
          actionLabel="TÜMÜNÜ GÖR →"
        />
        <div className="feat-grid">
          {(projects.length ? projects : PROJECTS).filter((p) => p.featured).map((p, i) => (
            <ProjectCard key={p.id} p={p} delay={i * 0.12} />
          ))}
        </div>
      </section>

      <section className="wrap">
        <SectionHead
          kicker="// 02 — BLOG"
          title={
            <>
              SON <span className="hl">YAZILAR</span>
            </>
          }
          action={() => navigate("writings")}
          actionLabel="ARŞİVE GİT →"
        />
        <div className="post-list">
          {latest.map((p, i) => (
            <PostRow key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>

      <section className="wrap">
        <Reveal>
          <div className="cta">
            <div className="cta-kicker">{"// BİR SONRAKİ ADIM"}</div>
            <h2>
              Bir projen mi var? <span className="hl">Birlikte inşa edelim.</span>
            </h2>
            <p>Fikir aşamasından canlıya — web, mobil ve yapay zeka ürünleri için uçtan uca geliştirme desteği sunuyorum.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn solid" onClick={() => navigate("contact")}>
                ▶ PROJENİ ANLAT
              </button>
              <button className="btn" onClick={() => navigate("about")}>
                BENİ TANI
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Marquee() {
  const items = [...TECHS, ...TECHS];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={i} className="mq-item">
            {t}
            <i>◆</i>
          </span>
        ))}
      </div>
    </div>
  );
}

function PostRow({ p, i }) {
  return (
    <Reveal delay={i * 0.06}>
      <article className="post">
        <div className="mini" style={{ color: p.color, background: "linear-gradient(140deg, " + p.color + "22, transparent 65%)" }}>
          <b>{p.glyph}</b>
        </div>
        <div>
          <div className="meta">
            <span>{p.date}</span>
            <span>◷ {p.read}</span>
            {p.tags.map((t) => (
              <span key={t} style={{ color: p.color }}>
                #{t}
              </span>
            ))}
          </div>
          <h3>{p.title}</h3>
          <p>{p.excerpt}</p>
        </div>
        <span className="arrow">→</span>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  HAKKIMDA                                                           */
/* ------------------------------------------------------------------ */
function AboutPage({ navigate, about }) {
  const d = about || {};
  const skills = d.skills || SKILLS;
  const info = [
    ["İSİM", d.name || "Erkan Erdem"],
    ["KONUM", d.location || "Türkiye"],
    ["MESLEK", d.expertise || "Full-Stack Developer & Veteriner Hekim"],
    ["DENEYİM", d.experience || "17+ Yıl"],
    ["DURUM", d.status || "Projeye Açık ✓"],
  ];
  return (
    <>
      <PageHead crumb="hakkimda" title="HAKKIMDA" big="HAKKIMDA" sub="2005'te Excel formülleriyle başlayan yazılım tutkusu, bugün full-stack uygulamalarla devam ediyor." />
      <section className="wrap">
        <div className="about-grid">
          <Reveal>
            <div className="avatar-frame">
              <div className="avatar-scan" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.avatar || IMG.avatar} alt="Erkan Erdem" />
              <div className="avatar-tag">ERKAN ERDEM — İSTANBUL / TR</div>
            </div>
            <div className="info-list">
              {info.map(([k, v]) => (
                <div className="info-row" key={k}>
                  <span>{k}</span>
                  <b className={k === "DURUM" ? "ok" : ""}>{v}</b>
                </div>
              ))}
            </div>
          </Reveal>
          <div>
            <Reveal>
              <h3 className="about-lead">
                {d.lead || "Merhaba! Ben Erkan — 17+ yıldır yazılımın peşinde koşan bir veteriner hekim ve full-stack geliştiriciyim."}
              </h3>
            </Reveal>
            {d.bio1 && (
              <Reveal delay={0.1}>
                <p className="about-p">{d.bio1}</p>
              </Reveal>
            )}
            {d.bio2 && (
              <Reveal delay={0.15}>
                <p className="about-p">{d.bio2}</p>
              </Reveal>
            )}
            {d.bio3 && (
              <Reveal delay={0.2}>
                <p className="about-p">{d.bio3}</p>
              </Reveal>
            )}
            <Reveal delay={0.25}>
              <div className="about-cta">
                <button className="btn" onClick={() => navigate("contact")}>
                  BİRLİKTE ÇALIŞALIM
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="about-cards">
          <Reveal delay={0.05}>
            <div className="glass p-8 about-card">
              <h3 className="about-card-title" style={{ color: "var(--cyan)" }}>NEREDEN NEREYE</h3>
              <p>2005 yılında basit Excel formülleri ve VBA makroları ile başlayan yazılım merakım, bugün modern web teknolojileri ve yapay zeka ile profesyonel uygulamalar geliştirmeye evrildi. 17+ yıllık bu yolculukta her adım bir öncekinin üzerine inşa edildi.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass p-8 about-card">
              <h3 className="about-card-title" style={{ color: "var(--magenta)" }}>YAZILIM & YAPAY ZEKA</h3>
              <p>Full Stack Developer olarak modern web teknolojilerini kullanarak, yapay zeka ve makine öğrenmesi alanlarındaki gelişmeleri yakından takip ediyor ve projelerime entegre ediyorum.</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="glass p-8 about-card">
              <h3 className="about-card-title" style={{ color: "var(--acid)" }}>HOBİLER & TUTKULAR</h3>
              <p>Elektronik müzik prodüksiyonu ve astroloji, hayatıma farklı perspektifler katarken yaratıcılığımı besliyor. Bu hobiler, teknoloji ve meslek hayatımdaki yoğunluğu dengeliyor.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="glass p-8 about-card">
              <h3 className="about-card-title" style={{ color: "#ffbd2e" }}>YAKLAŞIMIM</h3>
              <p>Veteriner hekimlik eğitimimden gelen analitik düşünce yapısını, 2005 ten beri tutkuyla bağlı olduğum teknolojiyle birleştiriyorum. Her projede kullanıcıya saygı, temiz kod ve ölçülebilir sonuçlar peşindeyim.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="wrap">
        <Reveal>
          <div className="sec-kicker" style={{ marginTop: 10 }}>
            {"// YETKİNLİKLER"}
          </div>
        </Reveal>
        {skills.map((s, i) => (
          <SkillBar key={s.name} s={s} delay={i * 0.08} />
        ))}
      </section>
    </>
  );
}

function SkillBar({ s, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div className="skill" ref={ref}>
      <div className="top">
        <b>{s.name}</b>
        <span>{s.lvl}%</span>
      </div>
      <div className="bar">
        <i style={{ width: inView ? s.lvl + "%" : "0%", transitionDelay: delay + "s" }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PROJELER                                                           */
/* ------------------------------------------------------------------ */
function ProjectsPage({ projects: dbProjects }) {
  const [filter, setFilter] = useState("all");
  const allProjects = dbProjects && dbProjects.length ? dbProjects : PROJECTS;
  const cats = [
    { id: "all", label: "TÜMÜ" },
    { id: "web", label: "WEB" },
    { id: "mobil", label: "MOBİL" },
    { id: "ai", label: "YAPAY ZEKA" },
    { id: "opensource", label: "AÇIK KAYNAK" },
  ];
  const list = filter === "all" ? allProjects : allProjects.filter((p) => p.cat === filter);
  return (
    <>
      <PageHead crumb="projeler" title="PROJELER" big="PROJELER" sub="Fikir aşamasından canlıya alınan ürünler: web uygulamaları, mobil deneyimler, yapay zeka entegrasyonları ve açık kaynak işleri." />
      <section className="wrap">
        <div className="proj-stats">
          <div className="pstat"><b>{allProjects.filter(p => p.cat === "ai").length}</b><span>Aktif Proje</span></div>
          <div className="pstat"><b>{new Set(allProjects.flatMap(p => p.tags)).size}</b><span>Teknoloji</span></div>
          <div className="pstat"><b>{allProjects.length}</b><span>Yayınlanan Proje</span></div>
          <div className="pstat"><b>∞</b><span>Devam Eden</span></div>
        </div>
      </section>
      <section className="wrap">
        <div className="filters">
          {cats.map((c) => (
            <button key={c.id} className={"fbtn" + (filter === c.id ? " active" : "")} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <motion.div className="proj-grid" layout>
          <AnimatePresence>
            {list.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                className="grid-cell"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <ProjectCard p={p} inGrid />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  YAZILAR                                                            */
/* ------------------------------------------------------------------ */
function WritingsPage({ posts: dbPosts }) {
  const [tag, setTag] = useState("all");
  const allPosts = dbPosts && dbPosts.length ? dbPosts : POSTS;
  const allTags = ["all", ...Array.from(new Set(allPosts.flatMap((p) => p.tags)))];
  const featured = allPosts.find((p) => p.featured);
  const list = allPosts.filter((p) => !p.featured).filter((p) => tag === "all" || p.tags.includes(tag));
  return (
    <>
      <PageHead crumb="yazilar" title="YAZILAR" big="YAZILAR" sub="Web geliştirme, yapay zeka, performans ve tasarım üzerine derinlemesine teknik yazılar. Öğrendiklerimi paylaşmayı seviyorum." />
      <section className="wrap">
        <Reveal>
          {featured && (
          <article className="post-featured">
            <div className="post-cover">
              <span className="glyph">{featured.glyph}</span>
              <span className="feat-badge">★ ÖNE ÇIKAN</span>
            </div>
            <div className="pf-body">
              <div className="meta">
                <span>{featured.date}</span>
                <span>◷ {featured.read}</span>
                {featured.tags.map((t) => (
                  <span key={t} style={{ color: featured.color }}>
                    #{t}
                  </span>
                ))}
              </div>
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <button className="btn alt">DEVAMINI OKU →</button>
            </div>
          </article>
          )}
        </Reveal>

        <div className="filters">
          {allTags.map((t) => (
            <button key={t} className={"fbtn" + (tag === t ? " active" : "")} onClick={() => setTag(t)}>
              {t === "all" ? "TÜMÜ" : "#" + t}
            </button>
          ))}
        </div>

        <div className="post-list">
          <AnimatePresence>
            {list.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <PostRow p={p} i={0} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  İLETİŞİM                                                           */
/* ------------------------------------------------------------------ */
function ContactPage({ contactInfo }) {
  const ci = contactInfo || {};
  const socials = ci.socials || SOCIALS;
  const empty = { name: "", email: "", subject: "", message: "" };
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSent(true);
    setForm(empty);
    setTimeout(() => setSent(false), 5000);
  };
  return (
    <>
      <PageHead crumb="iletisim" title="İLETİŞİM" big="İLETİŞİM" sub="Projeler hakkında konuşmak, iş birliği yapmak veya sadece merhaba demek için — terminal her zaman açık." />
      <section className="wrap">
        <div className="contact-grid">
          <Reveal>
            <div className="term">
              <div className="term-head">
                <i style={{ background: "#ff5f56" }} />
                <i style={{ background: "#ffbd2e" }} />
                <i style={{ background: "#27c93f" }} />
                <span>iletisim@erkanerdem:~</span>
              </div>
              <div className="term-body">
                <div>
                  <span className="cmd">$</span> whoami
                </div>
                <div>
                  <span className="val">erkanerdem</span> — full-stack geliştirici
                </div>
                <div>
                  <span className="cmd">$</span> cat email.txt
                </div>
                <div>
                  <span className="val">{ci.email || "merhaba@erkanerdem.online"}</span>
                </div>
                <div>
                  <span className="cmd">$</span> cat konum.txt
                </div>
                <div>
                  <span className="val">{ci.location || "İstanbul / Türkiye (UTC+3)"}</span>
                </div>
                <div>
                  <span className="cmd">$</span> ./yanit_suresi.sh
                </div>
                <div>
                  <span className="ok">✓ ortalama yanıt: {ci.response_time || "< 24 saat"}</span>
                </div>
                <div>
                  <span className="cmd">$</span> <span className="caret2" />
                </div>
              </div>
            </div>
            <div className="socials">
              {socials.map((s) => (
                <a key={s.name} className="soc" href="#" onClick={(e) => e.preventDefault()}>
                  <span>{s.name}</span>
                  <span>{s.handle} ↗</span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="form" onSubmit={submit}>
              <div className="form-head">{"// MESAJ GÖNDER"}</div>
              <div className="field">
                <label>İSİM *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Adınız Soyadınız" />
              </div>
              <div className="field">
                <label>E-POSTA *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ornek@eposta.com" />
              </div>
              <div className="field">
                <label>KONU</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Proje teklifi / İş birliği / Merhaba" />
              </div>
              <div className="field">
                <label>MESAJ *</label>
                <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Projeni birkaç cümleyle anlat..." />
              </div>
              <button className="btn solid" type="submit">
                ▶ MESAJI İLET
              </button>
              <AnimatePresence>
                {sent && (
                  <motion.div className="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    ✓ MESAJ BAŞARIYLA İLETİLDİ — EN KISA SÜREDE DÖNÜŞ YAPACAĞIM
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  NAVBAR                                                             */
/* ------------------------------------------------------------------ */
function Navbar({ page, navigate, menuOpen, setMenuOpen, scrolled }) {
  return (
    <>
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <div className="nav-inner">
          <a className="logo" href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }}>
            <span className="prompt">&gt;</span>
            <b>erkanerdem</b>
            <span className="tld">.online</span>
            <span className="cursor" />
          </a>
          <ul className="nav-links">
            {NAV_ITEMS.map((it) => (
              <li key={it.id}>
                <button className={"nav-link" + (page === it.id ? " active" : "")} onClick={() => navigate(it.id)}>
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
          <button className={"burger" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mm-head">~/erkanerdem.online</div>
            {NAV_ITEMS.map((it, i) => (
              <motion.button
                key={it.id}
                className={"m-link" + (page === it.id ? " active" : "")}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.08 * i }}
                onClick={() => navigate(it.id)}
              >
                <span className="m-num">0{i + 1}</span>
                {it.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */
function Footer({ navigate }) {
  const [visitor, setVisitor] = useState({ ip: "...", city: "...", country: "..." });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const info = {
      user_agent: navigator.userAgent || "",
      platform: navigator.platform || "",
      language: navigator.language || "",
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      referrer: document.referrer || "",
      cores: navigator.hardwareConcurrency || 0,
      ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "",
      connection_type: "",
      page: window.location.pathname,
      browser: "",
      os: "",
      device_type: "",
    };
    // parse browser & os from UA
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) info.browser = "Firefox";
    else if (ua.includes("Edg")) info.browser = "Edge";
    else if (ua.includes("Chrome")) info.browser = "Chrome";
    else if (ua.includes("Safari")) info.browser = "Safari";
    else info.browser = "Other";
    if (ua.includes("Windows")) info.os = "Windows";
    else if (ua.includes("Mac")) info.os = "macOS";
    else if (ua.includes("Linux")) info.os = "Linux";
    else if (ua.includes("Android")) info.os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) info.os = "iOS";
    else info.os = "Other";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) info.device_type = "Tablet";
    else if (/Mobile|Android|iPhone|iPod/i.test(ua)) info.device_type = "Mobil";
    else info.device_type = "Masaüstü";

    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => {
        const v = {
          ip: d.ip || "...",
          city: d.city || "...",
          country: d.country_name || "...",
        };
        setVisitor(v);
        fetch("/api/visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...v, ...info, isp: d.org || "" }),
        }).catch(() => {});
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a className="logo" href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }}>
              <span className="prompt">&gt;</span>
              <b>erkanerdem</b>
              <span className="tld">.online</span>
            </a>
            <p className="foot-desc">Veteriner hekimlik ve yazılım geliştirmeyi birleştirerek yenilikçi dijital çözümler üretiyorum. İki dünya, tek çatı.</p>
            <div className="status">
              <i /> SİSTEM DURUMU: ÇEVRİMİÇİ
            </div>
          </div>
          <div>
            <div className="fv-header">
              <span className="fv-caret"/>
              {phase === 0 && <span className="fv-typing">_</span>}
              {phase === 1 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>Kimlik analiz ediliyor<span className="fv-dots"><motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}>.</motion.span><motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}>.</motion.span><motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}>.</motion.span></span></motion.span>}
              {phase === 2 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>Lokasyon belirleniyor<span className="fv-dots"><motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}>.</motion.span><motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}>.</motion.span><motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}>.</motion.span></span></motion.span>}
              {phase === 3 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ color: "var(--acid)" }}>✓ TANIMLANDI</motion.span>}
            </div>
            <motion.div
              className="foot-visitor"
              initial={{ opacity: 0, y: 10 }}
              animate={phase === 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="fv-row"><span>IPv4</span><b>{visitor.ip}</b></div>
              <div className="fv-row"><span>LOKASYON</span><b>{visitor.city}, {visitor.country}</b></div>
            </motion.div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ERKANERDEM.ONLINE — TÜM HAKLARI SAKLIDIR.</span>
          <span>NEXT.JS İLE İNŞA EDİLDİ ▪ v5.0.0</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  CSS                                                                */
/* ------------------------------------------------------------------ */
const CSS = `
:root{
  --bg0:#04060f; --bg1:#070b18; --panel:#0a0f22; --panel2:#0d1330;
  --cyan:#00f0ff; --magenta:#ff2bd6; --purple:#7a5cff; --acid:#c8ff3e;
  --ink:#e9edff; --muted:#8b94bb; --line:rgba(0,240,255,.16);
  --font-d:'Orbitron',sans-serif; --font-b:'Rajdhani',sans-serif; --font-m:'Share Tech Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg0);color:var(--ink);font-family:var(--font-b);overflow-x:hidden;-webkit-font-smoothing:antialiased}
::selection{background:var(--magenta);color:#0b0212}
::-webkit-scrollbar{width:10px}
::-webkit-scrollbar-track{background:var(--bg0)}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--cyan),var(--magenta))}

.bg-grid{position:fixed;inset:0;z-index:0;pointer-events:none;
 background-image:linear-gradient(rgba(0,240,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,.05) 1px,transparent 1px);
 background-size:44px 44px;
 -webkit-mask-image:radial-gradient(ellipse 90% 70% at 50% 20%,#000 30%,transparent 78%);
 mask-image:radial-gradient(ellipse 90% 70% at 50% 20%,#000 30%,transparent 78%);}
.bg-glow{position:fixed;inset:0;z-index:0;pointer-events:none;
 background:radial-gradient(600px 400px at 12% 8%, rgba(0,240,255,.10), transparent 60%),
  radial-gradient(700px 500px at 88% 20%, rgba(255,43,214,.09), transparent 60%),
  radial-gradient(800px 600px at 50% 100%, rgba(122,92,255,.08), transparent 60%);}
.scanlines{position:fixed;inset:0;z-index:60;pointer-events:none;opacity:.5;
 background:repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 3px);}
.scanbar{position:fixed;left:0;right:0;height:120px;z-index:61;pointer-events:none;
 background:linear-gradient(180deg,transparent,rgba(0,240,255,.05),transparent);
 animation:scanmove 7s linear infinite;}
@keyframes scanmove{0%{top:-140px}100%{top:110vh}}
.noise{position:fixed;inset:0;z-index:62;pointer-events:none;opacity:.04;
 background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");}
.cursor-glow{position:fixed;top:0;left:0;width:520px;height:520px;z-index:1;pointer-events:none;border-radius:50%;
 background:radial-gradient(circle, rgba(0,240,255,.07), rgba(255,43,214,.04) 45%, transparent 70%);
 mix-blend-mode:screen;will-change:transform;}
.progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:100;background:linear-gradient(90deg,var(--cyan),var(--magenta));transform-origin:0 50%;box-shadow:0 0 12px rgba(0,240,255,.6)}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:90;transition:.3s;padding:0 clamp(16px,4vw,48px);}
.nav-inner{max-width:1280px;margin:0 auto;height:72px;display:flex;align-items:center;justify-content:space-between;transition:.3s}
.nav.scrolled{background:rgba(5,8,18,.82);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.logo{font-family:var(--font-m);font-size:1.05rem;text-decoration:none;color:var(--ink);display:flex;align-items:center;letter-spacing:.5px;cursor:pointer}
.logo .prompt{color:var(--magenta);margin-right:6px}
.logo b{font-weight:400;color:#fff}
.logo .tld{color:var(--cyan);transition:.25s}
.logo:hover .tld{text-shadow:0 0 12px var(--cyan)}
.logo .cursor{display:inline-block;width:9px;height:1.1em;background:var(--cyan);margin-left:3px;animation:blink 1s steps(1) infinite;vertical-align:text-bottom}
@keyframes blink{50%{opacity:0}}
.nav-links{display:flex;gap:4px;list-style:none}
.nav-link{position:relative;background:none;border:none;color:var(--muted);font-family:var(--font-d);font-size:.72rem;letter-spacing:2.5px;padding:10px 14px;cursor:pointer;transition:.25s;text-transform:uppercase}
.nav-link:hover{color:var(--cyan);text-shadow:0 0 12px rgba(0,240,255,.7)}
.nav-link.active{color:var(--cyan);text-shadow:0 0 10px rgba(0,240,255,.6)}
.nav-link.active::before{content:'[';color:var(--magenta);margin-right:6px}
.nav-link.active::after{content:']';color:var(--magenta);margin-left:6px}
.burger{display:none;flex-direction:column;gap:5px;background:none;border:1px solid var(--line);padding:10px;cursor:pointer;z-index:95}
.burger span{width:22px;height:2px;background:var(--cyan);transition:.3s;box-shadow:0 0 6px var(--cyan)}
.burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.burger.open span:nth-child(2){opacity:0}
.burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
@media(max-width:900px){.nav-links{display:none}.burger{display:flex}}
.mobile-menu{position:fixed;inset:0;z-index:89;background:rgba(4,6,15,.97);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);display:flex;flex-direction:column;justify-content:center;padding:0 10vw;gap:6px}
.mm-head{font-family:var(--font-m);color:var(--muted);font-size:.8rem;letter-spacing:2px;margin-bottom:18px}
.m-link{background:none;border:none;border-bottom:1px solid var(--line);text-align:left;color:var(--ink);font-family:var(--font-d);font-size:1.5rem;letter-spacing:4px;padding:18px 4px;cursor:pointer;display:flex;align-items:center;gap:20px;text-transform:uppercase}
.m-link .m-num{font-family:var(--font-m);font-size:.8rem;color:var(--magenta)}
.m-link.active{color:var(--cyan);text-shadow:0 0 16px rgba(0,240,255,.5)}

/* LAYOUT */
.page{position:relative;z-index:2;min-height:100vh;padding-top:72px}
.wrap{max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,48px)}
section{padding:clamp(48px,7vw,96px) 0}

/* SECTION HEAD */
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:44px;flex-wrap:wrap}
.sec-kicker{font-family:var(--font-m);color:var(--magenta);font-size:.85rem;letter-spacing:3px;display:flex;align-items:center;gap:12px;margin-bottom:14px}
.sec-kicker::after{content:'';height:1px;width:80px;background:linear-gradient(90deg,var(--magenta),transparent)}
.sec-title{font-family:var(--font-d);font-size:clamp(1.9rem,4.5vw,3rem);font-weight:900;letter-spacing:2px;text-transform:uppercase;line-height:1.1}
.sec-title .hl{color:var(--cyan);text-shadow:0 0 18px rgba(0,240,255,.55)}
.link-more{font-family:var(--font-m);letter-spacing:2px;font-size:.78rem;color:var(--magenta);background:none;border:none;border-bottom:1px solid transparent;cursor:pointer;padding:6px 0;transition:.25s}
.link-more:hover{color:var(--cyan);border-bottom-color:var(--cyan);text-shadow:0 0 10px rgba(0,240,255,.5)}

/* GLITCH */
.glitch{position:relative;display:inline-block}
.glitch::before,.glitch::after{content:attr(data-text);position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;pointer-events:none}
.glitch:hover::before{opacity:.85;color:var(--magenta);animation:gA .45s steps(2) infinite;clip-path:inset(0 0 55% 0)}
.glitch:hover::after{opacity:.85;color:var(--cyan);animation:gB .45s steps(2) infinite;clip-path:inset(55% 0 0 0)}
@keyframes gA{0%{transform:translate(-3px,-2px)}50%{transform:translate(3px,1px)}100%{transform:translate(-2px,2px)}}
@keyframes gB{0%{transform:translate(3px,2px)}50%{transform:translate(-3px,-1px)}100%{transform:translate(2px,-2px)}}

/* PAGE HEAD */
.page-head{padding:clamp(48px,7vw,84px) 0 clamp(28px,4vw,44px);border-bottom:1px solid var(--line);position:relative;overflow:hidden}
.page-head .crumb{font-family:var(--font-m);color:var(--muted);font-size:.8rem;letter-spacing:2px;margin-bottom:14px}
.page-head .crumb b{color:var(--magenta);font-weight:400}
.page-head h1{font-family:var(--font-d);font-weight:900;font-size:clamp(2.2rem,6vw,3.6rem);letter-spacing:3px;text-transform:uppercase}
.page-head .sub{color:var(--muted);margin-top:14px;font-size:1.05rem;max-width:640px;line-height:1.7;font-weight:500}
.page-head .big-bg{position:absolute;right:-2%;top:50%;transform:translateY(-50%);font-family:var(--font-d);font-weight:900;font-size:clamp(5rem,16vw,11rem);color:transparent;-webkit-text-stroke:1px rgba(0,240,255,.12);pointer-events:none;user-select:none;white-space:nowrap}

/* HERO */
.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center;min-height:calc(100vh - 72px);padding:40px 0 60px}
@media(max-width:980px){.hero{grid-template-columns:1fr;min-height:auto}}
.hero-term{font-family:var(--font-m);color:var(--acid);font-size:.85rem;letter-spacing:1px;margin-bottom:18px;display:flex;gap:10px;align-items:center}
.dot-live{width:8px;height:8px;background:var(--acid);border-radius:50%;box-shadow:0 0 10px var(--acid);animation:pulse 1.6s infinite}
@keyframes pulse{50%{opacity:.35}}
.hero-name{font-family:var(--font-d);font-weight:900;font-size:clamp(2.6rem,7vw,4.6rem);line-height:1.02;letter-spacing:2px;text-transform:uppercase}
.hero-name .l1{display:block;color:#fff}
.hero-name .l2{display:block;color:transparent;-webkit-text-stroke:1.5px var(--cyan);text-shadow:0 0 30px rgba(0,240,255,.35)}
.hero-role{font-family:var(--font-m);font-size:clamp(1rem,2.2vw,1.3rem);color:var(--muted);margin:22px 0 18px;min-height:1.6em}
.hero-role .typed{color:var(--magenta);text-shadow:0 0 14px rgba(255,43,214,.6)}
.hero-role .caret{display:inline-block;width:10px;height:1.15em;background:var(--magenta);vertical-align:text-bottom;animation:blink 1s steps(1) infinite;margin-left:2px}
.hero-desc{color:var(--muted);font-size:1.08rem;line-height:1.7;max-width:520px;font-weight:500}
.hero-cta{display:flex;gap:16px;margin-top:34px;flex-wrap:wrap}

/* BUTTONS */
.btn{position:relative;display:inline-flex;align-items:center;gap:10px;font-family:var(--font-d);font-size:.78rem;letter-spacing:2.5px;text-transform:uppercase;padding:15px 28px;cursor:pointer;text-decoration:none;transition:.25s;border:1px solid var(--cyan);background:transparent;color:var(--cyan);clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
.btn:hover{background:var(--cyan);color:#031018;box-shadow:0 0 28px rgba(0,240,255,.55)}
.btn.alt{border-color:var(--magenta);color:var(--magenta)}
.btn.alt:hover{background:var(--magenta);color:#1a0313;box-shadow:0 0 28px rgba(255,43,214,.5)}
.btn.solid{background:var(--cyan);color:#031018}
.btn.solid:hover{box-shadow:0 0 34px rgba(0,240,255,.7);transform:translateY(-2px)}

/* HUD */
.hud{position:relative;border:1px solid var(--line);background:linear-gradient(160deg, rgba(10,15,34,.7), rgba(6,9,20,.9));clip-path:polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);height:460px}
@media(max-width:980px){.hud{height:380px}}
.hud canvas{display:block}
.hud-corner{position:absolute;width:22px;height:22px;border:2px solid var(--cyan);z-index:3}
.hud-corner.tl{top:8px;left:8px;border-right:0;border-bottom:0}
.hud-corner.tr{top:8px;right:8px;border-left:0;border-bottom:0}
.hud-corner.bl{bottom:8px;left:8px;border-right:0;border-top:0}
.hud-corner.br{bottom:8px;right:8px;border-left:0;border-top:0}
.hud-top{position:absolute;top:12px;left:44px;right:44px;display:flex;justify-content:space-between;font-family:var(--font-m);font-size:.7rem;letter-spacing:2px;color:var(--cyan);z-index:3}
.hud-bottom{position:absolute;bottom:12px;left:44px;right:44px;display:flex;justify-content:space-between;font-family:var(--font-m);font-size:.7rem;color:var(--muted);z-index:3}
.hud-scan{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2}
.hud-scan::before{content:'';position:absolute;left:0;right:0;height:70px;background:linear-gradient(180deg,transparent,rgba(0,240,255,.08),transparent);animation:hudscan 4.5s linear infinite}
@keyframes hudscan{0%{top:-80px}100%{top:100%}}

/* MARQUEE */
.marquee{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(8,12,26,.6);overflow:hidden;padding:16px 0}
.marquee-track{display:flex;gap:48px;width:max-content;animation:mq 28s linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}
.mq-item{font-family:var(--font-d);font-size:.85rem;letter-spacing:3px;color:var(--muted);display:flex;align-items:center;gap:48px;white-space:nowrap}
.mq-item i{color:var(--magenta);font-style:normal}
@keyframes mq{to{transform:translateX(-50%)}}

/* STATS BAND */
.stats-band{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line);background:rgba(8,12,26,.6)}
@media(max-width:800px){.stats-band{grid-template-columns:repeat(2,1fr)}}
.stat{padding:30px 20px;text-align:center;border-right:1px solid var(--line);position:relative}
.stat:last-child{border-right:0}
@media(max-width:800px){.stat:nth-child(2){border-right:0}.stat:nth-child(-n+2){border-bottom:1px solid var(--line)}}
.stat b{font-family:var(--font-d);font-size:clamp(1.8rem,4vw,2.6rem);color:var(--cyan);text-shadow:0 0 16px rgba(0,240,255,.5);display:block}
.stat span{font-family:var(--font-m);font-size:.7rem;letter-spacing:2.5px;color:var(--muted)}

/* CARDS */
.grid-cell{height:100%;display:flex;flex-direction:column}
.grid-cell .pcard{flex:1}
.card{position:relative;background:linear-gradient(165deg,var(--panel),#070b1a);border:1px solid var(--line);clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px);transition:.3s;overflow:hidden}
.card:hover{transform:translateY(-6px);border-color:rgba(0,240,255,.5);filter:drop-shadow(0 18px 40px rgba(0,0,0,.5)) drop-shadow(0 0 18px rgba(0,240,255,.15))}
.pcard{display:flex;flex-direction:column}
.pcard .thumb{position:relative;aspect-ratio:16/10;overflow:hidden;border-bottom:1px solid var(--line)}
.pcard .thumb img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease, filter .6s;filter:saturate(.9)}
.pcard:hover .thumb img{transform:scale(1.07);filter:saturate(1.25)}
.pcard .thumb::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(4,6,15,.85))}
.pcard .scanfx{position:absolute;inset:0;opacity:0;transition:.3s;background:repeating-linear-gradient(0deg,rgba(0,240,255,.06) 0 2px,transparent 2px 6px);z-index:2}
.pcard:hover .scanfx{opacity:1}
.pcard .num{position:absolute;top:12px;left:14px;font-family:var(--font-m);color:var(--cyan);font-size:.8rem;letter-spacing:2px;z-index:3;text-shadow:0 0 8px rgba(0,240,255,.8)}
.pcard .cat{position:absolute;top:12px;right:14px;z-index:3;font-family:var(--font-m);font-size:.68rem;letter-spacing:2px;color:#031018;background:var(--cyan);padding:3px 10px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
.pcard .body{padding:22px 22px 24px;display:flex;flex-direction:column;flex:1}
.pcard h3{font-family:var(--font-d);font-size:1.05rem;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;transition:.25s}
.pcard:hover h3{color:var(--cyan);text-shadow:0 0 12px rgba(0,240,255,.5)}
.pcard p{color:var(--muted);font-size:.98rem;line-height:1.6;font-weight:500}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.tag{font-family:var(--font-m);font-size:.68rem;letter-spacing:1.5px;color:var(--cyan);border:1px solid rgba(0,240,255,.3);padding:4px 10px;background:rgba(0,240,255,.05)}
.pcard .links{display:flex;gap:18px;margin-top:auto;padding-top:16px;border-top:1px dashed rgba(139,148,187,.25);align-items:center}
.plink{font-family:var(--font-m);font-size:.75rem;letter-spacing:2px;color:var(--muted);text-decoration:none;transition:.25s;cursor:pointer;background:none;border:none}
.plink:hover{color:var(--magenta);text-shadow:0 0 10px rgba(255,43,214,.6)}
.pyear{margin-left:auto;font-family:var(--font-m);font-size:.75rem;color:var(--muted);letter-spacing:2px}

/* FEATURED GRID */
.feat-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:26px}
.feat-grid .grid-cell:first-child{grid-row:span 2}
.feat-grid .grid-cell:first-child .pcard .thumb{aspect-ratio:auto;flex:1;min-height:300px}
@media(max-width:900px){.feat-grid{grid-template-columns:1fr}.feat-grid .grid-cell:first-child{grid-row:auto}.feat-grid .grid-cell:first-child .pcard .thumb{aspect-ratio:16/10;min-height:0}}

/* PROJ GRID */
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:26px}

/* PROJ STATS */
.proj-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:10px}
@media(max-width:700px){.proj-stats{grid-template-columns:repeat(2,1fr)}}
.pstat{text-align:center;padding:24px 16px;border:1px solid var(--line);background:rgba(8,12,26,.5)}
.pstat b{display:block;font-family:var(--font-d);font-size:2.4rem;color:var(--cyan);text-shadow:0 0 18px rgba(0,240,255,.5)}
.pstat:nth-child(2) b{color:var(--magenta);text-shadow:0 0 18px rgba(255,43,214,.5)}
.pstat:nth-child(3) b{color:var(--acid);text-shadow:0 0 18px rgba(200,255,62,.5)}
.pstat:nth-child(4) b{color:#ffbd2e;text-shadow:0 0 18px rgba(255,189,46,.5)}
.pstat span{font-family:var(--font-m);font-size:.72rem;color:var(--muted);letter-spacing:2px}

/* FILTERS */
.filters{display:flex;gap:10px;flex-wrap:wrap;margin:34px 0 40px}
.fbtn{font-family:var(--font-m);font-size:.75rem;letter-spacing:2px;padding:9px 18px;background:transparent;border:1px solid rgba(139,148,187,.35);color:var(--muted);cursor:pointer;transition:.25s;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.fbtn:hover{border-color:var(--cyan);color:var(--cyan)}
.fbtn.active{background:rgba(0,240,255,.12);border-color:var(--cyan);color:var(--cyan);box-shadow:0 0 16px rgba(0,240,255,.25) inset}

/* POSTS */
.post-list{display:flex;flex-direction:column;gap:16px}
.post{display:grid;grid-template-columns:150px 1fr auto;gap:24px;align-items:center;padding:22px;border:1px solid var(--line);background:rgba(10,15,34,.55);transition:.3s;clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px);cursor:pointer}
.post:hover{border-color:rgba(255,43,214,.5);transform:translateX(6px);background:rgba(13,19,48,.8)}
.post .mini{height:96px;position:relative;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);overflow:hidden}
.post .mini::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg, rgba(255,255,255,.02) 0 2px, transparent 2px 12px)}
.post .mini b{font-family:var(--font-d);font-weight:900;font-size:2rem;color:transparent;-webkit-text-stroke:1.5px currentColor;position:relative;z-index:2}
.post h3{font-family:var(--font-d);font-size:1.02rem;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;transition:.25s}
.post:hover h3{color:var(--cyan);text-shadow:0 0 10px rgba(0,240,255,.4)}
.post p{color:var(--muted);font-weight:500;line-height:1.55;font-size:.95rem}
.meta{font-family:var(--font-m);font-size:.72rem;letter-spacing:2px;color:var(--muted);display:flex;gap:16px;flex-wrap:wrap;margin-bottom:8px}
.post .arrow{font-size:1.5rem;color:var(--muted);transition:.3s}
.post:hover .arrow{color:var(--cyan);transform:translateX(6px);text-shadow:0 0 12px var(--cyan)}
@media(max-width:760px){.post{grid-template-columns:1fr}.post .mini{height:120px}.post .arrow{display:none}}

/* FEATURED POST */
.post-featured{display:grid;grid-template-columns:1.1fr .9fr;border:1px solid var(--line);background:linear-gradient(165deg,var(--panel),#070b1a);clip-path:polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);overflow:hidden;margin-bottom:34px}
.post-cover{position:relative;min-height:280px;overflow:hidden;display:flex;align-items:center;justify-content:center;border-right:1px solid var(--line)}
.post-cover::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 30%, rgba(0,240,255,.18), transparent 55%),radial-gradient(circle at 75% 70%, rgba(255,43,214,.18), transparent 55%),repeating-linear-gradient(45deg, rgba(255,255,255,.02) 0 2px, transparent 2px 14px)}
.post-cover .glyph{font-family:var(--font-d);font-weight:900;font-size:7rem;color:transparent;-webkit-text-stroke:2px rgba(0,240,255,.5);position:relative;z-index:2;text-shadow:0 0 40px rgba(0,240,255,.25)}
.feat-badge{position:absolute;top:16px;left:16px;z-index:3;font-family:var(--font-m);font-size:.68rem;letter-spacing:2px;color:var(--acid);border:1px solid rgba(200,255,62,.4);padding:4px 10px;background:rgba(4,6,15,.7)}
.pf-body{padding:clamp(26px,4vw,44px);display:flex;flex-direction:column;justify-content:center;gap:14px}
.pf-body h3{font-family:var(--font-d);font-size:clamp(1.15rem,2.4vw,1.5rem);letter-spacing:1px;text-transform:uppercase;line-height:1.35}
.pf-body p{color:var(--muted);line-height:1.7;font-weight:500}
.pf-body .btn{align-self:flex-start;margin-top:8px}
@media(max-width:860px){.post-featured{grid-template-columns:1fr}.post-cover{border-right:0;border-bottom:1px solid var(--line)}}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:56px;align-items:start}
@media(max-width:900px){.about-grid{grid-template-columns:1fr}}
.avatar-frame{position:relative;border:1px solid var(--line);padding:14px;background:rgba(8,12,26,.6);clip-path:polygon(20px 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%,0 20px)}
.avatar-frame img{width:100%;display:block;filter:saturate(1.05)}
.avatar-frame::after{content:'';position:absolute;inset:14px;background:linear-gradient(180deg,transparent 60%,rgba(4,6,15,.55));pointer-events:none}
.avatar-scan{position:absolute;left:14px;right:14px;height:3px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);box-shadow:0 0 18px var(--cyan);animation:avscan 3.6s ease-in-out infinite;z-index:2}
@keyframes avscan{0%,100%{top:6%}50%{top:92%}}
.avatar-tag{position:absolute;bottom:24px;left:24px;z-index:3;font-family:var(--font-m);font-size:.7rem;letter-spacing:2px;color:var(--cyan);background:rgba(4,6,15,.8);border:1px solid rgba(0,240,255,.35);padding:6px 12px}
.info-list{margin-top:26px;border-top:1px solid var(--line)}
.info-row{display:flex;justify-content:space-between;padding:12px 2px;border-bottom:1px solid rgba(139,148,187,.14);font-size:.95rem}
.info-row span{font-family:var(--font-m);color:var(--muted);font-size:.78rem;letter-spacing:2px}
.info-row b{font-weight:600;color:var(--ink)}
.info-row b.ok{color:var(--acid)}
.about-lead{font-family:var(--font-b);font-weight:600;font-size:1.5rem;line-height:1.45;margin-bottom:20px}
.about-lead span{color:var(--cyan);text-shadow:0 0 12px rgba(0,240,255,.5)}
.about-p{color:var(--muted);line-height:1.8;font-weight:500;margin-bottom:16px;font-size:1.02rem}
.about-cta{display:flex;gap:14px;margin-top:26px;flex-wrap:wrap}
.about-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:10px}
@media(max-width:700px){.about-cards{grid-template-columns:1fr}}
.about-card{padding:24px;border:1px solid var(--line);background:rgba(8,12,26,.55)}
.about-card p{color:var(--muted);line-height:1.7;font-size:.92rem}
.about-card-title{font-family:var(--font-d);font-size:1.1rem;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px}
.skill{margin-bottom:20px}
.skill .top{display:flex;justify-content:space-between;font-family:var(--font-m);font-size:.8rem;letter-spacing:2px;margin-bottom:8px}
.skill .top b{color:var(--ink);font-weight:400}
.skill .top span{color:var(--cyan)}
.bar{height:6px;background:rgba(139,148,187,.15);position:relative;overflow:hidden}
.bar i{position:absolute;inset:0;right:auto;background:linear-gradient(90deg,var(--cyan),var(--magenta));box-shadow:0 0 12px rgba(0,240,255,.6);width:0;transition:width 1.4s cubic-bezier(.22,1,.36,1)}
.timeline{position:relative;margin-top:10px;padding-left:26px}
.timeline::before{content:'';position:absolute;left:6px;top:4px;bottom:4px;width:1px;background:linear-gradient(var(--cyan),var(--magenta),transparent)}
.titem{position:relative;padding:0 0 30px 18px}
.titem::before{content:'';position:absolute;left:-24px;top:6px;width:11px;height:11px;background:var(--bg0);border:2px solid var(--cyan);box-shadow:0 0 12px rgba(0,240,255,.7);transform:rotate(45deg)}
.titem .year{font-family:var(--font-m);color:var(--magenta);font-size:.78rem;letter-spacing:2px}
.titem h4{font-family:var(--font-d);font-size:1rem;letter-spacing:1px;margin:6px 0;text-transform:uppercase}
.titem p{color:var(--muted);line-height:1.6;font-weight:500}

/* CONTACT */
.contact-grid{display:grid;grid-template-columns:.95fr 1.05fr;gap:56px}
@media(max-width:900px){.contact-grid{grid-template-columns:1fr}}
.term{border:1px solid var(--line);background:#05081a;font-family:var(--font-m);clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)}
.term-head{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--line);color:var(--muted);font-size:.75rem;letter-spacing:2px}
.term-head i{width:10px;height:10px;border-radius:50%;display:inline-block}
.term-body{padding:22px;font-size:.85rem;line-height:2;color:var(--muted)}
.term-body .cmd{color:var(--acid)}
.term-body .val{color:var(--cyan)}
.term-body .ok{color:var(--acid)}
.caret2{display:inline-block;width:9px;height:1em;background:var(--acid);animation:blink 1s steps(1) infinite;vertical-align:middle}
.socials{display:flex;flex-direction:column;gap:12px;margin-top:26px}
.soc{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border:1px solid var(--line);color:var(--ink);text-decoration:none;font-family:var(--font-m);font-size:.8rem;letter-spacing:2px;transition:.25s;background:rgba(10,15,34,.5)}
.soc:hover{border-color:var(--cyan);color:var(--cyan);transform:translateX(6px);box-shadow:0 0 20px rgba(0,240,255,.15)}
.form{display:flex;flex-direction:column;gap:20px}
.form-head{font-family:var(--font-m);color:var(--magenta);letter-spacing:3px;font-size:.85rem}
.field{position:relative}
.field label{display:block;font-family:var(--font-m);font-size:.72rem;letter-spacing:2.5px;color:var(--muted);margin-bottom:8px}
.field input,.field textarea{width:100%;background:rgba(8,12,26,.7);border:1px solid rgba(139,148,187,.3);color:var(--ink);font-family:var(--font-b);font-size:1rem;font-weight:500;padding:14px 16px;transition:.25s;outline:none;resize:vertical}
.field input:focus,.field textarea:focus{border-color:var(--cyan);box-shadow:0 0 0 1px var(--cyan),0 0 20px rgba(0,240,255,.2);background:rgba(8,14,32,.9)}
.field input::placeholder,.field textarea::placeholder{color:rgba(139,148,187,.5)}
.sent{border:1px solid var(--acid);background:rgba(200,255,62,.06);padding:22px;text-align:center;font-family:var(--font-m);color:var(--acid);letter-spacing:2px;font-size:.82rem}

/* CTA */
.cta{position:relative;border:1px solid var(--line);padding:clamp(36px,6vw,64px);text-align:center;background:radial-gradient(600px 200px at 50% 0%, rgba(0,240,255,.08), transparent),linear-gradient(165deg,var(--panel),#070b1a);clip-path:polygon(22px 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%,0 22px);overflow:hidden}
.cta-kicker{font-family:var(--font-m);color:var(--magenta);letter-spacing:3px;font-size:.8rem;margin-bottom:14px}
.cta h2{font-family:var(--font-d);font-size:clamp(1.6rem,4vw,2.4rem);letter-spacing:2px;text-transform:uppercase;margin-bottom:14px}
.cta h2 .hl{color:var(--cyan);text-shadow:0 0 18px rgba(0,240,255,.5)}
.cta p{color:var(--muted);margin-bottom:28px;font-weight:500;max-width:560px;margin-left:auto;margin-right:auto}

/* FOOTER */
.footer{border-top:1px solid var(--line);background:rgba(5,8,18,.85);position:relative;z-index:2;margin-top:40px}
.footer-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:40px;padding:56px 0 40px}
@media(max-width:800px){.footer-grid{grid-template-columns:1fr}}
.footer h5{font-family:var(--font-d);font-size:.8rem;letter-spacing:3px;color:var(--cyan);margin-bottom:18px;text-transform:uppercase}
.foot-desc{color:var(--muted);line-height:1.7;font-weight:500;margin:18px 0 22px;max-width:380px}
.status{display:flex;align-items:center;gap:8px;font-family:var(--font-m);font-size:.72rem;letter-spacing:2px;color:var(--acid)}
.status i{width:8px;height:8px;border-radius:50%;background:var(--acid);box-shadow:0 0 10px var(--acid);animation:pulse 1.6s infinite}
.foot-visitor{display:flex;flex-direction:column;gap:8px}
.fv-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(139,148,187,.08)}
.fv-row span{font-family:var(--font-m);font-size:.68rem;letter-spacing:2px;color:var(--muted)}
.fv-row b{font-family:var(--font-m);font-size:.82rem;color:var(--cyan);text-shadow:0 0 8px rgba(0,240,255,.3);font-weight:400}
.fv-header{font-family:var(--font-m);font-size:.82rem;letter-spacing:2px;color:var(--magenta);margin-bottom:14px;display:flex;align-items:center;gap:8px;min-height:24px}
.fv-caret{display:inline-block;width:10px;height:1em;background:var(--magenta);animation:blink 1s steps(1) infinite;margin-right:4px}
.fv-typing{color:var(--cyan);animation:blink 0.8s steps(1) infinite}
.fv-dots{color:var(--cyan)}
.footer-bottom{border-top:1px solid rgba(139,148,187,.15);padding:18px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-family:var(--font-m);font-size:.72rem;letter-spacing:2px;color:var(--muted)}
`;

/* ------------------------------------------------------------------ */
/*  APP                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [about, setAbout] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const glowRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    fetch("/api/projects").then((r) => r.ok ? r.json() : []).then((d) => setProjects(d.map((p) => ({ ...p, id: String(p.id).padStart(2, "0"), cat: p.category, catLabel: p.category_label, img: p.image, desc: p.description, tags: JSON.parse(p.tags || "[]"), featured: !!p.featured })))).catch(() => {});
    fetch("/api/posts").then((r) => r.ok ? r.json() : []).then((d) => setPosts(d.map((p) => ({ ...p, read: p.read_time, tags: JSON.parse(p.tags || "[]"), featured: !!p.featured })))).catch(() => {});
    fetch("/api/about").then((r) => r.ok ? r.json() : null).then((d) => d && setAbout({ ...d, skills: JSON.parse(d.skills || "[]"), timeline: JSON.parse(d.timeline || "[]") })).catch(() => {});
    fetch("/api/contact-info").then((r) => r.ok ? r.json() : null).then((d) => d && setContactInfo({ ...d, socials: JSON.parse(d.socials || "[]") })).catch(() => {});
  }, []);

  const navigate = (p) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    let raf;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = "translate(" + (e.clientX - 260) + "px, " + (e.clientY - 260) + "px)";
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <div className="app-root">
      <style>{CSS}</style>
      <div className="bg-grid" />
      <div className="bg-glow" />
      <div ref={glowRef} className="cursor-glow" />
      <div className="scanlines" />
      <div className="scanbar" />
      <div className="noise" />
      <motion.div className="progress" style={{ scaleX: progress }} />

      <Navbar page={page} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} />

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          className="page"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {page === "home" && <HomePage navigate={navigate} projects={projects} posts={posts} />}
          {page === "about" && <AboutPage navigate={navigate} about={about} />}
          {page === "projects" && <ProjectsPage projects={projects} />}
          {page === "writings" && <WritingsPage posts={posts} />}
          {page === "contact" && <ContactPage contactInfo={contactInfo} />}
        </motion.main>
      </AnimatePresence>

      <Footer navigate={navigate} />
    </div>
  );
}
