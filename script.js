// クイズ問題データ（answer は choices の正解インデックス）
const QUIZ_DATA = [
  {
    question: "1年のうち、日数が最も少ない月はどれ？",
    choices: ["1月", "2月", "4月", "11月"],
    answer: 1,
  },
  {
    question: "信号機の「止まれ」を表す色はどれ？",
    choices: ["青", "黄", "赤", "白"],
    answer: 2,
  },
  {
    question: "日本で一番高い山はどれ？",
    choices: ["北岳", "槍ヶ岳", "富士山", "奥穂高岳"],
    answer: 2,
  },
  {
    question: "水が沸騰する温度（1気圧のとき）はおよそ何度？",
    choices: ["50℃", "80℃", "100℃", "150℃"],
    answer: 2,
  },
  {
    question: "1時間は何秒？",
    choices: ["600秒", "1,800秒", "3,600秒", "6,000秒"],
    answer: 2,
  },
  {
    question: "日本で一般的に虹は何色といわれている？",
    choices: ["7色", "5色", "6色", "8色"],
    answer: 0,
  },
  {
    question: "日本の国鳥はどれ？",
    choices: ["スズメ", "ツル", "ハト", "キジ"],
    answer: 3,
  },
  {
    question: "太陽が沈む方角はどれ？",
    choices: ["東", "西", "南", "北"],
    answer: 1,
  },
  {
    question: "サッカーで1チームがフィールドに出られる人数は？",
    choices: ["11人", "9人", "10人", "12人"],
    answer: 0,
  },
  {
    question: "うるう年の2月は何日まである？",
    choices: ["28日", "30日", "31日", "29日"],
    answer: 3,
  },
];

// DOM 要素
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const retryButton = document.getElementById("retry-button");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const scoreText = document.getElementById("score-text");
const resultMessage = document.getElementById("result-message");
const bunny = document.getElementById("bunny");

// 状態
let currentIndex = 0;
let score = 0;

// 指定した画面だけを表示する
function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach((s) => {
    s.hidden = s !== screen;
  });
}

// クイズを最初から開始する
function startQuiz() {
  currentIndex = 0;
  score = 0;
  showScreen(quizScreen);
  showQuestion();
}

// 現在の問題を表示する
function showQuestion() {
  const quiz = QUIZ_DATA[currentIndex];

  progressText.textContent = `第${currentIndex + 1}問 / 全${QUIZ_DATA.length}問`;
  progressFill.style.width = `${(currentIndex / QUIZ_DATA.length) * 100}%`;
  questionText.textContent = quiz.question;

  feedback.textContent = "";
  feedback.className = "feedback";
  nextButton.hidden = true;

  choicesContainer.replaceChildren();
  quiz.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice;
    button.addEventListener("click", () => selectAnswer(index));
    choicesContainer.appendChild(button);
  });
}

// 回答を判定してフィードバックを表示する
function selectAnswer(selectedIndex) {
  const quiz = QUIZ_DATA[currentIndex];
  const buttons = choicesContainer.querySelectorAll(".choice-button");
  const isCorrect = selectedIndex === quiz.answer;

  // 回答後は選択肢を押せないようにし、正解を強調する
  buttons.forEach((button) => {
    button.disabled = true;
  });
  buttons[quiz.answer].classList.add("correct");

  if (isCorrect) {
    score++;
    feedback.textContent = "⭕ 正解！";
    feedback.classList.add("correct");
  } else {
    buttons[selectedIndex].classList.add("wrong");
    feedback.textContent = `❌ 不正解… 正解は「${quiz.choices[quiz.answer]}」です。`;
    feedback.classList.add("wrong");
  }

  progressFill.style.width = `${((currentIndex + 1) / QUIZ_DATA.length) * 100}%`;
  nextButton.textContent = currentIndex === QUIZ_DATA.length - 1 ? "結果を見る" : "次の問題へ";
  nextButton.hidden = false;
  nextButton.focus();
}

// 次の問題へ進む、または結果を表示する
function goNext() {
  currentIndex++;
  if (currentIndex < QUIZ_DATA.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// 結果画面を表示する
function showResult() {
  showScreen(resultScreen);
  scoreText.textContent = `${QUIZ_DATA.length}問中${score}問正解`;

  // 正解率に応じてランクを決め、うさぎの表情とメッセージを切り替える
  const rate = score / QUIZ_DATA.length;
  let rank;
  if (rate === 1) {
    rank = "perfect";
    resultMessage.textContent = "全問正解！うさぎも大よろこび！";
  } else if (rate >= 0.7) {
    rank = "good";
    resultMessage.textContent = "すごい！あと少しで全問正解です。";
  } else if (rate >= 0.4) {
    rank = "average";
    resultMessage.textContent = "なかなかの結果！次はもっと上を目指そう。";
  } else {
    rank = "low";
    resultMessage.textContent = "うさぎがしょんぼり…もう一度挑戦してみよう！";
  }
  bunny.dataset.rank = rank;
}

startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", goNext);
retryButton.addEventListener("click", startQuiz);
