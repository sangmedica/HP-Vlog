const QUIZ_ROOT_NAMES = ["忘れがちな単語", "接頭語・接尾語・連結語", "便利なフレーズ"];
const REFERENCE_VOCAB_ROOT_NAMES = ["発音"];
const MAX_QUESTIONS = 20;
const WRONG_STORE_KEY = "eigo-web-wrong-answers-v1";
const HALL_OF_FAME_THRESHOLD = 3;

const root = document.getElementById("view-root");

let allVocab = [];
let distractorsMap = {};
let referenceTopics = [];
let quizRoot = null;
let referenceVocabRoot = null;

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function encodePath(path) {
  return path.map(encodeURIComponent).join("/");
}
function decodePath(encoded) {
  if (!encoded) return [];
  return encoded.split("/").map(decodeURIComponent);
}

/* ---------- Category tree ---------- */
function makeNode(name, parentPath) {
  return {
    name,
    fullPath: parentPath.concat(name),
    children: new Map(),
    items: []
  };
}
function buildTree(items) {
  const rootNode = makeNode("root", []);
  rootNode.fullPath = [];
  for (const item of items) {
    let node = rootNode;
    for (const segment of item.category_path) {
      if (!node.children.has(segment)) {
        node.children.set(segment, makeNode(segment, node.fullPath));
      }
      node = node.children.get(segment);
    }
    node.items.push(item);
  }
  return rootNode;
}
function allItemsRecursive(node) {
  let result = node.items.slice();
  for (const child of node.children.values()) {
    result = result.concat(allItemsRecursive(child));
  }
  return result;
}
function itemCountRecursive(node) {
  return allItemsRecursive(node).length;
}
function findNode(rootNode, path) {
  let node = rootNode;
  for (const seg of path) {
    node = node.children.get(seg);
    if (!node) return null;
  }
  return node;
}

/* ---------- Wrong answer store (localStorage) ---------- */
function loadWrongCounts() {
  try {
    return JSON.parse(localStorage.getItem(WRONG_STORE_KEY)) || {};
  } catch {
    return {};
  }
}
function saveWrongCounts(counts) {
  try { localStorage.setItem(WRONG_STORE_KEY, JSON.stringify(counts)); } catch {}
}
function recordWrong(id) {
  const counts = loadWrongCounts();
  counts[id] = (counts[id] || 0) + 1;
  saveWrongCounts(counts);
}
function clearItem(id) {
  const counts = loadWrongCounts();
  if (counts[id] != null) {
    delete counts[id];
    saveWrongCounts(counts);
  }
}
function reviewIds() {
  const counts = loadWrongCounts();
  return Object.keys(counts).filter((k) => counts[k] >= 1 && counts[k] < HALL_OF_FAME_THRESHOLD).map(Number);
}
function hallOfFameIds() {
  const counts = loadWrongCounts();
  return Object.keys(counts).filter((k) => counts[k] >= HALL_OF_FAME_THRESHOLD).map(Number);
}
function itemsById(ids) {
  const set = new Set(ids);
  return allVocab.filter((v) => set.has(v.id));
}

/* ---------- Quiz question building ---------- */
function pickDistractors(target, allItems) {
  const result = [];
  const used = new Set([target.japanese]);

  const curated = distractorsMap[String(target.id)];
  if (curated) {
    for (const d of curated) {
      if (result.length >= 3) break;
      if (d && !used.has(d)) { result.push(d); used.add(d); }
    }
  }

  function addFrom(candidates) {
    if (result.length >= 3) return;
    const shuffled = candidates.slice().sort(() => Math.random() - 0.5);
    for (const item of shuffled) {
      if (result.length >= 3) break;
      if (used.has(item.japanese)) continue;
      result.push(item.japanese);
      used.add(item.japanese);
    }
  }

  const pathKey = (p) => p.join("␟");
  addFrom(allItems.filter((it) => pathKey(it.category_path) === pathKey(target.category_path)));
  if (result.length < 3 && target.category_path.length > 1) {
    const parent = target.category_path.slice(0, -1);
    addFrom(allItems.filter((it) => pathKey(it.category_path.slice(0, -1)) === pathKey(parent)));
  }
  if (result.length < 3 && target.category_path.length > 0) {
    const top = target.category_path[0];
    addFrom(allItems.filter((it) => it.category_path[0] === top));
  }
  addFrom(allItems);

  return result.slice(0, 3);
}

function buildQuestions(pool, fallbackPool) {
  const seenJa = new Set();
  const distinct = [];
  for (const it of pool) {
    if (!seenJa.has(it.japanese)) { seenJa.add(it.japanese); distinct.push(it); }
  }
  const targets = distinct.sort(() => Math.random() - 0.5).slice(0, MAX_QUESTIONS);

  const allIds = new Set();
  const allItems = [];
  for (const it of pool.concat(fallbackPool)) {
    if (!allIds.has(it.id)) { allIds.add(it.id); allItems.push(it); }
  }

  return targets.map((target) => {
    const wrong = pickDistractors(target, allItems);
    const choices = wrong.concat([target.japanese]).sort(() => Math.random() - 0.5);
    return { target, choices, correctIndex: choices.indexOf(target.japanese) };
  });
}

/* ---------- Audio ---------- */
function playAudio(file) {
  if (!file) return;
  new Audio("audio/" + encodeURIComponent(file)).play().catch(() => {});
}

/* ---------- Rendering helpers ---------- */
function vocabRowHtml(item, trailingLabel) {
  return `
    <div class="vocab-row">
      <div class="vocab-main">
        <div class="vocab-en">${escapeHtml(item.english)}</div>
        ${item.pronunciation ? `<div class="vocab-pron">${escapeHtml(item.pronunciation)}</div>` : ""}
        <div class="vocab-ja">${escapeHtml(item.japanese)}</div>
        ${trailingLabel ? `<div class="vocab-trailing">${escapeHtml(trailingLabel)}</div>` : ""}
      </div>
      ${item.audio_file ? `<button class="audio-btn" data-audio="${escapeHtml(item.audio_file)}" aria-label="発音を再生">&#128266;</button>` : ""}
    </div>
  `;
}

function attachAudioButtons(container) {
  container.querySelectorAll(".audio-btn").forEach((btn) => {
    btn.addEventListener("click", () => playAudio(btn.getAttribute("data-audio")));
  });
}

function backRow(label, href) {
  return `<div class="back-row"><button class="back-btn" onclick="location.hash='${href}'">&larr; ${escapeHtml(label)}</button></div>`;
}

/* ---------- Views ---------- */
function renderHome() {
  const reviewCount = reviewIds().length;
  const hallCount = hallOfFameIds().length;

  let html = `<div class="section-label">試験問題</div><div class="card-list">`;
  for (const name of QUIZ_ROOT_NAMES) {
    const node = quizRoot.children.get(name);
    const count = node ? itemCountRecursive(node) : 0;
    html += `
      <button class="card" onclick="location.hash='#/category/quiz/${encodeURIComponent(name)}'">
        <div class="card-row"><span class="card-title">${escapeHtml(name)}</span><span class="card-count">${count}件</span></div>
      </button>`;
  }
  html += `</div>`;

  html += `
    <div class="section-label">復習・記録</div>
    <div class="card-list">
      <button class="card" onclick="location.hash='#/review'">
        <div class="card-row"><span class="card-title">復習問題</span></div>
        <div class="card-sub">間違えた問題(${reviewCount}件) - 正解すると一覧から消えます</div>
      </button>
      <button class="card" onclick="location.hash='#/hall-of-fame'">
        <div class="card-row"><span class="card-title">殿堂入り問題</span></div>
        <div class="card-sub">3回間違えた問題(${hallCount}件)</div>
      </button>
    </div>`;

  html += `
    <div class="section-label">検索</div>
    <div class="card-list">
      <button class="card" onclick="location.hash='#/search'">
        <div class="card-row"><span class="card-title">単語・フレーズを検索</span></div>
        <div class="card-sub">日本語 / 英語であいまい検索</div>
      </button>
    </div>`;

  html += `
    <div class="section-label">参照</div>
    <div class="card-list">
      <button class="card" onclick="location.hash='#/reference'">
        <div class="card-row"><span class="card-title">単位・発声・時制の使い方</span></div>
        <div class="card-sub">試験ではなく必要な時に見る資料</div>
      </button>
    </div>`;

  root.innerHTML = html;
}

function renderCategory(rootKey, path) {
  const treeRoot = rootKey === "quiz" ? quizRoot : referenceVocabRoot;
  const node = findNode(treeRoot, path);
  if (!node) { root.innerHTML = "<p class='empty-msg'>カテゴリが見つかりません。</p>"; return; }

  const title = path.length ? path[path.length - 1] : "カテゴリ";
  const parentHref = path.length > 1
    ? `#/category/${rootKey}/${encodePath(path.slice(0, -1))}`
    : "#/";

  let html = backRow(path.length > 1 ? path[path.length - 2] : "ホーム", parentHref);
  html += `<h2 class="view-title">${escapeHtml(title)}</h2>`;

  const count = itemCountRecursive(node);
  if (rootKey === "quiz" && count > 0) {
    html += `<button class="btn block" style="margin-bottom:20px;" onclick="location.hash='#/quiz/${encodePath(path)}'">この範囲(${count}件)で試験を始める</button>`;
  }

  if (node.children.size > 0) {
    html += `<div class="card-list">`;
    for (const child of node.children.values()) {
      html += `
        <button class="card" onclick="location.hash='#/category/${rootKey}/${encodePath(path.concat(child.name))}'">
          <div class="card-row"><span class="card-title">${escapeHtml(child.name)}</span><span class="card-count">${itemCountRecursive(child)}件</span></div>
        </button>`;
    }
    html += `</div>`;
  }

  if (node.items.length > 0) {
    html += `<div class="card-list" style="margin-top:14px;">` + node.items.map((it) => vocabRowHtml(it)).join("") + `</div>`;
  }

  root.innerHTML = html;
  attachAudioButtons(root);
}

let quizState = null;

function renderQuiz(path, reviewMode) {
  let pool, title;
  if (reviewMode) {
    pool = itemsById(reviewIds());
    title = "復習問題";
  } else {
    const node = findNode(quizRoot, path);
    if (!node) { root.innerHTML = "<p class='empty-msg'>カテゴリが見つかりません。</p>"; return; }
    pool = allItemsRecursive(node);
    title = path[path.length - 1] || "試験";
  }
  const fallbackPool = allItemsRecursive(quizRoot);
  const questions = buildQuestions(pool, fallbackPool);

  quizState = { questions, index: 0, score: 0, selected: null, finished: false, reviewMode, title };
  renderQuizState();
}

function renderQuizState() {
  const s = quizState;
  const backHref = s.reviewMode ? "#/" : "#/";
  let html = backRow("ホーム", backHref);
  html += `<h2 class="view-title">${escapeHtml(s.title)}</h2>`;

  if (s.questions.length === 0) {
    html += `<p class="empty-msg">${s.reviewMode ? "復習する問題はありません。" : "この範囲には出題できる単語がありません。"}</p>`;
    root.innerHTML = html;
    return;
  }

  if (s.finished) {
    html += `
      <div class="quiz-result">
        <h3>結果: ${s.score} / ${s.questions.length}</h3>
        <button class="btn" onclick="retryQuiz()">もう一度</button>
      </div>`;
    root.innerHTML = html;
    return;
  }

  const q = s.questions[s.index];
  const progress = Math.round(((s.index + 1) / s.questions.length) * 100);
  html += `
    <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${progress}%;"></div></div>
    <div class="quiz-count">${s.index + 1} / ${s.questions.length}</div>
    <div class="quiz-target">
      <div class="quiz-target-en">${escapeHtml(q.target.english)}</div>
      ${q.target.pronunciation ? `<div class="quiz-target-pron">${escapeHtml(q.target.pronunciation)}</div>` : ""}
      ${q.target.audio_file ? `<button class="btn outline" data-audio="${escapeHtml(q.target.audio_file)}" id="quiz-audio-btn">発音を聞く</button>` : ""}
    </div>
    <p style="font-size:0.85rem;color:var(--ink-soft);">正しい意味を選んでください</p>
    <div class="quiz-choices">`;

  q.choices.forEach((choice, i) => {
    let cls = "quiz-choice";
    if (s.selected != null) {
      if (i === q.correctIndex) cls += " correct";
      else if (i === s.selected) cls += " wrong";
    }
    html += `<button class="${cls}" onclick="answerQuiz(${i})" ${s.selected != null ? "disabled" : ""}>${escapeHtml(choice)}</button>`;
  });
  html += `</div>`;

  if (s.selected != null) {
    html += `<button class="btn block" onclick="nextQuiz()">${s.index + 1 < s.questions.length ? "次へ" : "結果を見る"}</button>`;
  }

  root.innerHTML = html;
  const audioBtn = document.getElementById("quiz-audio-btn");
  if (audioBtn) audioBtn.addEventListener("click", () => playAudio(audioBtn.getAttribute("data-audio")));
}

window.answerQuiz = function (i) {
  const s = quizState;
  if (s.selected != null) return;
  s.selected = i;
  const q = s.questions[s.index];
  if (i === q.correctIndex) {
    s.score++;
    if (s.reviewMode) clearItem(q.target.id);
  } else {
    recordWrong(q.target.id);
  }
  renderQuizState();
};
window.nextQuiz = function () {
  const s = quizState;
  if (s.index + 1 < s.questions.length) {
    s.index++; s.selected = null;
  } else {
    s.finished = true;
  }
  renderQuizState();
};
window.retryQuiz = function () {
  const s = quizState;
  s.index = 0; s.score = 0; s.selected = null; s.finished = false;
  renderQuizState();
};

function renderSpecialList(mode) {
  const isReview = mode === "review";
  const title = isReview ? "復習問題" : "殿堂入り問題";
  const counts = loadWrongCounts();
  const items = isReview ? itemsById(reviewIds()) : itemsById(hallOfFameIds());

  let html = backRow("ホーム", "#/");
  html += `<h2 class="view-title">${title}</h2>`;

  if (items.length === 0) {
    html += `<p class="empty-msg">${isReview ? "間違えた問題はまだありません。試験で間違えるとここに表示されます。" : "3回間違えた問題はまだありません。"}</p>`;
    root.innerHTML = html;
    return;
  }

  if (isReview) {
    html += `<button class="btn block" style="margin-bottom:16px;" onclick="location.hash='#/quiz-review'">復習する(${items.length}件)</button>`;
  }

  html += `<div class="card-list">` + items.map((it) => vocabRowHtml(it, `間違えた回数: ${counts[it.id] || 0} 回`)).join("") + `</div>`;
  root.innerHTML = html;
  attachAudioButtons(root);
}

function renderSearch(query) {
  let html = backRow("ホーム", "#/");
  html += `<h2 class="view-title">検索</h2>`;
  html += `<input type="text" class="search-input" id="search-input" placeholder="日本語 / 英語で検索" value="${escapeHtml(query || "")}">`;
  html += `<div id="search-results" class="card-list"></div>`;
  root.innerHTML = html;

  const input = document.getElementById("search-input");
  const resultsEl = document.getElementById("search-results");

  function doSearch(q) {
    if (!q || !q.trim()) { resultsEl.innerHTML = ""; return; }
    const needle = q.trim().toLowerCase();
    const matches = allVocab.filter((it) =>
      it.japanese.toLowerCase().includes(needle) || it.english.toLowerCase().includes(needle)
    ).slice(0, 100);
    resultsEl.innerHTML = matches.length
      ? matches.map((it) => vocabRowHtml(it)).join("")
      : `<p class="empty-msg">見つかりませんでした。</p>`;
    attachAudioButtons(resultsEl);
  }

  input.addEventListener("input", () => doSearch(input.value));
  input.focus();
  if (query) doSearch(query);
}

function iconForTopic(key) {
  return { unit_conversion: "&#128207;", pronunciation_rules: "&#128483;", tense_usage: "&#128337;" }[key] || "&#128214;";
}

function renderReferenceHub() {
  let html = backRow("ホーム", "#/");
  html += `<h2 class="view-title">参照</h2>`;
  html += `<div class="card-list">`;
  for (const topic of referenceTopics) {
    html += `
      <button class="card" onclick="location.hash='#/reference/${encodeURIComponent(topic.key)}'">
        <div class="card-row"><span class="card-title">${iconForTopic(topic.key)} ${escapeHtml(topic.title)}</span></div>
      </button>`;
  }
  const pronNode = referenceVocabRoot.children.get("発音");
  const pronCount = pronNode ? itemCountRecursive(pronNode) : 0;
  html += `
    <button class="card" onclick="location.hash='#/category/referenceVocab/${encodeURIComponent("発音")}'">
      <div class="card-row"><span class="card-title">&#128483; 発音注意単語・弱形発音</span></div>
      <div class="card-sub">${pronCount}件 - 発音を確認できる単語リスト</div>
    </button>`;
  html += `</div>`;
  root.innerHTML = html;
}

function renderReferenceTopic(key) {
  const topic = referenceTopics.find((t) => t.key === key);
  if (!topic) { root.innerHTML = "<p class='empty-msg'>見つかりません。</p>"; return; }

  let html = backRow("参照", "#/reference");
  html += `<h2 class="view-title">${escapeHtml(topic.title)}</h2>`;

  for (const section of topic.sections) {
    html += `<div class="ref-section"><h3>${escapeHtml(section.title)}</h3>`;
    if (section.image) {
      html += `<img src="images/${escapeHtml(section.image)}.jpg" alt="${escapeHtml(section.title)}">`;
    }
    (section.formulas || []).forEach((f) => { html += `<div class="ref-formula">・${escapeHtml(f)}</div>`; });
    (section.bullets || []).forEach((b) => { html += `<div class="ref-bullet">・${escapeHtml(b)}</div>`; });
    if (section.table) {
      html += `<table class="ref-table"><thead><tr>` + section.table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("") + `</tr></thead><tbody>`;
      section.table.rows.forEach((row) => {
        html += `<tr>` + row.map((c) => `<td>${escapeHtml(c)}</td>`).join("") + `</tr>`;
      });
      html += `</tbody></table>`;
    }
    if (section.note) html += `<div class="ref-note">${escapeHtml(section.note)}</div>`;
    html += `</div>`;
  }

  root.innerHTML = html;
}

/* ---------- Router ---------- */
function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/");
  const seg0 = parts[0] || "";

  if (seg0 === "" ) return renderHome();
  if (seg0 === "category") return renderCategory(parts[1], decodePath(parts.slice(2).join("/")));
  if (seg0 === "quiz") return renderQuiz(decodePath(parts.slice(1).join("/")), false);
  if (seg0 === "quiz-review") return renderQuiz([], true);
  if (seg0 === "review") return renderSpecialList("review");
  if (seg0 === "hall-of-fame") return renderSpecialList("hallOfFame");
  if (seg0 === "search") return renderSearch(decodeURIComponent(parts.slice(1).join("/") || ""));
  if (seg0 === "reference") return parts[1] ? renderReferenceTopic(decodeURIComponent(parts[1])) : renderReferenceHub();
  renderHome();
}

window.addEventListener("hashchange", route);

/* ---------- Init ---------- */
Promise.all([
  fetch("data/vocab.json").then((r) => r.json()),
  fetch("data/distractors.json").then((r) => r.json()).catch(() => ({})),
  fetch("data/reference.json").then((r) => r.json())
]).then(([vocab, distractors, reference]) => {
  allVocab = vocab;
  distractorsMap = distractors;
  quizRoot = buildTree(vocab.filter((v) => QUIZ_ROOT_NAMES.includes(v.category_path[0])));
  referenceVocabRoot = buildTree(vocab.filter((v) => REFERENCE_VOCAB_ROOT_NAMES.includes(v.category_path[0])));
  referenceTopics = Object.keys(reference).map((key) => ({ key, title: reference[key].title, sections: reference[key].sections }));
  route();
}).catch((e) => {
  root.innerHTML = "<p class='empty-msg'>データの読み込みに失敗しました。時間をおいて再度お試しください。</p>";
  console.error(e);
});
