import { easingPreset } from "@kratefastmotion/shared";
import { draft, kf, type TemplateDef } from "./helper.js";

/**
 * Crystal Cascade — an entrance built as a descending staircase of crystal
 * shards. Each shard drops from above in a staggered wave, locks into its
 * step with a springy overshoot, and a refraction sweep passes through the
 * finished formation.
 */
export const crystalCascadeTemplate: TemplateDef = {
  id: "tpl-crystal-cascade",
  name: "Crystal Cascade",
  category: "entrance",
  description:
    "Cascading crystal entrance where faceted shards fall from above in a staggered staircase, snap into place with a springy overshoot, then catch a travelling refraction sweep across the formation.",
  tags: ["crystal", "cascade", "shard", "stagger", "drop", "refraction", "geometric", "entrance"],
  build: () => [
    // Dark stage with a cold vertical gradient
    draft("Cascade Stage", {
      durationMs: 1800,
      easing: easingPreset("ease-out"),
      fillMode: "forwards",
      keyframes: [kf(0, { opacity: 0 }), kf(0.2, { opacity: 1 }), kf(1, { opacity: 1 })],
      style: {
        _content: "",
        _tag: "div",
        width: "320px",
        height: "320px",
        background: "linear-gradient(180deg, #0b1020 0%, #07080f 100%)",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        perspective: "800px",
        transformStyle: "preserve-3d",
      },
    }),

    // Fall guide — faint column the shards travel down
    draft("Fall Guide", {
      durationMs: 1400,
      easing: easingPreset("ease-out"),
      keyframes: [
        kf(0, { opacity: 0, scaleY: 0 }),
        kf(0.4, { opacity: 0.35, scaleY: 1 }),
        kf(1, { opacity: 0, scaleY: 1 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "1px",
        height: "240px",
        background: "linear-gradient(180deg, transparent 0%, rgba(150,200,255,0.5) 50%, transparent 100%)",
        position: "absolute",
        top: "40px",
        left: "50%",
        marginLeft: "-0.5px",
        transformOrigin: "top center",
      },
    }),

    // Shard 1 — top step
    draft("Cascade Shard 1", {
      durationMs: 900,
      delayMs: 150,
      easing: easingPreset("back"),
      fillMode: "forwards",
      keyframes: [
        kf(0, { opacity: 0, translateY: -180, scale: 0.4, rotate: -30 }),
        kf(0.6, { opacity: 1, translateY: 12, scale: 1.08, rotate: 4 }),
        kf(0.8, { opacity: 1, translateY: -4, scale: 0.98, rotate: -1 }),
        kf(1, { opacity: 1, translateY: 0, scale: 1, rotate: 0 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "72px",
        height: "72px",
        background: "linear-gradient(135deg, rgba(200,230,255,0.95) 0%, rgba(120,160,255,0.55) 100%)",
        clipPath: "polygon(50% 0%, 100% 38%, 78% 100%, 22% 100%, 0% 38%)",
        position: "absolute",
        top: "48px",
        left: "50%",
        marginLeft: "-36px",
        boxShadow: "0 0 28px rgba(150,200,255,0.45)",
        filter: "drop-shadow(0 0 6px rgba(180,220,255,0.5))",
      },
    }),

    // Shard 2 — left of the second step
    draft("Cascade Shard 2", {
      durationMs: 900,
      delayMs: 300,
      easing: easingPreset("back"),
      fillMode: "forwards",
      keyframes: [
        kf(0, { opacity: 0, translateX: -60, translateY: -180, scale: 0.4, rotate: -45 }),
        kf(0.6, { opacity: 1, translateX: -6, translateY: 10, scale: 1.06, rotate: 6 }),
        kf(0.8, { opacity: 1, translateX: 2, translateY: -3, scale: 0.99, rotate: -1 }),
        kf(1, { opacity: 1, translateX: 0, translateY: 0, scale: 1, rotate: 0 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "58px",
        height: "58px",
        background: "linear-gradient(135deg, rgba(190,225,255,0.85) 0%, rgba(105,145,245,0.45) 100%)",
        clipPath: "polygon(50% 0%, 100% 42%, 76% 100%, 24% 100%, 0% 42%)",
        position: "absolute",
        top: "132px",
        left: "50%",
        marginLeft: "-92px",
        boxShadow: "0 0 22px rgba(140,190,255,0.4)",
        filter: "drop-shadow(0 0 5px rgba(170,210,255,0.45))",
      },
    }),

    // Shard 3 — right of the second step
    draft("Cascade Shard 3", {
      durationMs: 900,
      delayMs: 420,
      easing: easingPreset("back"),
      fillMode: "forwards",
      keyframes: [
        kf(0, { opacity: 0, translateX: 60, translateY: -180, scale: 0.4, rotate: 40 }),
        kf(0.6, { opacity: 1, translateX: 6, translateY: 10, scale: 1.06, rotate: -6 }),
        kf(0.8, { opacity: 1, translateX: -2, translateY: -3, scale: 0.99, rotate: 1 }),
        kf(1, { opacity: 1, translateX: 0, translateY: 0, scale: 1, rotate: 0 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "46px",
        height: "46px",
        background: "linear-gradient(135deg, rgba(180,220,255,0.8) 0%, rgba(95,135,235,0.4) 100%)",
        clipPath: "polygon(50% 0%, 100% 42%, 76% 100%, 24% 100%, 0% 42%)",
        position: "absolute",
        top: "140px",
        left: "50%",
        marginLeft: "44px",
        boxShadow: "0 0 18px rgba(130,180,250,0.38)",
        filter: "drop-shadow(0 0 5px rgba(160,200,255,0.4))",
      },
    }),

    // Shard 4 — bottom step, the anchor of the formation
    draft("Cascade Shard 4", {
      durationMs: 1000,
      delayMs: 560,
      easing: easingPreset("back"),
      fillMode: "forwards",
      keyframes: [
        kf(0, { opacity: 0, translateY: -200, scale: 0.35, rotate: 25 }),
        kf(0.62, { opacity: 1, translateY: 14, scale: 1.1, rotate: -5 }),
        kf(0.82, { opacity: 1, translateY: -5, scale: 0.97, rotate: 2 }),
        kf(1, { opacity: 1, translateY: 0, scale: 1, rotate: 0 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "96px",
        height: "96px",
        background: "linear-gradient(135deg, rgba(215,240,255,1) 0%, rgba(130,170,255,0.6) 55%, rgba(80,110,220,0.35) 100%)",
        clipPath: "polygon(50% 0%, 100% 38%, 78% 100%, 22% 100%, 0% 38%)",
        position: "absolute",
        top: "196px",
        left: "50%",
        marginLeft: "-48px",
        boxShadow: "0 0 36px rgba(160,205,255,0.5)",
        filter: "drop-shadow(0 0 8px rgba(190,225,255,0.55))",
      },
    }),

    // Refraction sweep — light passes across the settled formation
    draft("Refraction Sweep", {
      durationMs: 1600,
      delayMs: 900,
      easing: easingPreset("ease-in-out"),
      keyframes: [
        kf(0, { opacity: 0, translateX: -180 }),
        kf(0.35, { opacity: 0.75, translateX: 0 }),
        kf(0.7, { opacity: 0.5, translateX: 140 }),
        kf(1, { opacity: 0, translateX: 220 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "90px",
        height: "320px",
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 45%, rgba(200,230,255,0.5) 50%, rgba(255,255,255,0.28) 55%, transparent 100%)",
        position: "absolute",
        top: "0",
        left: "50%",
        marginLeft: "-45px",
        transform: "skewX(-12deg)",
        mixBlendMode: "screen",
        pointerEvents: "none",
      },
    }),

    // Settle glow — the formation exhales once it is complete
    draft("Settle Glow", {
      durationMs: 1400,
      delayMs: 900,
      easing: easingPreset("ease-out"),
      fillMode: "forwards",
      keyframes: [kf(0, { opacity: 0, scale: 0.6 }), kf(0.5, { opacity: 0.5, scale: 1.2 }), kf(1, { opacity: 0.22, scale: 1.5 })],
      style: {
        _content: "",
        _tag: "div",
        width: "240px",
        height: "240px",
        background: "radial-gradient(circle, rgba(150,205,255,0.55) 0%, transparent 68%)",
        borderRadius: "50%",
        position: "absolute",
        top: "112px",
        left: "50%",
        marginLeft: "-120px",
        pointerEvents: "none",
      },
    }),
  ],
};
