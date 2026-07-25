"use client";
import { useEffect, useState } from "react";

interface VisitorLog {
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

export default function VisitorsAdmin() {
    const [list, setList] = useState<VisitorLog[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);

    const load = () => fetch("/api/visitor").then((r) => r.json()).then(setList);
    useEffect(() => { load(); }, []);

    const openVisitor = list.find((v) => v.id === openId);

    const remove = async (id: number) => {
        if (!confirm("Bu kayıt silinecek, emin misin?")) return;
        await fetch(`/api/visitor/${id}`, { method: "DELETE" });
        setOpenId(null);
        load();
    };

    return (
        <div>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", letterSpacing: 3, marginBottom: 28 }}>
                ZİYARETÇİ KAYITLARI ({list.length})
            </h1>

            {openVisitor && (
                <div style={{ background: "rgba(10,15,34,.8)", border: "1px solid rgba(255,189,46,.2)", padding: 24, marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                        <div>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem", letterSpacing: 1 }}>{openVisitor.ip}</div>
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "#ffbd2e", marginTop: 4 }}>
                                {openVisitor.city}, {openVisitor.country} · {openVisitor.isp}
                            </div>
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#8b94bb", marginTop: 4 }}>{openVisitor.created_at}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => remove(openVisitor.id)} style={{ background: "transparent", color: "#ff5f56", border: "1px solid rgba(255,95,86,.3)", padding: "6px 14px", fontSize: "0.72rem", cursor: "pointer" }}>SİL</button>
                            <button onClick={() => setOpenId(null)} style={{ background: "transparent", color: "#8b94bb", border: "1px solid rgba(139,148,187,.3)", padding: "6px 14px", fontSize: "0.72rem", cursor: "pointer" }}>
                                KAPAT
                            </button>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "16px", background: "rgba(8,12,26,.6)", border: "1px solid rgba(255,189,46,.1)" }}>
                        {[
                            ["Tarayıcı", openVisitor.browser],
                            ["OS", openVisitor.os],
                            ["Cihaz", openVisitor.device_type],
                            ["Platform", openVisitor.platform],
                            ["Dil", openVisitor.language],
                            ["Ekran", openVisitor.screen],
                            ["Saat Dilimi", openVisitor.timezone],
                            ["Çekirdek", openVisitor.cores ? `${openVisitor.cores}` : "-"],
                            ["RAM", openVisitor.ram || "-"],
                            ["Bağlantı", openVisitor.connection_type || "-"],
                            ["Sayfa", openVisitor.page],
                            ["Referrer", openVisitor.referrer || "-"],
                            ["ISS", openVisitor.isp],
                            ["UA", openVisitor.user_agent],
                        ].map(([k, v]) => (
                            <div key={k as string} style={{ display: "flex", gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem" }}>
                                <span style={{ color: "#8b94bb" }}>{k as string}:</span>
                                <span style={{ color: "#e0e4f0", wordBreak: "break-all" }}>{v as string}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {list.map((v) => (
                    <div
                        key={v.id}
                        onClick={() => setOpenId(v.id)}
                        style={{
                            display: "flex", alignItems: "center", gap: 16, padding: "12px 16px",
                            background: openId === v.id ? "rgba(255,189,46,.1)" : "rgba(10,15,34,.4)",
                            border: `1px solid ${openId === v.id ? "rgba(255,189,46,.3)" : "rgba(0,240,255,.08)"}`,
                            cursor: "pointer", transition: ".2s",
                        }}
                    >
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.78rem", color: "#ffbd2e", minWidth: 130 }}>{v.ip}</div>
                        <div style={{ flex: 1, fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", letterSpacing: 1 }}>
                            {v.city || "..."}, {v.country || "..."}
                        </div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.68rem", color: "#8b94bb", minWidth: 60 }}>{v.os}</div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.68rem", color: "#8b94bb", minWidth: 70 }}>{v.browser}</div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.68rem", color: "#8b94bb", minWidth: 60 }}>{v.device_type}</div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#8b94bb", minWidth: 120, textAlign: "right" }}>{v.created_at?.split(" ")[1] || ""}</div>
                    </div>
                ))}
                {list.length === 0 && (
                    <div style={{ color: "#8b94bb", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.85rem", padding: 40, textAlign: "center" }}>
                        Henüz ziyaretçi kaydı yok
                    </div>
                )}
            </div>
        </div>
    );
}
