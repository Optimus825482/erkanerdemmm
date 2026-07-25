"use client";
import { useEffect, useState } from "react";

interface Skill { name: string; lvl: number }
interface TimelineItem { year: string; title: string; desc: string }
interface AboutData { name: string; location: string; experience: string; expertise: string; status: string; lead: string; bio1: string; bio2: string; bio3: string; avatar: string; skills: Skill[]; timeline: TimelineItem[] }

export default function AboutAdmin() {
    const [form, setForm] = useState<AboutData | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/about").then((r) => r.json()).then((d) => {
            setForm({ ...d, skills: JSON.parse(d.skills || "[]"), timeline: JSON.parse(d.timeline || "[]") });
        });
    }, []);

    const save = async () => {
        if (!form) return;
        await fetch("/api/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !form) return;
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        setForm({ ...form, avatar: data.url });
    };

    const updateSkill = (i: number, field: keyof Skill, value: string | number) => {
        if (!form) return;
        const skills = [...form.skills];
        skills[i] = { ...skills[i], [field]: value };
        setForm({ ...form, skills });
    };

    const addSkill = () => { if (form) setForm({ ...form, skills: [...form.skills, { name: "", lvl: 80 }] }); };
    const removeSkill = (i: number) => { if (form) setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) }); };

    const updateTimeline = (i: number, field: keyof TimelineItem, value: string) => {
        if (!form) return;
        const timeline = [...form.timeline];
        timeline[i] = { ...timeline[i], [field]: value };
        setForm({ ...form, timeline });
    };

    const addTimeline = () => { if (form) setForm({ ...form, timeline: [...form.timeline, { year: "", title: "", desc: "" }] }); };
    const removeTimeline = (i: number) => { if (form) setForm({ ...form, timeline: form.timeline.filter((_, idx) => idx !== i) }); };

    if (!form) return <div style={{ color: "#8b94bb" }}>Yükleniyor...</div>;

    const inputStyle = { width: "100%", background: "rgba(8,12,26,.7)", border: "1px solid rgba(139,148,187,.3)", color: "#e0e4f0", padding: "10px 14px", fontSize: "0.9rem", fontFamily: "'Rajdhani', sans-serif", outline: "none" };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", letterSpacing: 3 }}>HAKKIMDA</h1>
                <button onClick={save} style={{ background: saved ? "#c8ff3e" : "#00f0ff", color: "#031018", border: "none", padding: "10px 28px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.75rem", letterSpacing: 2, cursor: "pointer" }}>{saved ? "KAYDEDİLDİ ✓" : "KAYDET"}</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                <input placeholder="İsim" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                <input placeholder="Konum" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} />
                <input placeholder="Deneyim" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} style={inputStyle} />
                <input placeholder="Uzmanlık" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} style={inputStyle} />
                <input placeholder="Durum" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle} />
                <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#8b94bb", letterSpacing: 1, marginBottom: 6 }}>AVATAR</label>
                    <input type="file" accept="image/*" onChange={uploadAvatar} style={{ fontSize: "0.8rem", color: "#8b94bb" }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {form.avatar && <img src={form.avatar} alt="" style={{ width: 80, marginTop: 8, border: "1px solid rgba(0,240,255,.2)" }} />}
                </div>
            </div>

            <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff2bd6", fontSize: "0.8rem", letterSpacing: 2, marginBottom: 12 }}>BİYO</div>
                <input placeholder="Giriş cümlesi" value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} style={{ ...inputStyle, marginBottom: 10 }} />
                <textarea placeholder="1. paragraf" value={form.bio1} onChange={(e) => setForm({ ...form, bio1: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical", marginBottom: 10 }} />
                <textarea placeholder="2. paragraf" value={form.bio2} onChange={(e) => setForm({ ...form, bio2: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical", marginBottom: 10 }} />
                <textarea placeholder="3. paragraf" value={form.bio3} onChange={(e) => setForm({ ...form, bio3: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff2bd6", fontSize: "0.8rem", letterSpacing: 2 }}>YETKİNLİKLER</div>
                    <button onClick={addSkill} style={{ background: "transparent", color: "#00f0ff", border: "1px solid rgba(0,240,255,.3)", padding: "4px 12px", fontSize: "0.7rem", cursor: "pointer" }}>+ EKLE</button>
                </div>
                {form.skills.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                        <input placeholder="Yetenek adı" value={s.name} onChange={(e) => updateSkill(i, "name", e.target.value)} style={{ ...inputStyle, flex: 3 }} />
                        <input type="number" min={0} max={100} value={s.lvl} onChange={(e) => updateSkill(i, "lvl", Number(e.target.value))} style={{ ...inputStyle, flex: 1 }} />
                        <button onClick={() => removeSkill(i)} style={{ background: "transparent", color: "#ff5f56", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
                    </div>
                ))}
            </div>

            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff2bd6", fontSize: "0.8rem", letterSpacing: 2 }}>ZAMAN ÇİZELGESİ</div>
                    <button onClick={addTimeline} style={{ background: "transparent", color: "#00f0ff", border: "1px solid rgba(0,240,255,.3)", padding: "4px 12px", fontSize: "0.7rem", cursor: "pointer" }}>+ EKLE</button>
                </div>
                {form.timeline.map((t, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 3fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                        <input placeholder="Yıl" value={t.year} onChange={(e) => updateTimeline(i, "year", e.target.value)} style={inputStyle} />
                        <input placeholder="Ünvan" value={t.title} onChange={(e) => updateTimeline(i, "title", e.target.value)} style={inputStyle} />
                        <input placeholder="Açıklama" value={t.desc} onChange={(e) => updateTimeline(i, "desc", e.target.value)} style={inputStyle} />
                        <button onClick={() => removeTimeline(i)} style={{ background: "transparent", color: "#ff5f56", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
