import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "data.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    initSchema(_db);
    // Auto-seed on first run (deploy)
    const count = _db.prepare("SELECT COUNT(*) as c FROM projects").get() as {
      c: number;
    };
    if (count.c === 0) {
      const { seedDatabase } = require("./seed");
      seedDatabase();
    }
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'web',
      category_label TEXT NOT NULL DEFAULT 'WEB',
      image TEXT DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      year TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      glyph TEXT NOT NULL DEFAULT '',
      color TEXT NOT NULL DEFAULT '#00f0ff',
      title TEXT NOT NULL,
      date TEXT NOT NULL DEFAULT '',
      read_time TEXT NOT NULL DEFAULT '5 DK',
      tags TEXT NOT NULL DEFAULT '[]',
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      thumbnail TEXT DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS about (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL DEFAULT 'Erkan Erdem',
      location TEXT NOT NULL DEFAULT 'Türkiye',
      experience TEXT NOT NULL DEFAULT '17+ Yıl',
      expertise TEXT NOT NULL DEFAULT 'Full-Stack Developer & Veteriner Hekim',
      status TEXT NOT NULL DEFAULT 'Projeye Açık ✓',
      lead TEXT NOT NULL DEFAULT '',
      bio1 TEXT NOT NULL DEFAULT '',
      bio2 TEXT NOT NULL DEFAULT '',
      bio3 TEXT NOT NULL DEFAULT '',
      avatar TEXT DEFAULT '',
      skills TEXT NOT NULL DEFAULT '[]',
      timeline TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      email TEXT NOT NULL DEFAULT 'merhaba@erkanerdem.online',
      location TEXT NOT NULL DEFAULT 'İstanbul / Türkiye (UTC+3)',
      response_time TEXT NOT NULL DEFAULT '< 24 saat',
      socials TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT DEFAULT '',
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS visitor_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL DEFAULT '',
      city TEXT DEFAULT '',
      country TEXT DEFAULT '',
      isp TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      browser TEXT DEFAULT '',
      os TEXT DEFAULT '',
      device_type TEXT DEFAULT '',
      platform TEXT DEFAULT '',
      language TEXT DEFAULT '',
      screen TEXT DEFAULT '',
      timezone TEXT DEFAULT '',
      referrer TEXT DEFAULT '',
      connection_type TEXT DEFAULT '',
      cores INTEGER DEFAULT 0,
      ram TEXT DEFAULT '',
      page TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `);

  // Migration: bio3 column for about table
  try {
    db.exec("ALTER TABLE about ADD COLUMN bio3 TEXT NOT NULL DEFAULT ''");
  } catch {
    /* column already exists */
  }
  // Migration: visitor_logs extra columns
  try {
    db.exec("ALTER TABLE visitor_logs ADD COLUMN browser TEXT DEFAULT ''");
  } catch {
    /* ok */
  }
  try {
    db.exec("ALTER TABLE visitor_logs ADD COLUMN os TEXT DEFAULT ''");
  } catch {
    /* ok */
  }
  try {
    db.exec("ALTER TABLE visitor_logs ADD COLUMN device_type TEXT DEFAULT ''");
  } catch {
    /* ok */
  }
  try {
    db.exec("ALTER TABLE visitor_logs ADD COLUMN timezone TEXT DEFAULT ''");
  } catch {
    /* ok */
  }
  try {
    db.exec("ALTER TABLE visitor_logs ADD COLUMN referrer TEXT DEFAULT ''");
  } catch {
    /* ok */
  }
  try {
    db.exec(
      "ALTER TABLE visitor_logs ADD COLUMN connection_type TEXT DEFAULT ''",
    );
  } catch {
    /* ok */
  }
  try {
    db.exec("ALTER TABLE visitor_logs ADD COLUMN cores INTEGER DEFAULT 0");
  } catch {
    /* ok */
  }
  try {
    db.exec("ALTER TABLE visitor_logs ADD COLUMN ram TEXT DEFAULT ''");
  } catch {
    /* ok */
  }
}

/* ── Projects ── */
export interface Project {
  id: number;
  title: string;
  category: string;
  category_label: string;
  image: string;
  description: string;
  tags: string;
  year: string;
  featured: number;
  sort_order: number;
  created_at: string;
}

export function getAllProjects(): Project[] {
  return getDb()
    .prepare("SELECT * FROM projects ORDER BY sort_order, id")
    .all() as Project[];
}

export function getProject(id: number): Project | undefined {
  return getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | Project
    | undefined;
}

export function createProject(
  data: Omit<Project, "id" | "created_at">,
): number {
  const stmt = getDb().prepare(
    "INSERT INTO projects (title, category, category_label, image, description, tags, year, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );
  const result = stmt.run(
    data.title,
    data.category,
    data.category_label,
    data.image,
    data.description,
    data.tags,
    data.year,
    data.featured,
    data.sort_order,
  );
  return Number(result.lastInsertRowid);
}

export function updateProject(
  id: number,
  data: Partial<Omit<Project, "id" | "created_at">>,
): void {
  const fields = Object.keys(data);
  if (fields.length === 0) return;
  const sets = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => (data as Record<string, unknown>)[f]);
  getDb()
    .prepare(`UPDATE projects SET ${sets} WHERE id = ?`)
    .run(...values, id);
}

export function deleteProject(id: number): void {
  getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);
}

/* ── Posts ── */
export interface Post {
  id: number;
  glyph: string;
  color: string;
  title: string;
  date: string;
  read_time: string;
  tags: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  featured: number;
  sort_order: number;
  created_at: string;
}

export function getAllPosts(): Post[] {
  return getDb()
    .prepare("SELECT * FROM posts ORDER BY sort_order, id DESC")
    .all() as Post[];
}

export function getPost(id: number): Post | undefined {
  return getDb().prepare("SELECT * FROM posts WHERE id = ?").get(id) as
    | Post
    | undefined;
}

export function createPost(data: Omit<Post, "id" | "created_at">): number {
  const stmt = getDb().prepare(
    "INSERT INTO posts (glyph, color, title, date, read_time, tags, excerpt, content, thumbnail, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );
  const result = stmt.run(
    data.glyph,
    data.color,
    data.title,
    data.date,
    data.read_time,
    data.tags,
    data.excerpt,
    data.content,
    data.thumbnail,
    data.featured,
    data.sort_order,
  );
  return Number(result.lastInsertRowid);
}

export function updatePost(
  id: number,
  data: Partial<Omit<Post, "id" | "created_at">>,
): void {
  const fields = Object.keys(data);
  if (fields.length === 0) return;
  const sets = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => (data as Record<string, unknown>)[f]);
  getDb()
    .prepare(`UPDATE posts SET ${sets} WHERE id = ?`)
    .run(...values, id);
}

export function deletePost(id: number): void {
  getDb().prepare("DELETE FROM posts WHERE id = ?").run(id);
}

/* ── About ── */
export interface About {
  id: number;
  name: string;
  location: string;
  experience: string;
  expertise: string;
  status: string;
  lead: string;
  bio1: string;
  bio2: string;
  bio3: string;
  avatar: string;
  skills: string;
  timeline: string;
}

export function getAbout(): About {
  let row = getDb().prepare("SELECT * FROM about WHERE id = 1").get() as
    | About
    | undefined;
  if (!row) {
    getDb().prepare("INSERT INTO about (id) VALUES (1)").run();
    row = getDb().prepare("SELECT * FROM about WHERE id = 1").get() as About;
  }
  return row;
}

export function updateAbout(data: Partial<Omit<About, "id">>): void {
  const fields = Object.keys(data);
  if (fields.length === 0) return;
  const sets = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => (data as Record<string, unknown>)[f]);
  getDb()
    .prepare(`UPDATE about SET ${sets} WHERE id = 1`)
    .run(...values);
}

/* ── Contact Info ── */
export interface ContactInfo {
  id: number;
  email: string;
  location: string;
  response_time: string;
  socials: string;
}

export function getContactInfo(): ContactInfo {
  let row = getDb().prepare("SELECT * FROM contact_info WHERE id = 1").get() as
    | ContactInfo
    | undefined;
  if (!row) {
    getDb().prepare("INSERT INTO contact_info (id) VALUES (1)").run();
    row = getDb()
      .prepare("SELECT * FROM contact_info WHERE id = 1")
      .get() as ContactInfo;
  }
  return row;
}

export function updateContactInfo(
  data: Partial<Omit<ContactInfo, "id">>,
): void {
  const fields = Object.keys(data);
  if (fields.length === 0) return;
  const sets = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => (data as Record<string, unknown>)[f]);
  getDb()
    .prepare(`UPDATE contact_info SET ${sets} WHERE id = 1`)
    .run(...values);
}

/* ── Messages ── */
export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
}

export function getAllMessages(): Message[] {
  return getDb()
    .prepare("SELECT * FROM messages ORDER BY created_at DESC")
    .all() as Message[];
}

export function getMessage(id: number): Message | undefined {
  return getDb().prepare("SELECT * FROM messages WHERE id = ?").get(id) as
    | Message
    | undefined;
}

export function createMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): number {
  const stmt = getDb().prepare(
    "INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
  );
  const result = stmt.run(data.name, data.email, data.subject, data.message);
  return Number(result.lastInsertRowid);
}

export function markMessageRead(id: number): void {
  getDb().prepare("UPDATE messages SET is_read = 1 WHERE id = ?").run(id);
}

export function deleteMessage(id: number): void {
  getDb().prepare("DELETE FROM messages WHERE id = ?").run(id);
}

/* ── Visitor Logs ── */
export interface VisitorLog {
  id: number;
  ip: string;
  city: string;
  country: string;
  isp: string;
  user_agent: string;
  browser: string;
  os: string;
  device_type: string;
  platform: string;
  language: string;
  screen: string;
  timezone: string;
  referrer: string;
  connection_type: string;
  cores: number;
  ram: string;
  page: string;
  created_at: string;
}

export function createVisitorLog(data: {
  ip: string;
  city: string;
  country: string;
  isp: string;
  user_agent: string;
  browser: string;
  os: string;
  device_type: string;
  platform: string;
  language: string;
  screen: string;
  timezone: string;
  referrer: string;
  connection_type: string;
  cores: number;
  ram: string;
  page: string;
}): number {
  const stmt = getDb().prepare(
    "INSERT INTO visitor_logs (ip, city, country, isp, user_agent, browser, os, device_type, platform, language, screen, timezone, referrer, connection_type, cores, ram, page) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );
  const result = stmt.run(
    data.ip,
    data.city,
    data.country,
    data.isp,
    data.user_agent,
    data.browser,
    data.os,
    data.device_type,
    data.platform,
    data.language,
    data.screen,
    data.timezone,
    data.referrer,
    data.connection_type,
    data.cores,
    data.ram,
    data.page,
  );
  return Number(result.lastInsertRowid);
}

export function getAllVisitorLogs(): VisitorLog[] {
  return getDb()
    .prepare("SELECT * FROM visitor_logs ORDER BY created_at DESC LIMIT 200")
    .all() as VisitorLog[];
}

/* ── Settings ── */
export function getSetting(key: string): string {
  const row = getDb()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row?.value || "";
}

export function setSetting(key: string, value: string): void {
  getDb()
    .prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)")
    .run(key, value);
}

export function getAdminPassword(): string {
  return getSetting("admin_password") || "admin123";
}

export function setAdminPassword(password: string): void {
  setSetting("admin_password", password);
}

export function deleteVisitorLog(id: number): void {
  getDb().prepare("DELETE FROM visitor_logs WHERE id = ?").run(id);
}
