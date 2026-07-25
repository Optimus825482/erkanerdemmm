"use client";
import { useEffect, useState } from "react";

interface Post { id: number; glyph: string; color: string; title: string; date: string; read_time: string; tags: string; excerpt: string; content: string; thumbnail: string; featured: number; sort_order: number; }

const empty: Omit<Post, "id"> = { glyph: "", color: "#00f0ff", title: "", date: "", read_time: "5 DK", tags: "[]", excerpt: "", content: "", thumbnail: "", featured: 0, sort_order: 0 };

export default function PostsAdmin() {
    const [list, setList] = useState<Post[]>([]);
    const [form, setForm] = useState<Omit<Post, "id">>(empty);
    const [editId, setEditId] = useState<number | null>(null);
    const [tagInput, setTagInput] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const load = () => fetch("/api/posts").then((r) => r.json()).then(setList);
    useEffect(() => { load(); }, []);

    const openEdit = (p: Post) => {
        setEditId(p.id);
        setForm({ ...p });
        setTagInput(JSON.parse(p.tags || "[]").join(", "));
    };

    const openNew = () => { setEditId(null); setIsAdding(true); setForm(empty); setTagInput(""); };

    const save = async () => {
        const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
        const body = { ...form, tags };
        if (editId) {
            await fetch(`/api/posts/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        } else {
            await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        }
        setEditId(null); setIsAdding(false); setForm(empty); setTagInput(""); load();
    };

    const remove = async (id: number) => {
        if (!confirm("Silinecek?")) return;
        await fetch(`/api/posts/${id}`, { method: "DELETE" });
        load();
    };

    const upload = async (e: React.ChangeEvent<HTMLInputElement>, field: "thumbnail" | "content") => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (field === "thumbnail") setForm((f) => ({ ...f, thumbnail: data.url }));
        else setForm((f) => ({ ...f, content: f.content + `\n\n![görsel](${data.url})\n\n` }));
    };

    const inputStyle = { width: "100%", background: "rgba(8,12,26,.7)", border: "1px solid rgba(139,148,187,.3)", color: "#e0e4f0", padding: "10px 14px", fontSize: "0.9rem", fontFamily: "'Rajdhani', sans-serif", outline: "none" };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", letterSpacing: 3 }}>YAZILAR</h1>
                <button onClick={openNew} style={{ background: "#ff2bd6", color: "#1a0313", border: "none", padding: "10px 24px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.75rem", letterSpacing: 2, cursor: "pointer" }}>+ YENİ</button>
            </div>

            {(editId !== null || isAdding) && (
                <div style={{ background: "rgba(10,15,34,.8)", border: "1px solid rgba(255,43,214,.2)", padding: 24, marginBottom: 28 }}>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff2bd6", fontSize: "0.8rem", letterSpacing: 2, marginBottom: 16 }}>{editId ? "DÜZENLE" : "YENİ YAZI"}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <input placeholder="Başlık" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
                        <input placeholder="Glyph (NX, 3D, AI...)" value={form.glyph} onChange={(e) => setForm({ ...form, glyph: e.target.value })} style={inputStyle} />
                        <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ ...inputStyle, height: 42, padding: 4 }} />
                        <input placeholder="Okuma süresi (12 DK)" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} style={inputStyle} />
                        <input placeholder="Tarih (18 TEM 2026)" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
                        <input placeholder="Etiketler (virgülle)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} style={inputStyle} />
                        <textarea placeholder="Özet" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }} />
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "#8b94bb", letterSpacing: 1, marginBottom: 6 }}>İÇERİK (Markdown)</label>
                            <textarea placeholder="Yazı içeriği (Markdown formatında)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} style={{ ...inputStyle, resize: "vertical", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.85rem" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "#8b94bb", letterSpacing: 1, marginBottom: 6 }}>KÜÇÜK GÖRSEL (Kart)</label>
                            <input type="file" accept="image/*" onChange={(e) => upload(e, "thumbnail")} style={{ fontSize: "0.8rem", color: "#8b94bb" }} />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {form.thumbnail && <img src={form.thumbnail} alt="" style={{ width: 120, marginTop: 8, border: "1px solid rgba(255,43,214,.2)" }} />}
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "#8b94bb", letterSpacing: 1, marginBottom: 6 }}>İÇERİK GÖRSELİ EKLE</label>
                            <input type="file" accept="image/*" onChange={(e) => upload(e, "content")} style={{ fontSize: "0.8rem", color: "#8b94bb" }} />
                            <div style={{ fontSize: "0.7rem", color: "#8b94bb", marginTop: 4 }}>Görsel içerik alanına eklenir</div>
                        </div>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#8b94bb", fontSize: "0.85rem" }}>
                            <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked ? 1 : 0 })} /> Öne Çıkan
                        </label>
                    </div>
                    <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                        <button onClick={save} style={{ background: "#ff2bd6", color: "#1a0313", border: "none", padding: "10px 28px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", letterSpacing: 2, cursor: "pointer" }}>KAYDET</button>
                        <button onClick={() => { setEditId(null); setIsAdding(false); setForm(empty); setTagInput(""); }} style={{ background: "transparent", color: "#8b94bb", border: "1px solid rgba(139,148,187,.3)", padding: "10px 20px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", letterSpacing: 2, cursor: "pointer" }}>İPTAL</button>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.map((p) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: "rgba(10,15,34,.5)", border: "1px solid rgba(0,240,255,.1)" }}>
                        <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: `${p.color}15`, border: `1px solid ${p.color}40`, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "1rem", color: p.color }}>{p.glyph}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.82rem", letterSpacing: 1 }}>{p.title}</div>
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.68rem", color: "#8b94bb", letterSpacing: 1, marginTop: 4 }}>{p.date} · {p.read_time} {p.featured ? "★" : ""}</div>
                        </div>
                        <button onClick={() => openEdit(p)} style={{ background: "transparent", color: "#00f0ff", border: "1px solid rgba(0,240,255,.3)", padding: "6px 14px", fontSize: "0.72rem", cursor: "pointer", fontFamily: "'Share Tech Mono', monospace" }}>DÜZENLE</button>
                        <button onClick={() => remove(p.id)} style={{ background: "transparent", color: "#ff5f56", border: "1px solid rgba(255,95,86,.3)", padding: "6px 14px", fontSize: "0.72rem", cursor: "pointer", fontFamily: "'Share Tech Mono', monospace" }}>SİL</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
