



document.addEventListener("DOMContentLoaded", async () => {
  // get ?id=<mongoId> from URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    renderError("No analysis ID found in URL. Please run a new analysis.");
    return;
  }

  try {
    const res = await fetch(`/api/result/${encodeURIComponent(id)}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error(" Error fetching analysis:", json);
      renderError("Could not load analysis results.");
      return;
    }

    const analysis = json.analysis;



    // --- pull data from backend document ---
    const score = analysis.score ?? 0;
    const matches = Array.isArray(analysis.matches) ? analysis.matches : [];
    const missingSkills = Array.isArray(analysis.missingSkills)
      ? analysis.missingSkills
      : [];

    // matchedSkills = those where present === true
    const matchedSkills = matches
      .filter(m => m && m.present)
      .map(m => m.skill);

    // render score
    const scoreValueEl = document.getElementById("scoreValue");
    const scoreDescEl = document.getElementById("scoreDescription");

    scoreValueEl.textContent = score + "%";

    let desc;
    if (score >= 80) {
      desc = "Your resume is an excellent match for this job.";
    } else if (score >= 60) {
      desc = "Strong match — a few improvements can make it even better.";
    } else if (score >= 40) {
      desc = "Moderate match — highlight more relevant skills and experience.";
    } else {
      desc = "Basic match — consider tailoring your resume more for this role.";
    }
    scoreDescEl.textContent = desc;

    // render matched skills
    const matchedList = document.getElementById("matchedSkillsList");
    matchedList.innerHTML = "";
    matchedSkills.forEach(skill => {
      const li = document.createElement("li");
      li.className = "flex items-center space-x-2";
      li.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full bg-green-500"></span>
        <span>${skill}</span>`;
      matchedList.appendChild(li);
    });

    document.getElementById("matchedSkillsCount").textContent =
      `Total matched: ${matchedSkills.length}`;

    // render missing skills
    const missingList = document.getElementById("missingSkillsList");
    missingList.innerHTML = "";
    missingSkills.forEach(skill => {
      const li = document.createElement("li");
      li.className = "flex items-center space-x-2";
      li.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
        <span>${skill}</span>`;
      missingList.appendChild(li);
    });

    document.getElementById("missingSkillsCount").textContent =
      `Total missing: ${missingSkills.length}`;

    // suggestions
    const suggList = document.getElementById("suggestionsList");
    suggList.innerHTML = "";
    if (missingSkills.length === 0) {
      const div = document.createElement("div");
      div.className =
        "p-4 bg-green-50 border border-green-200 rounded-xl text-green-700";
      div.innerHTML =
        "<b>Great work!</b> Your resume covers all required skills for this role.";
      suggList.appendChild(div);
    } else {
      const div = document.createElement("div");
      div.className =
        "p-4 bg-purple-50 border border-purple-200 rounded-xl text-purple-700";
      div.innerHTML = `
        <div class="font-semibold mb-1">Improve Missing Skills</div>
        <div>Consider adding or improving these skills:
        <b>${missingSkills.join(", ")}</b>.</div>`;
      suggList.appendChild(div);
    }
  } catch (err) {
    console.error(" Network/parse error:", err);
    renderError("Could not load analysis results (network error).");
  }
});

function renderError(msg) {
  document.getElementById("scoreValue").textContent = "--%";
  document.getElementById("scoreDescription").textContent = msg;
  document.getElementById("matchedSkillsList").innerHTML = "";
  document.getElementById("missingSkillsList").innerHTML = "";
  document.getElementById("suggestionsList").innerHTML = `
    <div class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
      ${msg}
    </div>`;
}
