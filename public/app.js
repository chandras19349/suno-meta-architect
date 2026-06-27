const $ = (id) => document.getElementById(id);

const state = {
  lastPayload: null,
  lastResult: null
};

const generateBtn = $("generateBtn");
const clearBtn = $("clearBtn");
const regenBtn = $("regenBtn");
const copyAllBtn = $("copyAllBtn");
const loadingPanel = $("loadingPanel");
const resultPanel = $("resultPanel");
const errorPanel = $("errorPanel");
const readinessBadge = $("readinessBadge");

function getPayload() {
  return {
    lyrics: $("lyricsInput").value.trim(),
    language: $("language").value,
    vocal: $("vocal").value,
    energy: $("energy").value,
    experimentLevel: $("experimentLevel").value,
    structureMode: $("structureMode").value,
    outputLength: $("outputLength").value
  };
}

function showError(message) {
  errorPanel.textContent = message;
  errorPanel.classList.remove("hidden");
}

function clearError() {
  errorPanel.textContent = "";
  errorPanel.classList.add("hidden");
}

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  loadingPanel.classList.toggle("hidden", !isLoading);
  readinessBadge.textContent = isLoading ? "Generating" : "Ready";
}

function formatDNA(dna) {
  return [
    `Genre Fusion:\n${dna.genreFusion || ""}`,
    `BPM:\n${dna.bpm || ""}`,
    `Key:\n${dna.key || ""}`,
    `Vocal Architecture:\n${dna.vocalArchitecture || ""}`,
    `Rhythmic System:\n${dna.rhythmicSystem || ""}`,
    `Instrumentation:\n${dna.instrumentation || ""}`,
    `Arrangement Logic:\n${dna.arrangementLogic || ""}`,
    `Metatag Strategy:\n${dna.metatagStrategy || ""}`,
    `Novelty Control:\n${dna.noveltyControl || ""}`
  ].join("\n\n");
}

function formatScore(score) {
  return [
    `Overall Score: ${score.overallScore || "--"} / 100`,
    "",
    `Structure Quality: ${score.structureQuality || "--"} / 15`,
    `Hook Strength: ${score.hookStrength || "--"} / 15`,
    `Suno Tag Clarity: ${score.sunoTagClarity || "--"} / 15`,
    `Experimental Originality: ${score.experimentalOriginality || "--"} / 15`,
    `Vocal Architecture: ${score.vocalArchitecture || "--"} / 10`,
    `Instrumentation Depth: ${score.instrumentationDepth || "--"} / 10`,
    `Rhythm & Groove Design: ${score.rhythmGrooveDesign || "--"} / 10`,
    `Copy-Paste Usability: ${score.copyPasteUsability || "--"} / 5`,
    `Language Consistency: ${score.languageConsistency || "--"} / 5`,
    "",
    `Suno Readiness: ${score.sunoReadiness || ""}`,
    `Tag Quality: ${score.tagQuality || ""}`,
    `Suggested Improvement: ${score.suggestedImprovement || ""}`
  ].join("\n");
}

function formatHooks(hooks) {
  return [`Hook A:\n${hooks?.hookA || ""}`, "", `Hook B:\n${hooks?.hookB || ""}`].join("\n");
}

function formatFullPackage(result) {
  return [
    "1) Suno Music Prompt",
    "",
    result.sunoMusicPrompt || "",
    "",
    "2) Full Song Lyrics",
    "",
    result.taggedLyrics || "",
    "",
    "3) Two Alternate Hooks",
    "",
    formatHooks(result.alternateHooks),
    "",
    "4) Style DNA Breakdown",
    "",
    formatDNA(result.styleDNA || {}),
    "",
    "5) Internal Quality Score",
    "",
    formatScore(result.qualityScore || {})
  ].join("\n");
}

function updateScoreRing(score) {
  const overall = Number(score?.overallScore || 0);
  $("overallScore").textContent = overall || "--";
  const degrees = Math.max(0, Math.min(100, overall)) * 3.6;

  document.querySelector(".score-ring").style.background =
    `radial-gradient(circle, #11111a 58%, transparent 59%), conic-gradient(var(--accent) ${degrees}deg, rgba(255,255,255,0.1) ${degrees}deg)`;

  if (overall >= 92) readinessBadge.textContent = "Excellent";
  else if (overall >= 85) readinessBadge.textContent = "Strong";
  else if (overall >= 75) readinessBadge.textContent = "Needs Polish";
  else readinessBadge.textContent = "Weak";
}

function renderResult(result) {
  state.lastResult = result;
  $("musicPromptOutput").textContent = result.sunoMusicPrompt || "";
  $("taggedLyricsOutput").textContent = result.taggedLyrics || "";
  $("hooksOutput").textContent = formatHooks(result.alternateHooks || {});
  $("dnaOutput").textContent = formatDNA(result.styleDNA || {});
  $("scoreOutput").textContent = formatScore(result.qualityScore || {});
  updateScoreRing(result.qualityScore || {});
  resultPanel.classList.remove("hidden");
}

async function generate(payload) {
  clearError();

  if (!payload.lyrics || payload.lyrics.length < 10) {
    showError("Please paste at least a few lines of lyrics.");
    return;
  }

  state.lastPayload = payload;
  setLoading(true);

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Generation failed.");
    }

    renderResult(data);
  } catch (error) {
    showError(error.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
}

generateBtn.addEventListener("click", () => generate(getPayload()));
regenBtn?.addEventListener("click", () => {
  if (state.lastPayload) generate(state.lastPayload);
});

clearBtn.addEventListener("click", () => {
  $("lyricsInput").value = "";
  resultPanel.classList.add("hidden");
  clearError();
  readinessBadge.textContent = "Ready";
});

copyAllBtn?.addEventListener("click", async () => {
  if (!state.lastResult) return;
  await navigator.clipboard.writeText(formatFullPackage(state.lastResult));
  copyAllBtn.textContent = "Copied!";
  setTimeout(() => {
    copyAllBtn.textContent = "Copy Full Package";
  }, 1200);
});

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = $(button.dataset.copy);
    if (!target) return;

    await navigator.clipboard.writeText(target.textContent);
    const oldText = button.textContent;
    button.textContent = "Copied!";
    setTimeout(() => {
      button.textContent = oldText;
    }, 1200);
  });
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));
    tab.classList.add("active");
    $("tab-" + tabName).classList.add("active");
  });
});
