// DOM Elements
const resumeDropzone = document.getElementById('resumeDropzone');
const resumeInput = document.getElementById('resumeInput');
const jobDescDropzone = document.getElementById('jobDescDropzone');
const jobDescInput = document.getElementById('jobDescInput');
const togglePasteMode = document.getElementById('togglePasteMode');
const pasteSection = document.getElementById('pasteSection');
const jobDescText = document.getElementById('jobDescText');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

// State
let resumeFile = null;
let jobDescFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkAnalyzeButtonState();
});

// Setup Event Listeners
function setupEventListeners() {
    // Resume dropzone
    resumeDropzone.addEventListener('click', () => resumeInput.click());
    resumeDropzone.addEventListener('dragover', handleDragOver);
    resumeDropzone.addEventListener('dragleave', handleDragLeave);
    resumeDropzone.addEventListener('drop', (e) => handleDrop(e, 'resume'));
    resumeInput.addEventListener('change', (e) => handleFileSelect(e, 'resume'));

    // Job description dropzone
    jobDescDropzone.addEventListener('click', () => jobDescInput.click());
    jobDescDropzone.addEventListener('dragover', handleDragOver);
    jobDescDropzone.addEventListener('dragleave', handleDragLeave);
    jobDescDropzone.addEventListener('drop', (e) => handleDrop(e, 'jobDesc'));
    jobDescInput.addEventListener('change', (e) => handleFileSelect(e, 'jobDesc'));

    // Toggle paste mode
    togglePasteMode.addEventListener('click', () => {
        pasteSection.classList.toggle('hidden');
        const isHidden = pasteSection.classList.contains('hidden');
        togglePasteMode.innerHTML = isHidden
            ? 'Or paste job description as text <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>'
            : 'Hide text area <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>';
    });

    // Job description text area
    jobDescText.addEventListener('input', checkAnalyzeButtonState);

    // Analyze button
    analyzeBtn.addEventListener('click', handleAnalyze);
}

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
    e.currentTarget.style.transform = 'scale(1.02)';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    e.currentTarget.style.transform = 'scale(1)';
}

function handleDrop(e, type) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    e.currentTarget.style.transform = 'scale(1)';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (validateFile(file, type)) {
            updateFileState(file, type);
        }
    }
}

function handleFileSelect(e, type) {
    const file = e.target.files[0];
    if (file && validateFile(file, type)) {
        updateFileState(file, type);
    }
}

// File Validation
function validateFile(file, type) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = type === 'resume'
        ? ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
        : ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];

    if (file.size > maxSize) {
        showNotification('File size exceeds 5MB limit', 'error');
        return false;
    }

    if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload PDF, DOCX, or TXT files.', 'error');
        return false;
    }

    return true;
}

// Update File State
function updateFileState(file, type) {
    if (type === 'resume') {
        resumeFile = file;
        updateDropzoneUI(resumeDropzone, file);
    } else {
        jobDescFile = file;
        updateDropzoneUI(jobDescDropzone, file);
    }
    checkAnalyzeButtonState();
}

// Update Dropzone UI
function updateDropzoneUI(dropzone, file) {
    const fileIcon = `
        <svg class="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
    `;

    dropzone.innerHTML = `
        ${fileIcon}
        <p class="text-gray-700 font-medium mb-1">
            File uploaded: <span class="text-green-600">${truncateFileName(file.name)}</span>
        </p>
        <p class="text-sm text-gray-500">
            ${formatFileSize(file.size)} • Click to change
        </p>
    `;

    dropzone.classList.add('border-green-500', 'bg-green-50');
}

// Check if analyze button should be enabled
function checkAnalyzeButtonState() {
    const hasResume = resumeFile !== null;
    const hasJobDesc = jobDescFile !== null || jobDescText.value.trim() !== '';

    if (hasResume && hasJobDesc) {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        analyzeBtn.disabled = true;
        analyzeBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

// Handle Analyze Button Click
function handleAnalyze() {
    if (!resumeFile) {
        showNotification('Please upload your resume', 'error');
        return;
    }

    if (!jobDescFile && jobDescText.value.trim() === '') {
        showNotification('Please provide a job description', 'error');
        return;
    }

    // Show loading spinner
    loadingSpinner.classList.remove('hidden');

    // Simulate API call (Student B will replace this with actual backend integration)
    setTimeout(() => {
        // Store data in sessionStorage for results page
        const analysisData = {
            resumeFileName: resumeFile.name,
            jobDescFileName: jobDescFile ? jobDescFile.name : 'Pasted Text',
            timestamp: new Date().toISOString()
        };

        sessionStorage.setItem('analysisData', JSON.stringify(analysisData));

        // Redirect to results page
        window.location.href = 'results.html';
    }, 2000);
}

// Utility Functions
function truncateFileName(fileName, maxLength = 30) {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 4) + '...';
    return truncatedName + '.' + extension;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 animate-slideIn ${
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'success' ? 'bg-green-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide-in animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .animate-slideIn {
        animation: slideIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Prevent default drag behavior on the document
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.body.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});
