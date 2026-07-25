"use client";
import { useEffect, useState } from "react";

interface Project { id: number; title: string; category: string; category_label: string; image: string; description: string; tags: string; year: string; featured: number; sort_order: number; }

const empty: Omit<Project, "id"> = { title: "", category: "web", category_label: "WEB", image: "", description: "", tags: "[]", year: "2026", featured: 0, sort_order: 0 };

export default function ProjectsAdmin() {
    const [list, setList] = useState<Project[]>([]);
    const [form, setForm] = useState<Omit<Project, "id">>(empty);
    const [editId, setEditId] = useState<number | null>(null);
    const [tagInput, setTagInput] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const load = () => fetch("/api/projects").then((r) => r.json()).then(setList);
    useEffect(() => { load(); }, []);

    const openEdit = (p: Project) => {
        setEditId(p.id);
        setForm({ ...p, tags: p.tags });
        setTagInput(JSON.parse(p.tags || "[]").join(", "));
    };

    const openNew = () => { setEditId(null); setIsAdding(true); setForm(empty); setTagInput(""); };

    const save = async () => {
        const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
        const body = { ...form, tags };
        if (editId) {
            await fetch(`/api/projects/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        } else {
            await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        }
        setEditId(null); setIsAdding(false); setForm(empty); setTagInput(""); load();
    };

    const remove = async (id: number) => {
        if (!confirm("Silinecek?")) return;
        await fetch(`/api/projects/${id}`, { method: "DELETE" });
        load();
    };

    const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        setForm((f) => ({ ...f, image: data.url }));
    };

    const inputStyle = { width: "100%", background: "rgba(8,12,26,.7)", border: "1px solid rgba(139,148,187,.3)", color: "#e0e4f0", padding: "10px 14px", fontSize: "0.9rem", fontFamily: "'Rajdhani', sans-serif", outline: "none" };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", letterSpacing: 3 }}>PROJELER</h1>
                <button onClick={openNew} style={{ background: "#00f0ff", color: "#031018", border: "none", padding: "10px 24px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.75rem", letterSpacing: 2, cursor: "pointer" }}>+ YENİ</button>
            </div>

            {(editId !== null || isAdding) && (
                <div style={{ background: "rgba(10,15,34,.8)", border: "1px solid rgba(0,240,255,.2)", padding: 24, marginBottom: 28 }}>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff2bd6", fontSize: "0.8rem", letterSpacing: 2, marginBottom: 16 }}>{editId ? "DÜZENLE" : "YENİ PROJE"}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <input placeholder="Başlık" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
                        <input placeholder="Yıl" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={inputStyle} />
                        <select value={form.category} onChange={(e) => { const v = e.target.value; const labels: Record<string, string> = { web: "WEB", mobil: "MOBİL", ai: "YAPAY ZEKA", opensource: "AÇIK KAYNAK" }; setForm({ ...form, category: v, category_label: labels[v] || v.toUpperCase() }); }} style={inputStyle}>
                            <option value="web">WEB</option><option value="mobil">MOBİL</option><option value="ai">YAPAY ZEKA</option><option value="opensource">AÇIK KAYNAK</option>
                        </select>
                        <input placeholder="Etiketler (virgülle)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} style={inputStyle} />
                        <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }} />
                        <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "#8b94bb", letterSpacing: 1, marginBottom: 6 }}>GÖRSEL</label>
                            <input type="file" accept="image/*" onChange={upload} style={{ fontSize: "0.8rem", color: "#8b94bb" }} />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {form.image && <img src={form.image} alt="" style={{ width: 120, marginTop: 8, border: "1px solid rgba(0,240,255,.2)" }} />}
                        </div>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#8b94bb", fontSize: "0.85rem" }}>
                            <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked ? 1 : 0 })} /> Öne Çıkan
                        </label>
                    </div>
                    <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                        <button onClick={save} style={{ background: "#00f0ff", color: "#031018", border: "none", padding: "10px 28px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", letterSpacing: 2, cursor: "pointer" }}>KAYDET</button>
                        <button onClick={() => { setEditId(null); setIsAdding(false); setForm(empty); setTagInput(""); }} style={{ background: "transparent", color: "#8b94bb", border: "1px solid rgba(139,148,187,.3)", padding: "10px 20px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", letterSpacing: 2, cursor: "pointer" }}>İPTAL</button>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.map((p) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: "rgba(10,15,34,.5)", border: "1px solid rgba(0,240,255,.1)", transition: ".2s" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {p.image && <img src={p.image} alt="" style={{ width: 60, height: 40, objectFit: "cover", border: "1px solid rgba(0,240,255,.15)" }} />}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem", letterSpacing: 1 }}>{p.title}</div>
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#8b94bb", letterSpacing: 1, marginTop: 4 }}>{p.category_label} · {p.year} {p.featured ? "★" : ""}</div>
                        </div>
                        <button onClick={() => openEdit(p)} style={{ background: "transparent", color: "#00f0ff", border: "1px solid rgba(0,240,255,.3)", padding: "6px 14px", fontSize: "0.72rem", cursor: "pointer", fontFamily: "'Share Tech Mono', monospace" }}>DÜZENLE</button>
                        <button onClick={() => remove(p.id)} style={{ background: "transparent", color: "#ff5f56", border: "1px solid rgba(255,95,86,.3)", padding: "6px 14px", fontSize: "0.72rem", cursor: "pointer", fontFamily: "'Share Tech Mono', monospace" }}>SİL</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
