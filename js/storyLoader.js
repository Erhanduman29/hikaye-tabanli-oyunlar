let storyData = null;
let currentScene = "";
let score = 0;
let playerName = "";
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

async function loadStory(jsonPath) {
  const res = await fetch(jsonPath);
  storyData = await res.json();
  showWelcome();
  updateLeaderboard();
}

function showWelcome() {
  document.getElementById("welcome").style.display = "block";
  document.querySelector(".points").style.display = "none";
  document.getElementById("story").style.display = "none";
  document.getElementById("options").style.display = "none";
}

function startGame() {
  const name = document.getElementById("playerName").value.trim();
  if (name === "") { alert("İsmini gir lütfen"); return; }
  playerName = name;
  score = 0;
  currentScene = storyData.start;
  renderScene(currentScene);
  document.getElementById("welcome").style.display = "none";
  document.querySelector(".points").style.display = "block";
  document.getElementById("story").style.display = "block";
  document.getElementById("options").style.display = "block";
  document.getElementById("score").textContent = score;
}

function renderScene(key) {
  const scene = storyData.scenes[key];
  if (!scene) return;
  currentScene = key;
  let text = scene.text.replace("{score}", score);
  document.getElementById("story").textContent = text;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  if (scene.options) {
    scene.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.text;
      btn.onclick = () => {
        if (opt.points) {
          score += opt.points;
          document.getElementById("score").textContent = score;
        }
        if (opt.action) {
          handleAction(opt);
          return;
        }
        if (opt.next) renderScene(opt.next);
      }
      optionsDiv.appendChild(btn);
    });
  }
}

function handleAction(opt) {
  if (opt.action === "restart") {
    showWelcome();
    score = 0;
    document.getElementById("score").textContent = score;
    document.getElementById("playerName").value = "";
  } else if (opt.action === "redirect") {
    window.location.href = opt.target;
  }
}

function updateLeaderboard() {
  const list = document.getElementById("rankingList");
  list.innerHTML = "";
  leaderboard.forEach((e,i) => {
    const li = document.createElement("li");
    li.textContent = `${i+1}. ${e.name} - ${e.score} puan`;
    list.appendChild(li);
  });
}

function clearLeaderboard() {
  localStorage.removeItem("leaderboard");
  leaderboard = [];
  updateLeaderboard();
}

document.addEventListener("click", e => {
  if (e.target.textContent.includes("Skorunu Gör")) {
    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a,b)=>b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
  }
});
