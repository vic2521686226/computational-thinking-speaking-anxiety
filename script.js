(() => {
  const external = document.getElementById("external");
  const self = document.getElementById("self");
  const eyeExternal = document.getElementById("eyeExternal");
  const eyeSelf = document.getElementById("eyeSelf");
  const heart = document.getElementById("heart");
  const bpmOutput = document.getElementById("bpm");
  const breathOutput = document.getElementById("breath");
  const externalOutput = document.getElementById("externalValue");
  const selfOutput = document.getElementById("selfValue");

  let heartOffset = 0;
  let breathOffset = 0;
  let bpm = 0;
  let breathing = 0;
  const started = performance.now();

  const clamp = (value, minimum, maximum) =>
    Math.min(maximum, Math.max(minimum, value));

  function update() {
    const externalLevel = Number(external.value);
    const selfLevel = Number(self.value);
    const combinedLevel = (externalLevel + selfLevel) / 2;

    externalOutput.value = `${externalLevel}%`;
    externalOutput.textContent = `${externalLevel}%`;
    selfOutput.value = `${selfLevel}%`;
    selfOutput.textContent = `${selfLevel}%`;

    // Each eye grows as its anxiety source rises. Their inner edges move closer together.
    const externalSize = 62 + externalLevel * 0.76;
    const selfSize = 62 + selfLevel * 0.76;

    eyeExternal.style.width = `${externalSize}px`;
    eyeExternal.style.height = `${externalSize * 0.67}px`;
    eyeSelf.style.width = `${selfSize}px`;
    eyeSelf.style.height = `${selfSize * 0.67}px`;

    const overlap = clamp((combinedLevel - 24) / 76, 0, 1);
    eyeExternal.style.marginRight = `${overlap * 13}px`;
    eyeSelf.style.marginLeft = `${overlap * 13}px`;

    // Anxiety drives illustrative rates; keyboard offsets let the user fine-tune them.
    const automaticBpm = 62 + combinedLevel * 0.5;
    const automaticBreathing = 10 + combinedLevel * 0.11;
    bpm = clamp(automaticBpm + heartOffset, 45, 150);
    breathing = clamp(automaticBreathing + breathOffset, 6, 30);

    bpmOutput.textContent = bpm.toFixed(0);
    breathOutput.textContent = breathing.toFixed(1);
    heart.dataset.anxiety = combinedLevel.toFixed(0);
  }

  [external, self].forEach((slider) => slider.addEventListener("input", update));

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.matches("input, button, select, textarea, [contenteditable=true]")
    ) {
      return;
    }

    const step = event.shiftKey ? 5 : 2;
    if (event.key === "ArrowUp") {
      heartOffset += step;
      event.preventDefault();
      update();
    } else if (event.key === "ArrowDown") {
      heartOffset -= step;
      event.preventDefault();
      update();
    } else if (event.key === "ArrowRight") {
      breathOffset += step * 0.5;
      event.preventDefault();
      update();
    } else if (event.key === "ArrowLeft") {
      breathOffset -= step * 0.5;
      event.preventDefault();
      update();
    }
  });

  function animate(now) {
    const elapsed = (now - started) / 1000;
    const beat = Math.sin((elapsed * Math.PI * 2 * bpm) / 60);
    const inhale = Math.sin((elapsed * Math.PI * 2 * breathing) / 60);
    const anxiety = Number(heart.dataset.anxiety || 0) / 100;
    const lift = Math.max(0, beat) * (5 + anxiety * 8);
    const scale =
      1 + inhale * (0.025 + anxiety * 0.035) + Math.max(0, beat) * 0.025;

    heart.style.transform = `translateY(${-lift.toFixed(2)}px) scale(${scale.toFixed(3)})`;
    requestAnimationFrame(animate);
  }

  update();
  requestAnimationFrame(animate);
})();
