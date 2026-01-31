"use client";

import { useEffect, useRef, useState } from "react";

export default function BirthdayPage() {
  // 🔒 TÊN + LỜI CHÚC MẶC ĐỊNH (CHỈ SỬA Ở ĐÂY)
  const RECEIVER_NAME = "Mai";
  const WISH_TEXT = "Chúc Mai tuổi mới luôn vui vẻ, xinh đẹp và đạt nhiều thành công trong cuộc sống 💖";

  const [blown, setBlown] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // ===== CONFETTI =====
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    }
    resize();
    window.addEventListener("resize", resize);

    let pieces = [];
    const gravity = 0.06 * dpr;

    function spawn(n = 200) {
      const w = canvas.width;
      for (let i = 0; i < n; i++) {
        pieces.push({
          x: Math.random() * w,
          y: -20 * dpr,
          vx: (Math.random() * 2 - 1) * dpr,
          vy: (Math.random() * 3 + 2) * dpr,
          size: (Math.random() * 8 + 4) * dpr,
          rot: Math.random() * Math.PI,
          vr: Math.random() * 0.2 - 0.1,
          life: Math.random() * 120 + 120,
          hue: Math.random() * 360,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.rot += p.vr;
        p.life--;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `hsl(${p.hue} 90% 60%)`;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();

        if (p.y > canvas.height + 60 * dpr || p.life <= 0) {
          pieces.splice(i, 1);
        }
      }
      requestAnimationFrame(draw);
    }

    window.__spawnConfetti = (n = 260) => spawn(n);
    spawn(140);
    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  // ===== MUSIC (Happy Birthday MP3) =====
  const toggleMusic = async () => {
    if (!audioRef.current) return;
    try {
      if (!musicOn) {
        audioRef.current.volume = 0.8;
        audioRef.current.loop = true;
        await audioRef.current.play();
        setMusicOn(true);
      } else {
        audioRef.current.pause();
        setMusicOn(false);
      }
    } catch {}
  };

  // ===== THỔI NẾN =====
  const blowCandles = async () => {
    setBlown(true);
    window.__spawnConfetti?.(320);

    if (audioRef.current && !musicOn) {
      try {
        audioRef.current.volume = 0.8;
        audioRef.current.loop = true;
        await audioRef.current.play();
        setMusicOn(true);
      } catch {}
    }

    setTimeout(() => {
      setShowGift(true);
    }, 600);
  };

  return (
    <main className="wrap">
      <canvas ref={canvasRef} className="confetti" />

      <section className="card">
        <div className="badge">🎂 Happy Birthday</div>

        <h1 className="title">
          Chúc mừng sinh nhật, {RECEIVER_NAME}! 🎉
        </h1>
        <p className="subtitle">{WISH_TEXT}</p>

        <div className="cake">
          <div className="plate" />
          <div className="base" />
          <div className="icing" />
          <div className={`candles ${blown ? "blown" : ""}`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="candle">
                <span className="flame" />
              </div>
            ))}
          </div>
        </div>

        {showGift && (
          <div className="gift">
            <div className="gift-label">🎁 Món quà dành cho bạn</div>
            <img src="/gift.jpg" alt="Birthday Gift" className="gift-img" />
          </div>
        )}

        <div className="row">
          <button className="btn primary" onClick={blowCandles}>
            💨 Thổi nến
          </button>
          <button className="btn" onClick={() => window.__spawnConfetti?.()}>
            🎊 Confetti
          </button>
          <button className="btn" onClick={toggleMusic}>
            {musicOn ? "🔇 Tắt nhạc" : "🎵 Happy Birthday"}
          </button>
        </div>

        <audio ref={audioRef} src="/happy-birthday.mp3" />
      </section>
    </main>
  );
}
