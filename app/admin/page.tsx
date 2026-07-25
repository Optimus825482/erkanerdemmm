"use client";
import { useEffect, useState } from "react";

interface Stats { projects: number; posts: number; messages: number; visitors: number }

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    useEffect(() => {
        Promise.all([
            fetch("/api/projects").then((r) => r.json()),
            fetch("/api/posts").then((r) => r.json()),
            fetch("/api/messages").then((r) => r.json()),
            fetch("/api/visitor").then((r) => r.json()),
        ]).then(([projects, posts, messages, visitors]) => {
            setStats({
                projects: projects.length,
                posts: posts.length,
                messages: messages.length,
                visitors: Array.isArray(visitors) ? visitors.length : 0,
            });
        });
    }, []);

    const cards = stats
        ? [
            { label: "Proje", value: stats.projects, color: "#00f0ff" },
            { label: "Yazı", value: stats.posts, color: "#ff2bd6" },
            { label: "Mesaj", value: stats.messages, color: "#c8ff3e" },
            { label: "Ziyaretçi", value: stats.visitors, color: "#ffbd2e" },
        ]
        : [];

    return (
        <div>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", letterSpacing: 3, marginBottom: 32 }}>
                DASHBOARD
            </h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
                {cards.map((c) => (
                    <div key={c.label} style={{ background: "rgba(10,15,34,.6)", border: "1px solid rgba(0,240,255,.15)", padding: "28px 24px", clipPath: "polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)" }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", color: c.color, textShadow: `0 0 16px ${c.color}55` }}>{c.value}</div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem", letterSpacing: 2, color: "#8b94bb", marginTop: 8 }}>{c.label.toUpperCase()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
