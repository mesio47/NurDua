// NurDua: Filter, Favoriten, Lernfortschritt, Audio-Wiedergabe, Copy, Share, Statistik, Export, PWA

const FAVORITES_KEY = "nurdua:favorites";
const LEARNED_KEY = "nurdua:learned";
const STATS_KEY = "nurdua:stats";
const RECITER = "Alafasy_128kbps";

// Statistik-Tracking
function getStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || "{}");
  } catch {
    return {};
  }
}

function incrementStat(key) {
  const stats = getStats();
  const today = new Date().toISOString().split("T")[0];
  stats[today] = stats[today] || { listened: 0, learned: 0 };
  if (key === "listened") stats[today].listened++;
  if (key === "learned") stats[today].learned++;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function decrementStat(key) {
  const stats = getStats();
  const today = new Date().toISOString().split("T")[0];
  stats[today] = stats[today] || { listened: 0, learned: 0 };
  if (key === "listened" && stats[today].listened > 0) stats[today].listened--;
  if (key === "learned" && stats[today].learned > 0) stats[today].learned--;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function getTodayStats() {
  const stats = getStats();
  const today = new Date().toISOString().split("T")[0];
  return stats[today] || { listened: 0, learned: 0 };
}

// Toast Notifications
function showToast(message, duration = 2000) {
  const existingToast = document.getElementById("toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.id = "toast-notification";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #204838 0%, #336b54 100%);
    color: #fff;
    padding: 16px 24px;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(32, 72, 56, 0.3);
    animation: slideUpToast 0.3s ease-out;
    z-index: 9999;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideDownToast 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function getStoredIds(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function toggleStoredId(key, id) {
  const ids = getStoredIds(key);
  const idx = ids.indexOf(id);
  if (idx === -1) {
    ids.push(id);
  } else {
    ids.splice(idx, 1);
  }
  localStorage.setItem(key, JSON.stringify(ids));
  return ids;
}

function getFavorites() {
  return getStoredIds(FAVORITES_KEY);
}

function toggleFavorite(id) {
  return toggleStoredId(FAVORITES_KEY, id);
}

function getLearned() {
  return getStoredIds(LEARNED_KEY);
}

function toggleLearned(id) {
  return toggleStoredId(LEARNED_KEY, id);
}

function pad3(n) {
  return String(n).padStart(3, "0");
}

function audioUrlFor(sura, ayah) {
  return `https://everyayah.com/data/${RECITER}/${pad3(sura)}${pad3(ayah)}.mp3`;
}

function sourceLabel(dua) {
  const range = dua.ayahs.length > 1
    ? `${dua.ayahs[0]}–${dua.ayahs[dua.ayahs.length - 1]}`
    : `${dua.ayahs[0]}`;
  return `Koran ${dua.sura}:${range}`;
}

const EMPTY_STATE_MESSAGES = {
  favoriten: "Hier ist noch nichts – tippe auf das Herz bei einer Dua, um sie zu deinen Favoriten hinzuzufügen.",
  gelernt: "Hier ist noch nichts – tippe auf das Häkchen bei einer Dua, um sie als auswendig gelernt zu markieren.",
  default: "Hier ist noch nichts."
};

function currentCategory() {
  const hash = window.location.hash.replace("#", "");
  return CATEGORIES.some((c) => c.id === hash) ? hash : "alle";
}

function getFilteredDuas() {
  const category = currentCategory();
  if (category === "alle") return DUAS;
  if (category === "favoriten") {
    const favorites = getFavorites();
    return DUAS.filter((d) => favorites.includes(d.id));
  }
  if (category === "gelernt") {
    const learned = getLearned();
    return DUAS.filter((d) => learned.includes(d.id));
  }
  return DUAS.filter((d) => d.category === category);
}

function renderFilterBar() {
  const bar = document.getElementById("filter-bar");
  const active = currentCategory();
  bar.innerHTML = CATEGORIES.map((c) => {
    const label = c.suffix ? `${c.label} ${c.suffix}` : c.label;
    return `<a class="filter-pill${c.id === active ? " is-active" : ""}" href="#${c.id}" data-cat="${c.id}">${label}</a>`;
  }).join("");
}

function renderLearnedProgress() {
  const el = document.getElementById("learned-progress");
  if (!el) return;
  const learnedCount = getLearned().length;
  el.textContent = `${learnedCount} von ${DUAS.length} gelernt`;
}

function renderStatistics() {
  const today = getTodayStats();
  const duasEl = document.getElementById("total-duas");
  const listenedEl = document.getElementById("today-listened");
  const learnedEl = document.getElementById("today-learned");
  const listenedLabelEl = document.getElementById("today-listened-label");
  const learnedLabelEl = document.getElementById("today-learned-label");

  if (duasEl) duasEl.textContent = DUAS.length;
  if (listenedEl) listenedEl.textContent = today.listened || 0;
  if (learnedEl) learnedEl.textContent = today.learned || 0;
  if (listenedLabelEl) listenedLabelEl.textContent = "Bereits gehört";
  if (learnedLabelEl) learnedLabelEl.textContent = "Auswendig gelernt";
}

function renderDuas() {
  const favorites = getFavorites();
  const learned = getLearned();
  const items = getFilteredDuas();
  const list = document.getElementById("dua-list");
  const emptyState = document.getElementById("empty-state");
  const count = document.getElementById("dua-count");

  count.textContent = `${items.length} ${items.length === 1 ? "Bittgebet" : "Bittgebete"}`;
  renderLearnedProgress();

  if (items.length === 0) {
    list.innerHTML = "";
    emptyState.textContent = EMPTY_STATE_MESSAGES[currentCategory()] || EMPTY_STATE_MESSAGES.default;
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  list.innerHTML = items.map((dua) => {
    const isFav = favorites.includes(dua.id);
    const isLearned = learned.includes(dua.id);
    return `
      <article class="dua-card" data-dua-id="${dua.id}">
        <p class="dua-arabic">${dua.arabic}</p>
        <p class="dua-translit">${dua.translit}</p>
        <p class="dua-translation">${dua.translation}</p>
        <p class="dua-source">${sourceLabel(dua)}${dua.note ? ` · ${dua.note}` : ""}${dua.truncated ? " (Auszug)" : ""}</p>
        <div class="dua-actions">
          <button class="icon-btn play-btn" type="button" data-action="play" aria-label="Rezitation abspielen">${PLAY_ICON}</button>
          <button class="icon-btn loop-btn" type="button" data-action="loop" aria-label="In Dauerschleife (unendlich) abspielen" title="In Dauerschleife (unendlich) abspielen">${LOOP_ICON}</button>
          <button class="icon-btn copy-btn" type="button" data-action="copy" aria-label="Text kopieren" title="Dua-Text kopieren">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/></svg>
            <span>Kopieren</span>
          </button>
          <button class="icon-btn share-btn" type="button" data-action="share" aria-label="Teilen" title="Dua teilen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            <span>Teilen</span>
          </button>
          <div class="dua-actions-right">
            <button class="icon-btn learned-btn${isLearned ? " is-active" : ""}" type="button" data-action="learned"
                    aria-label="${isLearned ? "Bereits auswendig gelernt" : "Als auswendig gelernt markieren"}"
                    title="${isLearned ? "Bereits auswendig gelernt" : "Als auswendig gelernt markieren"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 5-5"/></svg>
            </button>
            <button class="icon-btn heart-btn${isFav ? " is-active" : ""}" type="button" data-action="favorite"
                    aria-label="${isFav ? "Gespeichert – aus meinen Duas entfernen" : "In meinen Duas speichern"}"
                    title="${isFav ? "Gespeichert – aus meinen Duas entfernen" : "In meinen Duas speichern"}">
              <svg viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.1 2.3 4.5 6 4c2.1-.3 3.9.8 6 3 2.1-2.2 3.9-3.3 6-3 3.7.5 5.5 4.1 4 7.7-2.5 4.7-10 9.3-10 9.3Z"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }).join("");

  syncButtonsUI();
  updateExportButton();
}

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Anhören</span>`;
const STOP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg><span>Stoppen</span>`;
const LOOP_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2 21 6 17 10"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22 3 18 7 14"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg><span>Dauerschleife</span>`;
const LOOP_STOP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg><span>Stoppen</span>`;
const PLAY_ALL_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Alle Bittgebete anhören</span>`;
const PLAY_ALL_STOP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg><span>Wiedergabe stoppen</span>`;

let currentPlayback = null; // { mode: "single" | "loop" | "queue", duaId, audio, queue?, queueIndex? }

function setBtnVisual(btn, isPlaying, playHtml, stopHtml) {
  btn.classList.toggle("is-playing", isPlaying);
  btn.innerHTML = isPlaying ? stopHtml : playHtml;
}

function findPlayButton(duaId) {
  return document.querySelector(`.dua-card[data-dua-id="${duaId}"] .play-btn`);
}

function findLoopButton(duaId) {
  return document.querySelector(`.dua-card[data-dua-id="${duaId}"] .loop-btn`);
}

function syncButtonsUI() {
  if (!currentPlayback) return;
  if (currentPlayback.mode === "loop") {
    const btn = findLoopButton(currentPlayback.duaId);
    if (btn) setBtnVisual(btn, true, LOOP_ICON, LOOP_STOP_ICON);
  } else {
    const btn = findPlayButton(currentPlayback.duaId);
    if (btn) setBtnVisual(btn, true, PLAY_ICON, STOP_ICON);
  }
}

function stopPlayback() {
  if (!currentPlayback) return;
  const { mode, duaId, audio } = currentPlayback;
  audio.pause();
  audio.src = "";

  if (mode === "loop") {
    const btn = findLoopButton(duaId);
    if (btn) setBtnVisual(btn, false, LOOP_ICON, LOOP_STOP_ICON);
  } else {
    const btn = findPlayButton(duaId);
    if (btn) setBtnVisual(btn, false, PLAY_ICON, STOP_ICON);
  }

  const playAllBtn = document.getElementById("play-all-btn");
  if (playAllBtn) setBtnVisual(playAllBtn, false, PLAY_ALL_ICON, PLAY_ALL_STOP_ICON);

  currentPlayback = null;
}

// Plays a single dua's ayah sequence (respecting audioStart/audioEnd) on the given
// audio element. Calls onDone() when finished. If loop=true, restarts from the top
// indefinitely instead (used for the endless "Dauerschleife" mode).
function playDuaOn(audio, dua, { loop = false, onDone } = {}) {
  const urls = dua.ayahs.map((a) => audioUrlFor(dua.sura, a));
  let i = 0;
  const isCurrent = () => currentPlayback && currentPlayback.audio === audio;

  const playNext = () => {
    if (!isCurrent()) return;
    if (i >= urls.length) {
      if (loop) {
        i = 0;
        playNext();
      } else if (onDone) {
        onDone();
      } else {
        stopPlayback();
      }
      return;
    }
    const isFirst = i === 0;
    const isLast = i === urls.length - 1;
    audio.src = urls[i];
    i += 1;

    const onTimeUpdate = () => {
      if (dua.audioEnd && audio.currentTime >= dua.audioEnd) {
        audio.removeEventListener("timeupdate", onTimeUpdate);
        playNext();
      }
    };

    const start = () => {
      if (!isCurrent()) return;
      if (isFirst && dua.audioStart) {
        audio.currentTime = dua.audioStart;
      }
      if (isLast && dua.audioEnd) {
        audio.addEventListener("timeupdate", onTimeUpdate);
      }
      audio.play().catch(() => {
        if (isCurrent()) stopPlayback();
      });
    };

    if (isFirst && dua.audioStart) {
      audio.addEventListener("loadedmetadata", start, { once: true });
      audio.load();
    } else {
      start();
    }
  };

  // Entferne alte Event-Listener bevor neue hinzugefügt werden
  audio.removeEventListener("ended", playNext);
  audio.addEventListener("ended", playNext);
  playNext();
}

function startSinglePlayback(dua, btn) {
  const audio = new Audio();
  currentPlayback = { mode: "single", duaId: dua.id, audio };
  setBtnVisual(btn, true, PLAY_ICON, STOP_ICON);
  playDuaOn(audio, dua);
}

function startLoopPlayback(dua, btn) {
  const audio = new Audio();
  currentPlayback = { mode: "loop", duaId: dua.id, audio };
  setBtnVisual(btn, true, LOOP_ICON, LOOP_STOP_ICON);
  playDuaOn(audio, dua, { loop: true });
}

function startQueuePlayback(duas, playAllBtn) {
  if (duas.length === 0) return;
  const audio = new Audio();
  currentPlayback = { mode: "queue", duaId: duas[0].id, audio, queue: duas, queueIndex: 0 };
  setBtnVisual(playAllBtn, true, PLAY_ALL_ICON, PLAY_ALL_STOP_ICON);

  const playAt = (idx) => {
    if (!currentPlayback || currentPlayback.audio !== audio) return;
    if (idx >= duas.length) {
      stopPlayback();
      return;
    }
    const prevBtn = findPlayButton(currentPlayback.duaId);
    if (prevBtn) setBtnVisual(prevBtn, false, PLAY_ICON, STOP_ICON);

    currentPlayback.duaId = duas[idx].id;
    currentPlayback.queueIndex = idx;
    const nowBtn = findPlayButton(duas[idx].id);
    if (nowBtn) setBtnVisual(nowBtn, true, PLAY_ICON, STOP_ICON);
    nowBtn?.scrollIntoView({ behavior: "smooth", block: "center" });

    playDuaOn(audio, duas[idx], { onDone: () => playAt(idx + 1) });
  };

  playAt(0);
}

function copyDuaToClipboard(dua) {
  const text = `${dua.translation}\n\n${dua.translit}\n\nQuelle: ${sourceLabel(dua)}\n\n✨ Von NurDua – www.nurdua.de`;
  navigator.clipboard.writeText(text).then(() => {
    showToast("✓ Dua kopiert!");
  }).catch(() => {
    showToast("❌ Kopieren nicht möglich");
  });
}

function shareDua(dua) {
  const text = `📖 "${dua.translation}"\n\n${dua.translit}\n\nQuelle: ${sourceLabel(dua)}\n\n✨ Von NurDua – Bittgebete aus dem Koran`;
  const url = "https://www.nurdua.de";

  if (navigator.share) {
    navigator.share({
      title: "NurDua – Dua teilen",
      text: text,
      url: url
    }).catch((err) => console.log("Share error:", err));
  } else {
    // Fallback: WhatsApp, Email, etc.
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
    const emailUrl = `mailto:?subject=Eine Dua von NurDua&body=${encodeURIComponent(text + "\n\n" + url)}`;

    const menu = `
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:9999;">
        <p style="margin:0 0 15px;font-weight:600;">Wie möchtest du teilen?</p>
        <a href="${whatsappUrl}" style="display:block;padding:10px;margin:8px 0;background:#25D366;color:white;text-decoration:none;border-radius:6px;text-align:center;">📱 WhatsApp</a>
        <a href="${emailUrl}" style="display:block;padding:10px;margin:8px 0;background:#0078D4;color:white;text-decoration:none;border-radius:6px;text-align:center;">📧 Email</a>
        <button onclick="this.parentElement.parentElement.remove()" style="display:block;width:100%;padding:10px;margin:8px 0;background:#e0e0e0;border:none;border-radius:6px;cursor:pointer;">Abbrechen</button>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", menu);
  }
}

// Schnell-Update für einzelne Buttons (ohne komplettes Rerender)
function updateButtonUI(btn, isActive, activeClass) {
  btn.classList.toggle(activeClass, isActive);
  if (activeClass === "is-active") {
    // Für Heart-Button: SVG fill updaten
    if (btn.classList.contains("heart-btn")) {
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", isActive ? "currentColor" : "none");
    }
  }
}

function onListClick(e) {
  const card = e.target.closest(".dua-card");
  if (!card) return;
  const dua = DUAS.find((d) => d.id === card.dataset.duaId);
  if (!dua) return;

  if (e.target.closest('[data-action="favorite"]')) {
    const btn = e.target.closest(".heart-btn");
    toggleFavorite(dua.id);
    const isFav = getFavorites().includes(dua.id);
    updateButtonUI(btn, isFav, "is-active");
    // Wenn auf "Favoriten"-Seite: neu rendern um Dua zu entfernen
    if (currentCategory() === "favoriten") {
      renderDuas();
    }
    renderStatistics();
  } else if (e.target.closest('[data-action="learned"]')) {
    const btn = e.target.closest(".learned-btn");
    const isNowLearned = !getLearned().includes(dua.id);
    toggleLearned(dua.id);
    // Inkrementieren wenn selektiert, dekrementieren wenn deselektiert
    if (isNowLearned) {
      incrementStat("learned");
      showToast("✨ Mashallah, mach weiter so! ✨");
    } else {
      decrementStat("learned");
    }
    updateButtonUI(btn, isNowLearned, "is-active");
    renderLearnedProgress();
    renderStatistics();
  } else if (e.target.closest('[data-action="copy"]')) {
    copyDuaToClipboard(dua);
  } else if (e.target.closest('[data-action="share"]')) {
    shareDua(dua);
  } else if (e.target.closest('[data-action="play"]')) {
    incrementStat("listened");
    const wasPlayingThis = currentPlayback && currentPlayback.mode !== "loop" && currentPlayback.duaId === dua.id;
    stopPlayback();
    if (!wasPlayingThis) {
      startSinglePlayback(dua, e.target.closest(".play-btn"));
    }
  } else if (e.target.closest('[data-action="loop"]')) {
    incrementStat("listened");
    const wasLoopingThis = currentPlayback && currentPlayback.mode === "loop" && currentPlayback.duaId === dua.id;
    stopPlayback();
    if (!wasLoopingThis) {
      startLoopPlayback(dua, e.target.closest(".loop-btn"));
    }
  }
}

function onPlayAllClick() {
  const playAllBtn = document.getElementById("play-all-btn");
  const wasQueuePlaying = currentPlayback && currentPlayback.mode === "queue";
  stopPlayback();
  if (!wasQueuePlaying) {
    startQueuePlayback(getFilteredDuas(), playAllBtn);
  }
}

// Audio Preloading für schnelleres Abspielen
function preloadAudio() {
  DUAS.slice(0, 10).forEach((dua) => {
    const url = audioUrlFor(dua.sura, dua.ayahs[0]);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = url;
  });
}

// Export Funktion mit jsPDF
async function exportDuasAsPDF(duas, filename) {
  if (duas.length === 0) {
    alert("Keine Duas zum Exportieren vorhanden.");
    return;
  }

  showToast("📄 PDF wird generiert...", 1000);

  // Erstelle HTML für PDF
  const container = document.createElement("div");
  container.style.cssText = "width: 800px; padding: 40px; font-family: Arial, sans-serif; background: white;";
  container.innerHTML = `
    <div style="text-align: center; padding: 15px 0; border-bottom: 2px solid #b0913f; margin-bottom: 30px;">
      <p style="color: #b0913f; font-size: 14px; font-weight: bold; margin: 0;">www.nurdua.de</p>
    </div>
    <h1 style="text-align: center; color: #204838; font-size: 28px; margin: 0 0 10px 0;">NurDua – Bittgebete aus dem Koran</h1>
    <p style="text-align: center; color: #999; font-size: 12px; margin-bottom: 30px;">Exportiert am ${new Date().toLocaleDateString("de-DE")}</p>
    ${duas.map((dua) => `
      <div style="margin: 25px 0; padding: 15px; border-left: 4px solid #b0913f;">
        <div style="font-size: 16px; direction: rtl; font-weight: bold; margin-bottom: 10px; font-family: 'Amiri', serif;">${dua.arabic}</div>
        <div style="font-style: italic; color: #8a7130; font-size: 12px; margin-bottom: 8px;">${dua.translit}</div>
        <div style="font-size: 13px; color: #333; margin-bottom: 8px;">${dua.translation}</div>
        <div style="font-size: 11px; color: #999;"><strong>Quelle:</strong> ${sourceLabel(dua)}</div>
      </div>
    `).join("")}
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? "p" : "p",
      unit: "mm",
      format: "a4"
    });

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(filename.replace(".html", ".pdf"));
    showToast("✨ PDF erfolgreich exportiert!");
  } catch (error) {
    console.error("PDF-Fehler:", error);
    showToast("❌ PDF-Generierung fehlgeschlagen");
  } finally {
    document.body.removeChild(container);
  }
}

// Favoriten exportieren
function exportFavoritesAsPDF() {
  const favorites = getFavorites();
  const favDuas = DUAS.filter((d) => favorites.includes(d.id));

  if (favDuas.length === 0) {
    showToast("❌ Noch keine Favoriten. Tippe das Herz an!");
    return;
  }

  const filename = `nurdua-meine-duas-${new Date().toISOString().split("T")[0]}.pdf`;
  showToast(`📄 Exportiere ${favDuas.length} Favoriten...`);
  exportDuasAsPDF(favDuas, filename);
}

// Kategorie exportieren
function exportCategoryAsPDF() {
  const category = currentCategory();
  const categoryDuas = getFilteredDuas();
  const categoryLabel = CATEGORIES.find(c => c.id === category)?.label || "Duas";
  const filename = `nurdua-${category}-${new Date().toISOString().split("T")[0]}.pdf`;
  exportDuasAsPDF(categoryDuas, filename);
}

// Alle Duas exportieren
function exportAllAsPDF() {
  const filename = `nurdua-alle-duas-${new Date().toISOString().split("T")[0]}.pdf`;
  showToast(`📄 Exportiere ${DUAS.length} Duas...`);
  exportDuasAsPDF(DUAS, filename);
}

// Export Button Label & Handler
function updateExportButton() {
  const category = currentCategory();
  const exportBtn = document.getElementById("export-btn");
  const exportLabel = document.getElementById("export-btn-label");

  if (!exportBtn) return;

  // Entferne alten Click-Handler
  exportBtn.onclick = null;

  // Setze neuen Handler basierend auf Kategorie
  if (category === "favoriten") {
    exportLabel.textContent = "Meine Duas exportieren";
    exportBtn.title = "Favorisierte Duas exportieren";
    exportBtn.onclick = exportFavoritesAsPDF;
  } else if (category === "alle") {
    exportLabel.textContent = "Exportieren";
    exportBtn.title = "Alle Duas exportieren";
    exportBtn.onclick = exportAllAsPDF;
  } else {
    exportLabel.textContent = "Exportieren";
    exportBtn.title = `${CATEGORIES.find(c => c.id === category)?.label || "Kategorie"} exportieren`;
    exportBtn.onclick = exportCategoryAsPDF;
  }
}

window.addEventListener("hashchange", () => {
  renderFilterBar();
  renderDuas();
  updateExportButton();
});

// Dark Mode Handler
function initDarkMode() {
  const toggle = document.getElementById("theme-toggle");
  const isDarkMode = localStorage.getItem("nurdua:darkmode") === "true";

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    toggle.textContent = "☀️";
  }

  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const newMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("nurdua:darkmode", newMode);
    toggle.textContent = newMode ? "☀️" : "🌙";
  });
}

// Scroll-to-Top Button
function initScrollToTop() {
  const scrollBtn = document.getElementById("scroll-to-top-btn");
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFilterBar();
  renderDuas();
  renderStatistics();
  updateExportButton();
  initDarkMode();
  initScrollToTop();

  document.getElementById("dua-list").addEventListener("click", onListClick);
  document.getElementById("play-all-btn")?.addEventListener("click", onPlayAllClick);

  // Export Button wird dynamisch in updateExportButton() zugewiesen
  // (onclick wird dort je nach Kategorie gesetzt)

  // PWA Service Worker registrieren
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      console.log("PWA nicht verfügbar");
    });
  }

  // Audio Preloading starten
  preloadAudio();
});
