const hoseContainer = document.getElementById("hoseContainer");
const targetContainer = document.getElementById("targetContainer");
const badgeContainer = document.getElementById("badgeContainer");

const hoses = [
  { id: "hose1", col: 0 },
  { id: "hose2", col: 1 },
  { id: "hose3", col: 2 }
];

const couplingsOriginal = [
  { correct: "hose1", col: 0 },
  { correct: "hose2", col: 1 },
  { correct: "hose3", col: 2 }
];

let score = 0;
let correctMatches = 0;
let totalMatches = hoses.length;
let startTime = Date.now();

// Countdown
let seconds = 60;
const timer = document.getElementById("timer");
const interval = setInterval(() => {
  seconds--;
  timer.textContent = `⏱️ ${seconds}`;
  if (seconds <= 0) {
    clearInterval(interval);
    endGame();
  }
}, 1000);

// Shuffle-Funktion
function shuffle(array) {
  const copy = array.slice();
  let currentIndex = copy.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
  }
  return copy;
}

// Init Schläuche
hoses.forEach(hose => {
  const el = document.createElement("div");
  el.classList.add("source");
  el.id = hose.id;
  el.draggable = true;
  el.style.backgroundPosition = `-${hose.col * 100}px 0px`;
  hoseContainer.appendChild(el);
});

// Init Kupplungen (Ziele)
const shuffledCouplings = shuffle(couplingsOriginal);
shuffledCouplings.forEach(coupling => {
  const el = document.createElement("div");
  el.classList.add("target");
  el.dataset.correct = coupling.correct;
  el.style.backgroundPosition = `-${coupling.col * 100}px -100px`;
  targetContainer.appendChild(el);
});

// Drag & Drop
document.querySelectorAll(".source").forEach(source => {
  source.addEventListener("dragstart", e => {
    source.classList.add("dragging");
    e.dataTransfer.setData("text/plain", source.id);
  });
  source.addEventListener("dragend", () => {
    source.classList.remove("dragging");
  });
});

document.querySelectorAll(".target").forEach(target => {
  target.addEventListener("dragover", e => {
    e.preventDefault();
    target.classList.add("hover");
  });

  target.addEventListener("dragleave", () => {
    target.classList.remove("hover");
  });

  target.addEventListener("drop", e => {
    e.preventDefault();
    target.classList.remove("hover");
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedEl = document.getElementById(draggedId);

    if (draggedId === target.dataset.correct) {
      target.classList.add("done");
      draggedEl.style.visibility = "hidden";
      correctMatches++;
      score += 10;
      if (correctMatches === totalMatches) {
        clearInterval(interval);
        endGame();
      }
    } else {
      score -= 5;
      target.classList.add("wrong");
      setTimeout(() => target.classList.remove("wrong"), 1000);
    }
  });
});

// End Game & Badge-Vergabe
function endGame() {
  const endTime = Date.now();
  const duration = Math.floor((endTime - startTime) / 1000);
  const feedback = document.getElementById("feedback");
  feedback.textContent = `🧯 Spiel beendet! Punkte: ${score} – Zeit: ${duration}s`;

  // Badge 1: First Try
  addBadge("first");

  // Badge 2: Fast (< 20s)
  if (duration <= 20) addBadge("fast");

  // Badge 3: Perfect
  if (score === totalMatches * 10) addBadge("perfect");

  // Badge 4: High Score
  if (score >= 25) addBadge("score");
}

// Badge hinzufügen
function addBadge(type) {
  const el = document.createElement("div");
  el.classList.add("badge", type);

  // Tooltip-Texte
  const titles = {
    fast: "Schnell: unter 20 Sekunden",
    perfect: "Perfekt: keine Fehler",
    first: "Erste Runde geschafft!",
    score: "Punkte-Meister: ≥ 25"
  };

  el.title = titles[type] || "Abzeichen";
  badgeContainer.appendChild(el);
}
