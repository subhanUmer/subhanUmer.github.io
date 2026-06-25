/* Subhan Umer — portfolio interactions */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) gsap.globalTimeline.timeScale(1000);

/* ── custom cursor ─────────────────────────── */
(() => {
  const dot = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  if (!dot || window.matchMedia("(hover: none)").matches) return;

  let x = innerWidth / 2, y = innerHeight / 2;
  let rx = x, ry = y;

  addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });

  (function raf() {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(raf);
  })();

  document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
  });
})();

/* ── magnetic elements ─────────────────────── */
document.querySelectorAll("[data-magnetic]").forEach((el) => {
  const strength = 0.35;
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * strength,
      y: (e.clientY - r.top - r.height / 2) * strength,
      duration: 0.4,
      ease: "power3.out",
    });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  });
});

/* ── text scramble ─────────────────────────── */
class Scramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#$%";
  }
  setText(newText) {
    const old = this.el.innerText;
    const length = Math.max(old.length, newText.length);
    this.queue = Array.from({ length }, (_, i) => ({
      from: old[i] || "",
      to: newText[i] || "",
      start: Math.floor(Math.random() * 30),
      end: Math.floor(Math.random() * 30) + 20,
    }));
    cancelAnimationFrame(this.raf);
    this.frame = 0;
    this.update();
  }
  update() {
    let out = "", done = 0;
    for (const q of this.queue) {
      if (this.frame >= q.end) { done++; out += q.to; }
      else if (this.frame >= q.start) {
        out += `<span style="opacity:.5">${this.chars[Math.floor(Math.random() * this.chars.length)]}</span>`;
      } else out += q.from;
    }
    this.el.innerHTML = out;
    if (done < this.queue.length) {
      this.frame++;
      this.raf = requestAnimationFrame(() => this.update());
    }
  }
}

const roles = [
  "application security engineer",
  "devsecops · ci/cd hardening",
  "cve researcher × 6 published",
  "vapt engineer @ snskies",
  "ctf player — #1 in pakistan",
];
const roleEl = document.getElementById("scrambleRole");
if (roleEl && !prefersReducedMotion) {
  const fx = new Scramble(roleEl);
  let i = 0;
  setInterval(() => {
    i = (i + 1) % roles.length;
    fx.setText(roles[i]);
  }, 3400);
}

/* ── preloader → hero intro ────────────────── */
const intro = gsap.timeline({ paused: true });
intro
  .from(".hero-title .word", { yPercent: 110, duration: 1.1, stagger: 0.12, ease: "power4.out" })
  .from(".reveal-chip", { y: 16, opacity: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" }, "-=0.7")
  .from(".hero-sub > *", { y: 24, opacity: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" }, "-=0.5")
  .from(".hero-stats .stat", { y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" }, "-=0.4")
  .from(".scroll-hint, .site-header", { opacity: 0, duration: 0.6 }, "-=0.3");

const preloader = document.getElementById("preloader");
if (prefersReducedMotion) {
  preloader.remove();
  intro.progress(1);
} else {
  document.body.style.overflow = "hidden";
  gsap.timeline({
    onComplete() {
      document.body.style.overflow = "";
      preloader.remove();
      intro.play();
    },
  })
    .to(".boot-line", { opacity: 1, stagger: 0.28, duration: 0.05 })
    .to(".preloader-bar span", { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "<0.2")
    .to(preloader, { yPercent: -100, duration: 0.8, ease: "power4.inOut", delay: 0.25 });
}

/* ── header behavior ───────────────────────── */
const header = document.getElementById("siteHeader");
let lastY = 0;
addEventListener("scroll", () => {
  const y = scrollY;
  header.classList.toggle("is-scrolled", y > 40);
  header.classList.toggle("is-hidden", y > 500 && y > lastY);
  lastY = y;
}, { passive: true });

/* ── scroll progress bar ───────────────────── */
gsap.to("#scrollProgress", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
});

/* ── mobile menu ───────────────────────────── */
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
const setMenu = (open) => {
  navToggle.setAttribute("aria-expanded", String(open));
  mobileMenu.classList.toggle("is-open", open);
  mobileMenu.setAttribute("aria-hidden", String(!open));
};
navToggle.addEventListener("click", () =>
  setMenu(navToggle.getAttribute("aria-expanded") !== "true")
);
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => setMenu(false))
);

/* ── scroll reveals ────────────────────────── */
document.querySelectorAll(".sec-title .line > span, .contact-title .line > span").forEach((el) => {
  gsap.from(el, {
    yPercent: 110,
    duration: 1,
    ease: "power4.out",
    scrollTrigger: { trigger: el, start: "top 88%" },
  });
});

document.querySelectorAll(".reveal-p, .sec-sub, .contact-sub, .contact-mail, .contact-links").forEach((el) => {
  gsap.from(el, {
    y: 36,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 88%" },
  });
});

document.querySelectorAll(".reveal-card").forEach((el, i) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    delay: (i % 3) * 0.1,
    ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 90%" },
  });
});

gsap.utils.toArray(".cve-card, .project-card").forEach((card, i) => {
  gsap.from(card, {
    y: 60,
    opacity: 0,
    duration: 0.85,
    delay: (i % 3) * 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: card, start: "top 92%" },
  });
});

gsap.utils.toArray(".t-item").forEach((item) => {
  gsap.from(item, {
    x: -40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: { trigger: item, start: "top 88%" },
  });
});

/* timeline progress line fills as you scroll */
gsap.to("#timelineProgress", {
  height: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: ".timeline",
    start: "top 75%",
    end: "bottom 60%",
    scrub: 0.5,
  },
});

/* ── animated counters ─────────────────────── */
document.querySelectorAll(".stat").forEach((stat) => {
  const numEl = stat.querySelector(".stat-num");
  const target = +stat.dataset.count;
  const prefix = stat.dataset.prefix || "";
  const suffix = stat.dataset.suffix || "";
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 1.6,
    ease: "power2.out",
    delay: prefersReducedMotion ? 0 : 1.8,
    onUpdate() { numEl.textContent = prefix + Math.round(obj.v) + suffix; },
    onComplete() { numEl.textContent = prefix + target + suffix; },
  });
});

/* ── card tilt + glow tracking ─────────────── */
if (!prefersReducedMotion && matchMedia("(hover: hover)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      gsap.to(card, {
        rotateY: (px - 0.5) * 7,
        rotateX: (0.5 - py) * 7,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
    });
  });
}

/* ── konami-lite easter egg: type "pwn" ────── */
let buffer = "";
addEventListener("keydown", (e) => {
  buffer = (buffer + e.key).slice(-3);
  if (buffer === "pwn") {
    document.documentElement.style.setProperty("--accent", "#ff4d4d");
    document.documentElement.style.setProperty("--accent-dim", "rgba(255,77,77,0.12)");
    setTimeout(() => {
      document.documentElement.style.setProperty("--accent", "#c6f24e");
      document.documentElement.style.setProperty("--accent-dim", "rgba(198,242,78,0.12)");
    }, 2000);
  }
});
