const STORAGE_KEY = "mt_plan_v1";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
if (!state.startDate) state.startDate = null;
if (!state.completed) state.completed = {}; // key "YYYY-MM-DD" -> true
if (!state.notes) state.notes = {}; // key "YYYY-MM-DD" -> string

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getWeekAndDay(today, startDate) {
  const start = parseLocalDate(startDate);
  const diffDays = Math.floor((today - start) / 86400000);
  if (diffDays < 0) return null;
  const weekNum = Math.floor(diffDays / 7) + 1;
  if (weekNum > 52) return { done: true, weekNum };
  const dayName = DAY_NAMES[today.getDay()];
  return { weekNum, dayName };
}

function calcStreak() {
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (true) {
    const key = fmtDate(d);
    if (state.completed[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function calcProgress() {
  if (!state.startDate) return 0;
  const totalDays = 52 * 6; // 6 active days/week (Sun excluded)
  const doneDays = Object.keys(state.completed).filter(k => state.completed[k]).length;
  return Math.min(100, Math.round((doneDays / totalDays) * 100));
}

function render() {
  const app = document.getElementById("app");
  if (!state.startDate) {
    app.innerHTML = `
      <div class="card">
        <h2>Welcome</h2>
        <p>Set the Monday you started (or are starting) Week 1 of your plan:</p>
        <input type="date" id="startDateInput" />
        <button id="setStartBtn">Start my plan</button>
      </div>`;
    document.getElementById("setStartBtn").onclick = () => {
      const val = document.getElementById("startDateInput").value;
      if (!val) return;
      state.startDate = val;
      saveState(state);
      render();
    };
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const info = getWeekAndDay(today, state.startDate);
  const todayKey = fmtDate(today);

  if (!info) {
    app.innerHTML = `<div class="card"><p>Your start date is in the future. Come back then!</p>
      <button id="resetBtn">Change start date</button></div>`;
    document.getElementById("resetBtn").onclick = resetStart;
    return;
  }
  if (info.done) {
    app.innerHTML = `<div class="card"><h2>🎉 Plan complete!</h2><p>You finished all 52 weeks. Time to plan Year 2.</p></div>`;
    return;
  }

  const week = WEEKS[info.weekNum - 1];
  const dayTask = DAY_TASKS[info.dayName](week);
  const isDone = !!state.completed[todayKey];
  const streak = calcStreak();
  const progress = calcProgress();
  const noteVal = state.notes[todayKey] || "";

  app.innerHTML = `
    <div class="tabs">
      <button class="tab active" data-tab="today">Today</button>
      <button class="tab" data-tab="week">This Week</button>
      <button class="tab" data-tab="progress">Progress</button>
    </div>
    <div id="tabContent"></div>
  `;

  function renderToday() {
    document.getElementById("tabContent").innerHTML = `
      <div class="card">
        <div class="meta">Week ${week.week} / 52 &middot; Q${week.quarter} &middot; ${week.theme}</div>
        <h2>${info.dayName}: ${dayTask.title}</h2>
        <ul class="tasklist">
          ${dayTask.items.map(i => `<li>${i}</li>`).join("")}
        </ul>
        <label class="checkrow">
          <input type="checkbox" id="doneCheck" ${isDone ? "checked" : ""} />
          Mark today's block as done
        </label>
        <h3>Notes / Journal</h3>
        <textarea id="noteArea" placeholder="What did you learn today? Trading journal notes...">${noteVal}</textarea>
        <div class="streak">🔥 ${streak} day streak</div>
      </div>`;
    document.getElementById("doneCheck").onchange = e => {
      state.completed[todayKey] = e.target.checked;
      saveState(state);
      render();
    };
    document.getElementById("noteArea").onblur = e => {
      state.notes[todayKey] = e.target.value;
      saveState(state);
    };
  }

  function renderWeek() {
    const rows = DAY_NAMES.filter(d => d !== "Sunday").concat(["Sunday"]).map(dn => {
      const t = DAY_TASKS[dn](week);
      return `<div class="weekday"><strong>${dn}</strong>: ${t.title}<ul>${t.items.map(i => `<li>${i}</li>`).join("")}</ul></div>`;
    }).join("");
    document.getElementById("tabContent").innerHTML = `
      <div class="card">
        <div class="meta">Week ${week.week} / 52 &middot; Q${week.quarter}</div>
        <h2>${week.theme}</h2>
        ${rows}
      </div>`;
  }

  function renderProgress() {
    document.getElementById("tabContent").innerHTML = `
      <div class="card">
        <h2>Progress</h2>
        <div class="progressbar"><div class="progressfill" style="width:${progress}%"></div></div>
        <p>${progress}% of Year 1 complete</p>
        <p>Current week: ${week.week} / 52 (Quarter ${week.quarter})</p>
        <p>🔥 Current streak: ${streak} days</p>
        <button id="resetBtn2">Change start date</button>
      </div>`;
    document.getElementById("resetBtn2").onclick = resetStart;
  }

  const tabs = { today: renderToday, week: renderWeek, progress: renderProgress };
  document.querySelectorAll(".tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tabs[btn.dataset.tab]();
    };
  });
  renderToday();
}

function resetStart() {
  state.startDate = null;
  saveState(state);
  render();
}

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
