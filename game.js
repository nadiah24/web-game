

const emojiList = ["🍓", "🍰", "🧁", "🍩", "🍒", "🍇", "🍉", "🍍", "🥝", "🍪"];
    let flippedCards = [];
    let matched = 0;
    let level = 1;
    let score = 0;

    const levelSpan = document.getElementById("level");
    const scoreSpan = document.getElementById("score");
    const board = document.getElementById("gameBoard");

    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    function getPairsForLevel(level) {
        if (level <= 2) return 2;
        return Math.min(emojiList.length, 4 + Math.floor((level - 3) / 5));
      }      


    function updateBoardSize(pairCount) {
      const totalCards = pairCount * 2;
      const columns = Math.ceil(Math.sqrt(totalCards));
      board.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
    }



    let timerDuration;   // durasi timer dalam detik (berubah tiap level)
let timerInterval;

const timerBar = document.getElementById("timerBar");
const timerText = document.getElementById("timerText");

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function startTimer() {
  clearInterval(timerInterval);
  let timeLeft = timerDuration;
  
  // Set timerBar full width di awal
  timerBar.style.width = "100%";
  timerText.textContent = formatTime(timeLeft);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = formatTime(timeLeft);
    const percent = (timeLeft / timerDuration) * 100;
    timerBar.style.width = percent + "%";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("⏰ Waktu habis! Ronde akan selesai.");
      level++;
      startLevel();
    }
  }, 1000);
}

// Update startLevel untuk set durasi timer tiap level dan start timer
function startLevel() {
  clearInterval(timerInterval);

  const pairs = getPairsForLevel(level);
  timerDuration = pairs * 10; // 10 detik per pasangan (bisa ubah sesuai preferensi)

  const colors = ["#ffe4ec", "#fff0f6", "#fff5f7", "#ffeef8", "#ffe0ec"];
  document.body.style.backgroundColor = colors[(level - 1) % colors.length];

  board.innerHTML = "";
  flippedCards = [];
  matched = 0;
  levelSpan.textContent = level;
  scoreSpan.textContent = score;

  const emojis = shuffle(emojiList).slice(0, pairs);
  const cards = shuffle([...emojis, ...emojis]);

  updateBoardSize(pairs);

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerText = "❓";

    card.addEventListener("click", () => {
      if (card.classList.contains("flipped") || card.classList.contains("matched") || flippedCards.length === 2) return;

      card.innerText = emoji;
      card.classList.add("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
          card1.classList.add("matched");
          card2.classList.add("matched");
          flippedCards = [];
          matched++;

          if (matched === pairs) {
            score += 1;
            clearInterval(timerInterval);
            setTimeout(() => {
              alert(`🎉 Ronde ${level} selesai!`);
              level++;
              startLevel();
            }, 600);
          }
        } else {
          setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.innerText = "❓";
            card2.innerText = "❓";
            flippedCards = [];
          }, 800);
        }
      }
    });

    board.appendChild(card);
  });

  startTimer();  // mulai timer setelah papan siap
}

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  level = 1;
  score = 0;
  startLevel();
});
