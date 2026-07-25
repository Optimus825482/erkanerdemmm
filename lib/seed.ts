import { getDb } from "./db";

export function seedDatabase() {
  const db = getDb();

  // Check if already seeded
  const count = db.prepare("SELECT COUNT(*) as c FROM projects").get() as {
    c: number;
  };
  if (count.c > 0) return;

  // ── Projects ──
  const insertProject = db.prepare(
    "INSERT INTO projects (title, category, category_label, image, description, tags, year, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );

  const projects = [
    {
      title: "NöroDash",
      cat: "ai",
      catLabel: "YAPAY ZEKA",
      img: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/151bd4f8d-07dc-4dd1-8971-8d5b8d0a7c14.png",
      desc: "Gerçek zamanlı veri akışını yapay zeka ile yorumlayan, anomalileri saniyeler içinde tespit eden analitik platformu.",
      tags: ["Next.js", "TensorFlow", "WebSocket", "D3.js"],
      year: "2026",
      featured: 1,
      order: 1,
    },
    {
      title: "SynthChat",
      cat: "ai",
      catLabel: "YAPAY ZEKA",
      img: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/189845bfd-5934-43b8-a43e-8fd53297fbf1.png",
      desc: "Doğal dilde konuşan, bağlamı hatırlayan ve 12 dilde hizmet veren yeni nesil sohbet asistanı.",
      tags: ["React", "OpenAI API", "Node.js", "Redis"],
      year: "2025",
      featured: 1,
      order: 2,
    },
    {
      title: "NeoMarket",
      cat: "web",
      catLabel: "WEB",
      img: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/144703cbc-5c5b-47ce-bb4b-41ffa0e57f2f.png",
      desc: "Headless mimariyle kurulmuş, %99.9 uptime ile çalışan, saniyede 10.000 istek karşılayan e-ticaret altyapısı.",
      tags: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
      year: "2025",
      featured: 1,
      order: 3,
    },
    {
      title: "PulsePay",
      cat: "mobil",
      catLabel: "MOBİL",
      img: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/1e652d3fe-84c4-4fa5-9a9b-758fef7c3414.png",
      desc: "Biyometrik doğrulamalı, anlık para transferi ve akıllı bütçe analizi sunan mobil bankacılık uygulaması.",
      tags: ["React Native", "Expo", "Fastify", "MongoDB"],
      year: "2024",
      featured: 0,
      order: 4,
    },
    {
      title: "HoloFolio",
      cat: "opensource",
      catLabel: "AÇIK KAYNAK",
      img: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/10d4be8f8-d262-40a5-bf03-f7be4bee6436.png",
      desc: "Three.js tabanlı, 60 FPS'de çalışan interaktif 3D portfolyo şablonu. GitHub'da 2.4k yıldız.",
      tags: ["Three.js", "WebGL", "GSAP", "Vite"],
      year: "2024",
      featured: 0,
      order: 5,
    },
    {
      title: "CodeNeon",
      cat: "opensource",
      catLabel: "AÇIK KAYNAK",
      img: "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/19f447268-91ac-4d77-bf30-950aa90c41c1.png",
      desc: "50.000+ indirmeye ulaşan, göz yormayan neon renk paletli VS Code tema ve eklenti koleksiyonu.",
      tags: ["TypeScript", "VS Code API", "Node.js"],
      year: "2023",
      featured: 0,
      order: 6,
    },
  ];

  for (const p of projects) {
    insertProject.run(
      p.title,
      p.cat,
      p.catLabel,
      p.img,
      p.desc,
      JSON.stringify(p.tags),
      p.year,
      p.featured,
      p.order,
    );
  }

  // ── Posts ──
  const insertPost = db.prepare(
    "INSERT INTO posts (glyph, color, title, date, read_time, tags, excerpt, content, thumbnail, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );

  const posts = [
    {
      glyph: "NX",
      color: "#00f0ff",
      title:
        "Next.js App Router ile Sunucu Bileşenlerini Derinlemesine Anlamak",
      date: "18 TEM 2026",
      read: "12 DK",
      tags: ["Next.js", "React"],
      excerpt:
        "Server Components'in render yaşam döngüsünü, streaming mimarisini ve istemci sınırlarını gerçek projeler üzerinden inceliyoruz.",
      content:
        "## Giriş\n\nNext.js App Router ile birlikte gelen Server Components, web geliştirme dünyasında köklü bir değişimi beraberinde getirdi.\n\n## Server Components Nedir?\n\nServer Components, sunucu tarafında render edilen React bileşenleridir. İstemciye JavaScript gönderilmez, bu da daha hızlı yükleme demektir.\n\n## Streaming Mimari\n\nNext.js, Suspense ile birlikte streaming yaparak sayfanın parçalar halinde yüklenmesini sağlar.\n\n## Sonuç\n\nServer Components'i doğru kullandığınızda, hem performans hem de geliştirici deneyimi açısından ciddi kazanımlar elde edersiniz.",
      featured: 1,
      order: 1,
    },
    {
      glyph: "3D",
      color: "#ff2bd6",
      title: "Three.js ile İlk 3D Web Deneyiminizi İnşa Edin",
      date: "02 TEM 2026",
      read: "9 DK",
      tags: ["Three.js", "WebGL"],
      excerpt:
        "Sahne, kamera ve renderer üçlüsünden başlayarak tarayıcıda akıcı 3D animasyonlar oluşturmanın temelleri.",
      content: "",
      featured: 0,
      order: 2,
    },
    {
      glyph: "⚡",
      color: "#c8ff3e",
      title: "React'ta Performans: Gereksiz Render'ları Önlemenin 7 Yolu",
      date: "14 HAZ 2026",
      read: "8 DK",
      tags: ["React", "Performans"],
      excerpt:
        "memo, useMemo, useCallback ne zaman gerçekten gerekli? Profiler ile ölçerek kanıtlanmış optimizasyon teknikleri.",
      content: "",
      featured: 0,
      order: 3,
    },
    {
      glyph: "AI",
      color: "#7a5cff",
      title: "Yapay Zeka Destekli Arayüzler: LLM'i Ürüne Entegre Etmek",
      date: "28 MAY 2026",
      read: "14 DK",
      tags: ["Yapay Zeka", "UX"],
      excerpt:
        "Streaming yanıtlar, fonksiyon çağrıları ve hata toleranslı tasarımlarla üretim kalitesinde AI özellikleri geliştirme rehberi.",
      content: "",
      featured: 0,
      order: 4,
    },
    {
      glyph: "TS",
      color: "#00f0ff",
      title: "TypeScript ile Kırılmaz Tip Güvenliği: İleri Seviye Kalıplar",
      date: "09 MAY 2026",
      read: "11 DK",
      tags: ["TypeScript"],
      excerpt:
        "Generic constraint'ler, conditional tipler ve template literal tiplerle hata sınıflarını derleme anında yok edin.",
      content: "",
      featured: 0,
      order: 5,
    },
    {
      glyph: "MD",
      color: "#ff2bd6",
      title: "Bu Siteyi Nasıl Yaptım: Next.js + MDX Blog Mimarisi",
      date: "21 NİS 2026",
      read: "7 DK",
      tags: ["Next.js", "MDX"],
      excerpt:
        "İçerik yönetiminden SEO'ya, karanlık tema optimizasyonundan deploy hattına kadar bu sitenin tüm anatomisi.",
      content: "",
      featured: 0,
      order: 6,
    },
  ];

  for (const p of posts) {
    insertPost.run(
      p.glyph,
      p.color,
      p.title,
      p.date,
      p.read,
      JSON.stringify(p.tags),
      p.excerpt,
      p.content,
      "",
      p.featured,
      p.order,
    );
  }

  // ── About ──
  db.prepare(
    "INSERT INTO about (id, name, location, experience, expertise, status, lead, bio1, bio2, bio3, avatar, skills, timeline) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(
    "Erkan Erdem",
    "Türkiye",
    "17+ Yıl",
    "Full-Stack Developer & Veteriner Hekim",
    "Projeye Açık ✓",
    "Merhaba! Ben Erkan — 17+ yıldır yazılımın peşinde koşan bir veteriner hekim ve full-stack geliştiriciyim.",
    "2005 yılında basit Excel formülleri ve VBA makroları ile başlayan yazılım merakım, bugün modern web teknolojileri ve yapay zeka ile profesyonel uygulamalar geliştirmeye evrildi. 17+ yıllık bu yolculukta her adım bir öncekinin üzerine inşa edildi.",
    "Veteriner hekimlik mesleğimi, müzik tutkum ve teknoloji merakım ile çok yönlü bir yaşam sürdürüyorum. Sistematik düşünce yapım ve analitik yaklaşımım, hem mesleğimde hem de Full Stack Developer olarak geliştirdiğim projelerde bana güç veriyor.",
    "Yapay zeka ve bilgisayarlı görü sistemlerini yakından takip ediyor, müzik prodüksiyonu ve astroloji ile hayatıma renk katıyorum. Her biri ayrı bir tutku olan bu alanların kesişiminde, sürekli öğrenmeye ve kendimi geliştirmeye devam ediyorum.",
    "https://image.qwenlm.ai/public_source/e3c4f803-ac03-485a-a45c-7cce7aa3ace3/1f13f3e01-e128-4421-bd7f-497529ce6876.png",
    JSON.stringify([
      { name: "JavaScript / TypeScript", lvl: 92 },
      { name: "React / Next.js", lvl: 90 },
      { name: "Python / FastAPI", lvl: 85 },
      { name: "PostgreSQL / Veri Modelleme", lvl: 88 },
      { name: "Three.js / WebGL", lvl: 78 },
      { name: "Yapay Zeka / Makine Öğrenmesi", lvl: 74 },
      { name: "Docker / DevOps", lvl: 80 },
      { name: "Excel VBA / Otomasyon", lvl: 95 },
    ]),
    "[]",
  );

  // ── Contact Info ──
  db.prepare(
    "INSERT INTO contact_info (id, email, location, response_time, socials) VALUES (1, ?, ?, ?, ?)",
  ).run(
    "merhaba@erkanerdem.online",
    "Türkiye",
    "< 24 saat",
    JSON.stringify([
      {
        name: "GITHUB",
        handle: "@erkanerdem",
        url: "https://github.com/erkanerdem",
      },
      {
        name: "LINKEDIN",
        handle: "/in/erkanerdem",
        url: "https://linkedin.com/in/erkanerdem",
      },
      {
        name: "X / TWITTER",
        handle: "@erkanerdem",
        url: "https://x.com/erkanerdem",
      },
      {
        name: "YOUTUBE",
        handle: "@erkanerdem",
        url: "https://youtube.com/@erkanerdem",
      },
    ]),
  );

  // ── Eski siteden eklenen blog yazilari ──
  const oldPosts = [
    {
      glyph: "AI",
      color: "#00f0ff",
      title: "Veteriner Hekimlikte Yapay Zeka Uygulamalari",
      date: "25 ARALIK 2024",
      read: "5 DK",
      tags: ["Yapay Zeka", "Veteriner Hekimlik"],
      excerpt:
        "Yapay zeka teknolojilerinin veteriner hekimliğindeki kullanım alanları, avantajları ve gelecek potansiyeli üzerine derinlemesine bir bakış. Makine öğrenimi modelleri ile hastalık teşhisi, görüntü analizi ve tedavi önerileri.",
      content: "",
      featured: 0,
      order: 7,
    },
    {
      glyph: "FS",
      color: "#ff2bd6",
      title: "Modern Fullstack Gelistirme Yaklasimlari",
      date: "20 ARALIK 2024",
      read: "8 DK",
      tags: ["Fullstack", "Web Gelistirme"],
      excerpt:
        "Next.js, TypeScript ve modern ORM araçları ile ölçeklenebilir fullstack uygulamalar geliştirme süreçleri.",
      content: "",
      featured: 0,
      order: 8,
    },
    {
      glyph: "ML",
      color: "#c8ff3e",
      title: "Makine Ogrenmesi ile Goruntu Siniflandirma",
      date: "15 ARALIK 2024",
      read: "10 DK",
      tags: ["Machine Learning", "Python"],
      excerpt:
        "Derin öğrenme modelleri ile görüntü sınıflandırma projeleri, veri hazırlama, model eğitimi ve deploy süreçleri.",
      content: "",
      featured: 0,
      order: 9,
    },
  ];

  for (const p of oldPosts) {
    insertPost.run(
      p.glyph,
      p.color,
      p.title,
      p.date,
      p.read,
      JSON.stringify(p.tags),
      p.excerpt,
      p.content,
      "",
      p.featured,
      p.order,
    );
  }

  console.log("Database seeded successfully.");
}
