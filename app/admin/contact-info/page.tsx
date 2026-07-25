"use client";
import { useEffect, useState } from "react";

interface Social { name: string; handle: string; url: string }
interface ContactData { email: string; location: string; response_time: string; socials: Social[] }

export default function ContactInfoAdmin() {
    const [form, setForm] = useState<ContactData | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/contact-info").then((r) => r.json()).then((d) => {
            setForm({ ...d, socials: JSON.parse(d.socials || "[]") });
        });
    }, []);

    const save = async () => {
        if (!form) return;
        await fetch("/api/contact-info", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const updateSocial = (i: number, field: keyof Social, value: string) => {
        if (!form) return;
        const socials = [...form.socials];
        socials[i] = { ...socials[i], [field]: value };
        setForm({ ...form, socials });
    };

    const addSocial = () => { if (form) setForm({ ...form, socials: [...form.socials, { name: "", handle: "", url: "" }] }); };
    const removeSocial = (i: number) => { if (form) setForm({ ...form, socials: form.socials.filter((_, idx) => idx !== i) }); };

    if (!form) return <div style={{ color: "#8b94bb" }}>Yükleniyor...</div>;

    const inputStyle = { width: "100%", background: "rgba(8,12,26,.7)", border: "1px solid rgba(139,148,187,.3)", color: "#e0e4f0", padding: "10px 14px", fontSize: "0.9rem", fontFamily: "'Rajdhani', sans-serif", outline: "none" };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", letterSpacing: 3 }}>İLETİŞİM BİLGİSİ</h1>
                <button onClick={save} style={{ background: saved ? "#c8ff3e" : "#00f0ff", color: "#031018", border: "none", padding: "10px 28px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.75rem", letterSpacing: 2, cursor: "pointer" }}>{saved ? "KAYDEDİLDİ ✓" : "KAYDET"}</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#8b94bb", letterSpacing: 1, marginBottom: 6 }}>E-POSTA</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#8b94bb", letterSpacing: 1, marginBottom: 6 }}>KONUM</label>
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#8b94bb", letterSpacing: 1, marginBottom: 6 }}>YANIT SÜRESİ</label>
                    <input value={form.response_time} onChange={(e) => setForm({ ...form, response_time: e.target.value })} style={inputStyle} />
                </div>
            </div>

            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff2bd6", fontSize: "0.8rem", letterSpacing: 2 }}>SOCIAL MEDYA</div>
                    <button onClick={addSocial} style={{ background: "transparent", color: "#00f0ff", border: "1px solid rgba(0,240,255,.3)", padding: "4px 12px", fontSize: "0.7rem", cursor: "pointer" }}>+ EKLE</button>
                </div>
                {form.socials.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                        <input placeholder="Platform adı" value={s.name} onChange={(e) => updateSocial(i, "name", e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                        <input placeholder="Kullanıcı adı" value={s.handle} onChange={(e) => updateSocial(i, "handle", e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                        <input placeholder="URL (https://...)" value={s.url || ""} onChange={(e) => updateSocial(i, "url", e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                        <button onClick={() => removeSocial(i)} style={{ background: "transparent", color: "#ff5f56", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
