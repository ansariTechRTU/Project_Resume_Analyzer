// Load dummy data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAnalysisResults();
    animateScoreCircle();
});

// Load and display analysis results
function loadAnalysisResults() {
    // Try to load from sessionStorage first
    const storedData = sessionStorage.getItem('analysisData');

    // Use dummy data for testing (Student B will replace this with actual API data)
    const dummyData = {
        matchScore: 78,
        matchedSkills: [
            'JavaScript',
            'React',
            'Node.js',
            'REST APIs',
            'Git/GitHub',
            'Agile/Scrum',
            'CSS/HTML'
        ],
        missingSkills: [
            'TypeScript',
            'Docker',
            'AWS/Cloud Services',
            'GraphQL'
        ],
        suggestions: [
            {
                title: 'Highlight TypeScript Experience',
                description: 'If you have any TypeScript experience, make sure to explicitly mention it in your skills section. If not, consider taking a quick online course to familiarize yourself with the basics.'
            },
            {
                title: 'Add Cloud Platform Certifications',
                description: 'The job requires AWS/Cloud Services experience. Consider getting AWS Cloud Practitioner certification and add it to your resume. Even hands-on projects with AWS can strengthen your application.'
            },
            {
                title: 'Quantify Your Achievements',
                description: 'Add metrics to your accomplishments. For example, "Improved application performance by 40%" or "Led a team of 5 developers." Numbers make your experience more tangible and impressive.'
            },
            {
                title: 'Emphasize Relevant Projects',
                description: 'Create a dedicated projects section highlighting work that uses the technologies mentioned in the job description. Include GitHub links if available.'
            },
            {
                title: 'Tailor Your Summary',
                description: 'Update your professional summary to mirror the language used in the job description. This helps both human recruiters and ATS systems identify you as a strong match.'
            }
        ]
    };

    // Populate the page with data
    populateScore(dummyData.matchScore);
    populateMatchedSkills(dummyData.matchedSkills);
    populateMissingSkills(dummyData.missingSkills);
    populateSuggestions(dummyData.suggestions);
}

// Populate score and description
function populateScore(score) {
    const scoreValue = document.getElementById('scoreValue');
    const scoreDescription = document.getElementById('scoreDescription');
    const scoreCircle = document.getElementById('scoreCircle');

    // Animate number counting
    animateNumber(scoreValue, 0, score, 2000);

    // Update score circle
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (score / 100) * circumference;
    scoreCircle.style.strokeDashoffset = offset;

    // Add gradient definition for score circle
    const svg = scoreCircle.closest('svg');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#3b82f6;stop-opacity:1');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#8b5cf6;stop-opacity:1');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }

    // Update description based on score
    let description = '';
    let matchLevel = '';

    if (score >= 80) {
        matchLevel = 'excellent match';
        description = `Your resume has an <span class="font-semibold text-gray-900">${matchLevel}</span> with this job description. You're well-positioned for this role!`;
    } else if (score >= 60) {
        matchLevel = 'strong match';
        description = `Your resume has a <span class="font-semibold text-gray-900">${matchLevel}</span> with this job description. With some improvements, you could increase your chances significantly.`;
    } else if (score >= 40) {
        matchLevel = 'moderate match';
        description = `Your resume has a <span class="font-semibold text-gray-900">${matchLevel}</span> with this job description. Consider highlighting more relevant skills and experience.`;
    } else {
        matchLevel = 'basic match';
        description = `Your resume has a <span class="font-semibold text-gray-900">${matchLevel}</span> with this job description. Significant improvements are needed to better align with the requirements.`;
    }

    scoreDescription.innerHTML = description;
}

// Populate matched skills
function populateMatchedSkills(skills) {
    const matchedSkillsList = document.getElementById('matchedSkillsList');
    const matchedSkillsCount = document.getElementById('matchedSkillsCount');

    matchedSkillsList.innerHTML = '';

    skills.forEach((skill, index) => {
        const skillItem = createSkillItem(skill, 'matched', index);
        matchedSkillsList.appendChild(skillItem);
    });

    matchedSkillsCount.textContent = skills.length;
}

// Populate missing skills
function populateMissingSkills(skills) {
    const missingSkillsList = document.getElementById('missingSkillsList');
    const missingSkillsCount = document.getElementById('missingSkillsCount');

    missingSkillsList.innerHTML = '';

    skills.forEach((skill, index) => {
        const skillItem = createSkillItem(skill, 'missing', index);
        missingSkillsList.appendChild(skillItem);
    });

    missingSkillsCount.textContent = skills.length;
}

// Create skill item element
function createSkillItem(skill, type, index) {
    const div = document.createElement('div');
    div.className = `skill-item ${type} flex items-center p-3 rounded-lg border`;
    div.style.animationDelay = `${index * 0.1}s`;

    if (type === 'matched') {
        div.classList.add('bg-green-50', 'border-green-100');
        div.innerHTML = `
            <svg class="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-gray-800 font-medium">${skill}</span>
        `;
    } else {
        div.classList.add('bg-amber-50', 'border-amber-100');
        div.innerHTML = `
            <svg class="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-gray-800 font-medium">${skill}</span>
        `;
    }

    return div;
}

// Populate suggestions
function populateSuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestionsList');

    suggestionsList.innerHTML = '';

    suggestions.forEach((suggestion, index) => {
        const suggestionItem = createSuggestionItem(suggestion, index);
        suggestionsList.appendChild(suggestionItem);
    });
}

// Create suggestion item element
function createSuggestionItem(suggestion, index) {
    const div = document.createElement('div');
    div.className = 'suggestion-item p-4 bg-purple-50 rounded-lg border border-purple-100';
    div.style.animationDelay = `${index * 0.1}s`;

    div.innerHTML = `
        <div class="flex items-start">
            <div class="bg-purple-200 rounded-full p-1 mr-3 mt-0.5">
                <span class="text-purple-700 font-bold text-sm px-2">${index + 1}</span>
            </div>
            <div class="flex-1">
                <h4 class="font-semibold text-gray-900 mb-1">${suggestion.title}</h4>
                <p class="text-sm text-gray-700">${suggestion.description}</p>
            </div>
        </div>
    `;

    return div;
}

// Animate score circle
function animateScoreCircle() {
    const scoreCircle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 90;

    scoreCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    scoreCircle.style.strokeDashoffset = circumference;

    // Trigger animation after a small delay
    setTimeout(() => {
        const score = 78; // This will be dynamic from the data
        const offset = circumference - (score / 100) * circumference;
        scoreCircle.style.transition = 'stroke-dashoffset 2s ease-out';
        scoreCircle.style.strokeDashoffset = offset;
    }, 100);
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + '%';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Export functions for Student B to use
window.ResumeAnalyzer = {
    loadAnalysisResults: loadAnalysisResults,
    populateScore: populateScore,
    populateMatchedSkills: populateMatchedSkills,
    populateMissingSkills: populateMissingSkills,
    populateSuggestions: populateSuggestions
};

// Add download report functionality
document.querySelector('button:has(svg path[d*="M4 16v1a3"])').addEventListener('click', () => {
    // Student B will implement actual PDF generation
    alert('Download functionality will be implemented by the backend team. This will generate a PDF report of your analysis.');
});
