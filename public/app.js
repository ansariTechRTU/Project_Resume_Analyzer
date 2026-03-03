



const resumeInput = document.getElementById("resumeInput");
const jobDescInput = document.getElementById("jobDescInput");
const jobDescText = document.getElementById("jobDescText");
const analyzeBtn = document.getElementById("analyzeBtn");
const loadingSpinner = document.getElementById("loadingSpinner");

let resumeFile = null;
let jdFile = null;

resumeInput.addEventListener("change", (e) => {
  resumeFile = e.target.files[0];
});
jobDescInput.addEventListener("change", (e) => {
  jdFile = e.target.files[0];
});

analyzeBtn.addEventListener("click", async () => {
  if (!resumeFile) {
    alert("Please upload your resume.");
    return;
  }

  if (!jdFile && jobDescText.value.trim() === "") {
    alert("Please upload OR paste a job description.");
    return;
  }

  loadingSpinner.classList.remove("hidden");

  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    if (jdFile) {
      formData.append("jobDescFile", jdFile);
    }
    if (jobDescText.value.trim() !== "") {
      formData.append("jobDescText", jobDescText.value.trim());
    }

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData
    });

    const json = await response.json();
    loadingSpinner.classList.add("hidden");

    if (!response.ok || !json.success) {
      console.error(" Backend error:", json);
      alert(json.error || "Analysis failed.");
      return;
    }

    // ✅ redirect with the analysis ID
    const id = json.id;
    window.location.href = `/results.html?id=${encodeURIComponent(id)}`;

  } catch (err) {
    loadingSpinner.classList.add("hidden");
    console.error(" Request error:", err);
    alert("Server error: " + err.message);
  }
});
