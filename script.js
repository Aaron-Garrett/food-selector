(function () {
  "use strict";

  // ---- Data: restaurant, wheel color, and a fun result line ----
  const OPTIONS = [
    { name: "Opa",             color: "var(--seg-1)", line: "Opa! Time to go Greek." },
    { name: "Steak n Shake",   color: "var(--seg-2)", line: "Steakburger, hand-dipped shake, don't overthink it." },
    { name: "A1 Steakhouse",   color: "var(--seg-3)", line: "Steak your claim on dinner." },
    { name: "El Toro",         color: "var(--seg-4)", line: "\u00a1Ol\u00e9! Tacos and margaritas await." },
    { name: "Thai Orchid",     color: "var(--seg-5)", line: "Spice things up, Thai-style." },
    { name: "Chili's",         color: "var(--seg-6)", line: "Baby back ribs are calling your name." },
    { name: "Chipotle",        color: "var(--seg-7)", line: "Burrito bowl, extra guac. Let's go." }
  ];

  const wheelEl = document.getElementById("wheel");
  const hubEl = document.getElementById("hub");
  const againEl = document.getElementById("again");
  const resultNameEl = document.getElementById("result-name");
  const resultLineEl = document.getElementById("result-line");
  const confettiLayer = document.getElementById("confetti-layer");

  const segCount = OPTIONS.length;
  const segAngle = 360 / segCount;

  let currentRotation = 0;
  let spinning = false;

  // ---- Build the wheel: conic-gradient background + radial text labels ----
  function buildWheel() {
    const stops = OPTIONS.map((opt, i) => {
      const start = (i * segAngle).toFixed(3);
      const end = ((i + 1) * segAngle).toFixed(3);
      return `${opt.color} ${start}deg ${end}deg`;
    }).join(", ");

    // "from 0deg" = gradient starts at 12 o'clock and proceeds clockwise,
    // matching the angle convention used for the pointer + labels below.
    wheelEl.style.background = `conic-gradient(from 0deg, ${stops})`;

    OPTIONS.forEach((opt, i) => {
      const mid = i * segAngle + segAngle / 2;
      const label = document.createElement("div");
      label.className = "wheel-label";
      // rotate(mid - 90) because the label div's own 0deg points to 3 o'clock;
      // subtracting 90 realigns it with the "0deg = 12 o'clock, clockwise" system.
      label.style.transform = `rotate(${mid - 90}deg)`;

      const span = document.createElement("span");
      span.textContent = opt.name;
      label.appendChild(span);
      wheelEl.appendChild(label);
    });
  }

  // ---- Spin ----
  function spin() {
    if (spinning) return;
    spinning = true;
    hubEl.setAttribute("disabled", "true");
    againEl.hidden = true;
    resultNameEl.textContent = "\u00a0";
    resultLineEl.textContent = "\u00a0";

    const targetIndex = Math.floor(Math.random() * segCount);
    const thetaMid = targetIndex * segAngle + segAngle / 2;

    // We want thetaMid (measured from 12 o'clock, clockwise) to end up under
    // the fixed pointer at the top after rotating the wheel by R degrees:
    // (thetaMid + R) mod 360 === 0  ->  R mod 360 === (360 - thetaMid) mod 360
    const desiredMod = (360 - thetaMid) % 360;
    const currentMod = ((currentRotation % 360) + 360) % 360;
    const delta = (desiredMod - currentMod + 360) % 360;

    const extraSpins = 6 * 360; // visual flourish
    // Small random wobble within the segment so it doesn't always land dead-center
    const wobble = (Math.random() - 0.5) * (segAngle * 0.5);

    currentRotation += extraSpins + delta - wobble;

    wheelEl.classList.add("spinning");
    wheelEl.style.transform = `rotate(${currentRotation}deg)`;

    window.setTimeout(() => {
      spinning = false;
      hubEl.removeAttribute("disabled");
      revealResult(OPTIONS[targetIndex]);
    }, 4300);
  }

  function revealResult(option) {
    resultNameEl.textContent = option.name;
    resultLineEl.textContent = option.line;
    againEl.hidden = false;
    burstConfetti(option.color);
  }

  // ---- Confetti ----
  function burstConfetti(color) {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(color.replace("var(", "").replace(")", "")) || "#f4a300";
    const palette = [resolved.trim(), "#fff6e9", "#f4a300"];

    for (let i = 0; i < 26; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = palette[i % palette.length];
      piece.style.animation = `confetti-fall ${1.4 + Math.random() * 1.1}s ease-in forwards`;
      piece.style.animationDelay = Math.random() * 0.3 + "s";
      confettiLayer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 3200);
    }
  }

  hubEl.addEventListener("click", spin);
  againEl.addEventListener("click", spin);

  buildWheel();
})();
