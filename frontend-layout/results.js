document.addEventListener("DOMContentLoaded", () => {
    loadRealAnalysis();
});

// ==========================
// LOAD REAL ANALYSIS RESULTS
// ==========================
async function loadRealAnalysis() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        return renderError("No analysis ID found. Please run a new analysis.");
    }

    try {
        const res = await fetch(`/api/results/${encodeURIComponent(id)}`);
        
        if (!res.ok) {
            return renderError("Could not load analysis results.");
        }

        const data = await res.json();

        if (!data.success) {
            return renderError(data.error || "Analysis failed.");
        }

        // Extract data from response
        const score = data.score ?? 0;
        const matchedSkills = data.matchedSkills || [];
        const missingSkills = data.missingSkills || [];
        const suggestions = data.suggestions || [];

        console.log("✅ Loaded analysis:", { score, matchedSkills, missingSkills, suggestions });

        // Populate UI
        populateScore(score);
        populateMatchedSkills(matchedSkills);
        populateMissingSkills(missingSkills);
        populateSuggestions(suggestions);

    } catch (err) {
        console.error("❌ Load error:", err);
        renderError("Network error while loading analysis results.");
    }
}

// ==========================
// SCORE + DESCRIPTION
// ==========================
function populateScore(score) {
    const scoreValue = document.getElementById("scoreValue");
    const scoreDescription = document.getElementById("scoreDescription");
    const scoreCircle = document.getElementById("scoreCircle");

    // Animate score number
    animateNumber(scoreValue, 0, score, 2000);

    // Animate circular progress
    const circumference = 2 * Math.PI * 100; // radius = 100
    const offset = circumference - (score / 100) * circumference;
    scoreCircle.style.strokeDasharray = `${circumference}`;
    scoreCircle.style.strokeDashoffset = offset;

    // Set description based on score
    let desc = "";
    if (score >= 80) {
        desc = "🎉 Excellent match! Your resume aligns perfectly with this job.";
    } else if (score >= 60) {
        desc = "💪 Strong match — a few improvements can make you even more competitive.";
    } else if (score >= 40) {
        desc = "📈 Moderate match — consider improving key areas to stand out.";
    } else {
        desc = "🔧 Low match — significant improvements needed to better align with this role.";
    }

    scoreDescription.textContent = desc;
}

// ==========================
// MATCHED SKILLS
// ==========================
function populateMatchedSkills(skills) {
    const list = document.getElementById("matchedSkillsList");
    const count = document.getElementById("matchedSkillsCount");

    list.innerHTML = "";

    if (skills.length === 0) {
        list.innerHTML = `
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-center">
                No matched skills found. Consider adding relevant skills to your resume.
            </div>
        `;
        count.textContent = "0";
        return;
    }

    skills.forEach((skill, i) => {
        const div = document.createElement("div");
        div.className = `skill-item matched flex items-center p-4 rounded-xl border bg-green-50 border-green-200 transition-all hover:scale-105 cursor-default`;
        div.style.animationDelay = `${i * 0.05}s`;
        div.innerHTML = `
            <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-gray-800 font-semibold">${escapeHtml(skill)}</span>
        `;
        list.appendChild(div);
    });

    count.textContent = skills.length;
}

// ==========================
// MISSING SKILLS
// ==========================
function populateMissingSkills(skills) {
    const list = document.getElementById("missingSkillsList");
    const count = document.getElementById("missingSkillsCount");

    list.innerHTML = "";

    if (skills.length === 0) {
        list.innerHTML = `
            <div class="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center font-semibold">
                🎯 Great! You have all the required skills!
            </div>
        `;
        count.textContent = "0";
        return;
    }

    skills.forEach((skill, i) => {
        const div = document.createElement("div");
        div.className = `skill-item missing flex items-center p-4 rounded-xl border bg-amber-50 border-amber-200 transition-all hover:scale-105 cursor-default`;
        div.style.animationDelay = `${i * 0.05}s`;
        div.innerHTML = `
            <svg class="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-gray-800 font-semibold">${escapeHtml(skill)}</span>
        `;
        list.appendChild(div);
    });

    count.textContent = skills.length;
}

// ==========================
// SUGGESTIONS
// ==========================
function populateSuggestions(suggestions) {
    const list = document.getElementById("suggestionsList");
    list.innerHTML = "";

    if (suggestions.length === 0) {
        list.innerHTML = `
            <div class="p-6 bg-blue-50 border border-blue-200 rounded-xl text-blue-700">
                <p class="font-semibold">✨ Your resume looks great!</p>
                <p class="mt-2">No major improvements needed at this time.</p>
            </div>
        `;
        return;
    }

    suggestions.forEach((text, i) => {
        const div = document.createElement("div");
        div.className = `suggestion-item p-5 rounded-2xl`;
        div.style.animationDelay = `${i * 0.1}s`;
        div.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
                        <span class="text-white font-black text-lg">${i + 1}</span>
                    </div>
                </div>
                <div class="ml-4 flex-1">
                    <p class="text-gray-800 leading-relaxed font-medium">${escapeHtml(text)}</p>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
}

// ==========================
// ERROR HANDLER
// ==========================
function renderError(msg) {
    document.getElementById("scoreValue").textContent = "--";
    document.getElementById("scoreDescription").textContent = msg;
    document.getElementById("matchedSkillsList").innerHTML = `
        <div class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            ${escapeHtml(msg)}
        </div>
    `;
    document.getElementById("missingSkillsList").innerHTML = "";
    document.getElementById("suggestionsList").innerHTML = `
        <div class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            ${escapeHtml(msg)}
        </div>
    `;
}

// ==========================
// NUMBER ANIMATION
// ==========================
function animateNumber(element, start, end, duration) {
    let startTime = null;
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + "%";
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ==========================
// UTILITY: Escape HTML
// ==========================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}