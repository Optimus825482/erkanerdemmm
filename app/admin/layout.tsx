"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
    { href: "/admin", label: "Dashboard", icon: "◆" },
    { href: "/admin/projects", label: "Projeler", icon: "▢" },
    { href: "/admin/posts", label: "Yazılar", icon: "☰" },
    { href: "/admin/about", label: "Hakkımda", icon: "◎" },
    { href: "/admin/contact-info", label: "İletişim Bilgisi", icon: "✉" },
    { href: "/admin/messages", label: "Mesajlar", icon: "▸" },
    { href: "/admin/visitors", label: "Ziyaretçiler", icon: "◈" },
];

function LoginForm({ onLogin }: { onLogin: () => void }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "login", password }),
            });
            const data = await res.json();
            if (data.ok) {
                sessionStorage.setItem("admin_auth", "1");
                onLogin();
            } else {
                setError(data.error || "Hatalı şifre");
            }
        } catch {
            setError("Bağlantı hatası");
        }
        setLoading(false);
    };

    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: "100vh", background: "#0a0e1a",
            fontFamily: "'Rajdhani', sans-serif",
        }}>
            <div style={{
                background: "rgba(10,15,34,.9)", border: "1px solid rgba(0,240,255,.2)",
                padding: "48px 40px", width: 400, maxWidth: "90vw",
                clipPath: "polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px)",
            }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.3rem", letterSpacing: 3, color: "#fff" }}>
                        <span style={{ color: "#ff2bd6" }}>{">"}</span> ADMIN <span style={{ color: "#00f0ff" }}>PANEL</span>
                    </div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem", color: "#8b94bb", letterSpacing: 2, marginTop: 10 }}>
                        KİMLİK DOĞRULAMA GEREKLİ
                    </div>
                </div>
                <form onSubmit={submit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                            width: "100%", background: "rgba(8,12,26,.9)", border: "1px solid rgba(0,240,255,.3)",
                            color: "#e0e4f0", padding: "14px 18px", fontSize: "1rem", fontFamily: "'Share Tech Mono', monospace",
                            outline: "none", letterSpacing: 3, textAlign: "center",
                        }}
                    />
                    {error && (
                        <div style={{
                            color: "#ff5f56", fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "0.75rem", letterSpacing: 1, marginTop: 10, textAlign: "center",
                        }}>
                            ✗ {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%", marginTop: 20, padding: "14px",
                            background: loading ? "rgba(0,240,255,.2)" : "#00f0ff",
                            color: "#031018", border: "none",
                            fontFamily: "'Orbitron', sans-serif", fontSize: "0.8rem", letterSpacing: 3,
                            cursor: loading ? "wait" : "pointer",
                            clipPath: "polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)",
                        }}
                    >
                        {loading ? "KONTROL EDİLİYOR..." : "GİRİŞ"}
                    </button>
                </form>
            </div>
        </div>
    );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
    const [current, setCurrent] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [msg, setMsg] = useState({ text: "", ok: false });
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirm) {
            setMsg({ text: "Yeni şifreler eşleşmiyor", ok: false });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "change", current, newPassword }),
            });
            const data = await res.json();
            if (data.ok) {
                setMsg({ text: "✓ Şifre güncellendi", ok: true });
                setTimeout(onClose, 1200);
            } else {
                setMsg({ text: data.error || "Hata", ok: false });
            }
        } catch {
            setMsg({ text: "Bağlantı hatası", ok: false });
        }
        setLoading(false);
    };

    const inputStyle = { width: "100%", background: "rgba(8,12,26,.7)", border: "1px solid rgba(139,148,187,.3)", color: "#e0e4f0", padding: "10px 14px", fontSize: "0.9rem", fontFamily: "'Rajdhani', sans-serif", outline: "none" };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(4,6,15,.92)", display: "flex",
            alignItems: "center", justifyContent: "center",
        }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{
                background: "rgba(10,15,34,.95)", border: "1px solid rgba(0,240,255,.25)",
                padding: "36px 32px", width: 400, maxWidth: "90vw",
                clipPath: "polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)",
            }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1rem", letterSpacing: 2, marginBottom: 24, color: "#ff2bd6" }}>
                    ŞİFRE DEĞİŞTİR
                </div>
                <form onSubmit={submit}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Mevcut şifre" style={inputStyle} />
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Yeni şifre" style={inputStyle} />
                        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Yeni şifre (tekrar)" style={inputStyle} />
                    </div>
                    {msg.text && (
                        <div style={{ color: msg.ok ? "#c8ff3e" : "#ff5f56", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", marginTop: 12, textAlign: "center" }}>
                            {msg.text}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                        <button type="submit" disabled={loading} style={{ flex: 1, background: "#00f0ff", color: "#031018", border: "none", padding: "12px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", letterSpacing: 2, cursor: "pointer" }}>
                            {loading ? "..." : "GÜNCELLE"}
                        </button>
                        <button type="button" onClick={onClose} style={{ background: "transparent", color: "#8b94bb", border: "1px solid rgba(139,148,187,.3)", padding: "12px 20px", fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", letterSpacing: 2, cursor: "pointer" }}>
                            İPTAL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [authed, setAuthed] = useState(false);
    const [checked, setChecked] = useState(false);
    const [showPwModal, setShowPwModal] = useState(false);

    useEffect(() => {
        setAuthed(sessionStorage.getItem("admin_auth") === "1");
        setChecked(true);
    }, []);

    const handleLogin = () => setAuthed(true);
    const handleLogout = () => { sessionStorage.removeItem("admin_auth"); setAuthed(false); };

    if (!checked) return null;

    if (!authed) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e1a", color: "#e0e4f0", fontFamily: "'Rajdhani', sans-serif" }}>
            {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}
            <aside style={{ width: 240, background: "#060a14", borderRight: "1px solid rgba(0,240,255,.15)", padding: "24px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
                <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(0,240,255,.1)" }}>
                    <Link href="/admin" style={{ textDecoration: "none", color: "#fff", fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem", letterSpacing: 2 }}>
                        <span style={{ color: "#ff2bd6" }}>{">"}</span> ADMIN <span style={{ color: "#00f0ff" }}>PANEL</span>
                    </Link>
                </div>
                <nav style={{ marginTop: 16 }}>
                    {NAV.map((n) => {
                        const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
                        return (
                            <Link
                                key={n.href}
                                href={n.href}
                                style={{
                                    display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", textDecoration: "none",
                                    color: active ? "#00f0ff" : "#8b94bb", fontSize: "0.85rem", letterSpacing: 1.5, fontWeight: 500,
                                    background: active ? "rgba(0,240,255,.08)" : "transparent",
                                    borderLeft: active ? "2px solid #00f0ff" : "2px solid transparent",
                                    transition: "all .2s",
                                }}
                            >
                                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{n.icon}</span>
                                {n.label}
                            </Link>
                        );
                    })}
                </nav>
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                    <button onClick={() => setShowPwModal(true)} style={{
                        textDecoration: "none", color: "#ffbd2e", background: "none", border: "none",
                        fontSize: "0.7rem", letterSpacing: 2, cursor: "pointer", textAlign: "left",
                        padding: "8px 0", fontFamily: "'Share Tech Mono', monospace",
                    }}>
                        ⚷ Şifre Değiştir
                    </button>
                    <button onClick={handleLogout} style={{
                        textDecoration: "none", color: "#ff5f56", background: "none", border: "none",
                        fontSize: "0.7rem", letterSpacing: 2, cursor: "pointer", textAlign: "left",
                        padding: "8px 0", fontFamily: "'Share Tech Mono', monospace",
                    }}>
                        ⏻ Çıkış Yap
                    </button>
                    <Link href="/" style={{ textDecoration: "none", color: "#8b94bb", fontSize: "0.7rem", letterSpacing: 2, display: "block", padding: "8px 0", borderTop: "1px solid rgba(0,240,255,.1)", marginTop: 4 }}>
                        ← Siteye Dön
                    </Link>
                </div>
            </aside>
            <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1100 }}>
                {children}
            </main>
        </div>
    );
}
