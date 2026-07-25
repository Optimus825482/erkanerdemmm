"use client";
import { useEffect, useState } from "react";

interface Message { id: number; name: string; email: string; subject: string; message: string; is_read: number; created_at: string; }

export default function MessagesAdmin() {
    const [list, setList] = useState<Message[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);

    const load = () => fetch("/api/messages").then((r) => r.json()).then(setList);
    useEffect(() => { load(); }, []);

    const open = async (id: number) => {
        setOpenId(id);
        await fetch(`/api/messages/${id}`);
        load();
    };

    const remove = async (id: number) => {
        if (!confirm("Silinecek?")) return;
        await fetch(`/api/messages/${id}`, { method: "DELETE" });
        setOpenId(null);
        load();
    };

    const openMsg = list.find((m) => m.id === openId);

    return (
        <div>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", letterSpacing: 3, marginBottom: 28 }}>MESAJLAR</h1>

            {openMsg && (
                <div style={{ background: "rgba(10,15,34,.8)", border: "1px solid rgba(0,240,255,.2)", padding: 24, marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                        <div>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem", letterSpacing: 1 }}>{openMsg.name}</div>
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "#00f0ff", marginTop: 4 }}>{openMsg.email}</div>
                            {openMsg.subject && <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "#8b94bb", marginTop: 4 }}>Konu: {openMsg.subject}</div>}
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#8b94bb", marginTop: 4 }}>{openMsg.created_at}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => setOpenId(null)} style={{ background: "transparent", color: "#8b94bb", border: "1px solid rgba(139,148,187,.3)", padding: "6px 14px", fontSize: "0.72rem", cursor: "pointer" }}>KAPAT</button>
                            <button onClick={() => remove(openMsg.id)} style={{ background: "transparent", color: "#ff5f56", border: "1px solid rgba(255,95,86,.3)", padding: "6px 14px", fontSize: "0.72rem", cursor: "pointer" }}>SİL</button>
                        </div>
                    </div>
                    <div style={{ padding: "16px", background: "rgba(8,12,26,.6)", border: "1px solid rgba(0,240,255,.1)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{openMsg.message}</div>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.map((m) => (
                    <div
                        key={m.id}
                        onClick={() => open(m.id)}
                        style={{
                            display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
                            background: m.is_read ? "rgba(10,15,34,.4)" : "rgba(10,15,34,.7)",
                            border: `1px solid ${m.is_read ? "rgba(0,240,255,.08)" : "rgba(0,240,255,.2)"}`,
                            cursor: "pointer", transition: ".2s",
                        }}
                    >
                        {!m.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8ff3e", boxShadow: "0 0 8px #c8ff3e", flexShrink: 0 }} />}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.82rem", letterSpacing: 1 }}>{m.name}</div>
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#8b94bb", marginTop: 4 }}>{m.subject || "Konu yok"} — {m.created_at}</div>
                        </div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem", color: "#00f0ff" }}>{m.email}</div>
                    </div>
                ))}
                {list.length === 0 && <div style={{ color: "#8b94bb", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.85rem", padding: 40, textAlign: "center" }}>Henüz mesaj yok</div>}
            </div>
        </div>
    );
}
