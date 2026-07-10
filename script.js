// ==========================================
// DATA STORE
// ==========================================

// Sample Notes Data
const notesData = [
    { id: 1, class: 10, subject: 'Mathematics', title: 'Quadratic Equations', description: 'Complete theory with solved examples.' },
    { id: 2, class: 10, subject: 'Science', title: 'Chemical Reactions', description: 'Types of reactions and balancing.' },
    { id: 3, class: 10, subject: 'English', title: 'Tenses & Grammar', description: 'All 12 tenses with examples.' },
    { id: 4, class: 10, subject: 'SST', title: 'Indian National Movement', description: 'Key events and leaders.' },
    { id: 5, class: 11, subject: 'Physics', title: 'Laws of Motion', description: 'Newton\'s laws with numericals.' },
    { id: 6, class: 11, subject: 'Chemistry', title: 'Atomic Structure', description: 'Quantum numbers and orbitals.' },
    { id: 7, class: 11, subject: 'Mathematics', title: 'Trigonometry', description: 'Identities and equations.' },
    { id: 8, class: 11, subject: 'Biology', title: 'Cell Division', description: 'Mitosis and meiosis explained.' },
    { id: 9, class: 12, subject: 'Physics', title: 'Electromagnetism', description: 'Maxwell equations and applications.' },
    { id: 10, class: 12, subject: 'Chemistry', title: 'Organic Chemistry', description: 'Reaction mechanisms.' },
    { id: 11, class: 12, subject: 'Mathematics', title: 'Calculus', description: 'Derivatives and integrals.' },
    { id: 12, class: 12, subject: 'English', title: 'Writing Skills', description: 'Essay, letter, and report writing.' }
];

// Sample Quiz Questions
const quizQuestions = [
    {
        question: 'What is the value of 2 + 2 × 2?',
        options: ['6', '8', '4', '2'],
        correct: 0 // index of correct answer
    },
    {
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 1
    },
    {
        question: 'What is the chemical symbol for Water?',
        options: ['H2O', 'CO2', 'NaCl', 'HCl'],
        correct: 0
    },
    {
        question: 'Who developed the theory of relativity?',
        options: ['Newton', 'Einstein', 'Hawking', 'Tesla'],
        correct: 1
    },
    {
        question: 'What is the square root of 144?',
        options: ['10', '11', '12', '13'],
        correct: 2
    },
    {
        question: 'Which gas do plants absorb from the atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        correct: 2
    }
];

// ==========================================
// STATE MANAGEMENT
// ==========================================

let currentUser = localStorage.getItem('edurise_user') || null;
let leaderboard = JSON.parse(localStorage.getItem('edurise_leaderboard')) || [];
let currentClassFilter = null; // 10, 11, 12, or null
let currentQuizIndex = 0;
let quizScore = 0;
let isQuizFinished = false;

// ==========================================
// DOM REFS
// ==========================================

const $ = (id) => document.getElementById(id);
const homeSection = $('home-section');
const notesSection = $('notes-section');
const quizSection = $('quiz-section');
const leaderboardSection = $('leaderboard-section');
const notesGrid = $('notesGrid');
const quizContainer = $('quizContainer');
const leaderboardContainer = $('leaderboardContainer');
const userDisplay = $('userDisplay');
const loginBtn = $('loginBtn');
const logoutBtn = $('logoutBtn');
const loginModal = $('loginModal');
const studentNameInput = $('studentNameInput');
const loginSubmitBtn = $('loginSubmitBtn');
const modalClose = document.querySelector('.modal-close');
const searchInput = $('searchInput');
const startLearningBtn = $('startLearningBtn');

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');
    // Close leaderboard if not needed, but we handle via direct calls.
}

function showHome() {
    showSection('home-section');
    renderNotes(); // reset to default view
    document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
}

function showNotes(classFilter = null) {
    currentClassFilter = classFilter;
    showSection('notes-section');
    renderNotes(classFilter);
}

function showQuiz() {
    currentQuizIndex = 0;
    quizScore = 0;
    isQuizFinished = false;
    showSection('quiz-section');
    renderQuiz();
}

function showLeaderboard() {
    showSection('leaderboard-section');
    renderLeaderboard();
}

// ==========================================
// RENDER: NOTES
// ==========================================

function renderNotes(classFilter = null) {
    let filtered = [...notesData];
    if (classFilter) {
        filtered = filtered.filter(n => n.class === classFilter);
    }
    // If search query exists, filter further
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        filtered = filtered.filter(n => 
            n.title.toLowerCase().includes(query) || 
            n.subject.toLowerCase().includes(query) ||
            n.description.toLowerCase().includes(query)
        );
    }

    if (filtered.length === 0) {
        notesGrid.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><p>No notes found matching your criteria.</p></div>`;
        return;
    }

    notesGrid.innerHTML = filtered.map(n => `
        <div class="note-card">
            <h3>${n.title}</h3>
            <p style="color: #64748b; font-size: 0.9rem; margin: 8px 0;">${n.description}</p>
            <span class="subject-badge">${n.subject}</span>
            <span class="class-tag">Class ${n.class}</span>
        </div>
    `).join('');
}

// ==========================================
// RENDER: QUIZ
// ==========================================

function renderQuiz() {
    if (isQuizFinished || currentQuizIndex >= quizQuestions.length) {
        showQuizResult();
        return;
    }

    const q = quizQuestions[currentQuizIndex];
    quizContainer.innerHTML = `
        <div class="quiz-box">
            <div class="quiz-header">
                <span>Question ${currentQuizIndex + 1} of ${quizQuestions.length}</span>
                <span>Score: ${quizScore}</span>
            </div>
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-options" id="quizOptions">
                ${q.options.map((opt, idx) => `
                    <button data-index="${idx}">${String.fromCharCode(65 + idx)}. ${opt}</button>
                `).join('')}
            </div>
        </div>
    `;

    // Attach event listeners to options
    document.querySelectorAll('#quizOptions button').forEach(btn => {
        btn.addEventListener('click', (e) => handleAnswer(e, btn));
    });
}

function handleAnswer(event, btn) {
    const selectedIdx = parseInt(btn.dataset.index);
    const q = quizQuestions[currentQuizIndex];
    const isCorrect = (selectedIdx === q.correct);
    if (isCorrect) quizScore++;

    // Disable all buttons and show correct/wrong
    const allBtns = document.querySelectorAll('#quizOptions button');
    allBtns.forEach((b, i) => {
        b.disabled = true;
        if (i === q.correct) b.classList.add('correct');
        if (i === selectedIdx && !isCorrect) b.classList.add('wrong');
    });

    // Move to next question after delay
    setTimeout(() => {
        currentQuizIndex++;
        if (currentQuizIndex >= quizQuestions.length) {
            isQuizFinished = true;
            // Save score to leaderboard
            if (currentUser && currentUser !== 'Guest') {
                const entry = {
                    name: currentUser,
                    score: quizScore,
                    date: new Date().toLocaleDateString()
                };
                leaderboard.push(entry);
                // Sort and keep only unique names with highest score (optional, but we keep all for simplicity)
                // Actually, let's keep only highest per user to avoid clutter
                const uniqueMap = new Map();
                leaderboard.forEach(item => {
                    if (!uniqueMap.has(item.name) || uniqueMap.get(item.name).score < item.score) {
                        uniqueMap.set(item.name, item);
                    }
                });
                leaderboard = Array.from(uniqueMap.values());
                // Sort immediately
                leaderboard.sort((a, b) => b.score - a.score);
                localStorage.setItem('edurise_leaderboard', JSON.stringify(leaderboard));
            }
            renderQuiz(); // This will call showQuizResult
        } else {
            renderQuiz();
        }
    }, 1200);
}

function showQuizResult() {
    const total = quizQuestions.length;
    const percentage = Math.round((quizScore / total) * 100);
    let message = 'Keep practicing!';
    if (percentage >= 80) message = '🌟 Excellent performance!';
    else if (percentage >= 50) message = '👍 Good job! Keep it up.';
    else message = '📚 Review the notes and try again!';

    quizContainer.innerHTML = `
        <div class="quiz-box">
            <div class="quiz-result">
                <div class="score-big">${quizScore} / ${total}</div>
                <p>${percentage}% - ${message}</p>
                <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn-primary" onclick="showHome()"><i class="fas fa-home"></i> Home</button>
                    <button class="btn-primary" style="background: var(--gradient-hover);" onclick="showLeaderboard()"><i class="fas fa-trophy"></i> Leaderboard</button>
                    <button class="btn-primary" style="background: #f59e0b;" onclick="showQuiz()"><i class="fas fa-redo"></i> Retry Quiz</button>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// RENDER: LEADERBOARD
// ==========================================

function renderLeaderboard() {
    if (leaderboard.length === 0) {
        leaderboardContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-trophy" style="color: #d1d5db;"></i>
                <p>No scores yet. Take the quiz to appear on the leaderboard!</p>
                <button class="btn-primary" style="margin-top: 20px;" onclick="showQuiz()"><i class="fas fa-puzzle-piece"></i> Take Quiz</button>
            </div>
        `;
        return;
    }

    // Sort (already sorted but ensure)
    leaderboard.sort((a, b) => b.score - a.score);

    let html = `
        <div class="leaderboard-table">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Student</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
    `;

    leaderboard.forEach((entry, index) => {
        let rank = index + 1;
        let medal = '';
        let rowClass = '';
        if (index === 0) { medal = '🥇'; rowClass = 'gold-row'; }
        else if (index === 1) { medal = '🥈'; rowClass = 'silver-row'; }
        else if (index === 2) { medal = '🥉'; rowClass = 'bronze-row'; }
        else { medal = `#${rank}`; }

        html += `
            <tr class="${rowClass}">
                <td><span class="medal">${medal}</span></td>
                <td><strong>${entry.name}</strong></td>
                <td>${entry.score} / ${quizQuestions.length}</td>
                <td>${entry.date || 'Today'}</td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    leaderboardContainer.innerHTML = html;
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    // If we are on home, we can show notes automatically or just filter later.
    // For better UX, if home is active, navigate to notes with filter.
    if (homeSection.classList.contains('active')) {
        if (query.length > 0) {
            showNotes(null); // Will use search input value inside renderNotes
        } else {
            // If search cleared on home, show home again
            showHome();
        }
    } else if (notesSection.classList.contains('active')) {
        renderNotes(currentClassFilter);
    }
});

// Override showNotes to pass filter properly
const originalShowNotes = showNotes;
showNotes = function(classFilter = null) {
    currentClassFilter = classFilter;
    showSection('notes-section');
    renderNotes(classFilter);
};
// Override showHome to reset search? No, keep as is.

// ==========================================
// LOGIN SYSTEM
// ==========================================

function updateUIForUser() {
    if (currentUser && currentUser !== 'Guest') {
        userDisplay.textContent = currentUser;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        userDisplay.textContent = 'Guest';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        currentUser = 'Guest';
        localStorage.setItem('edurise_user', 'Guest');
    }
}

function openLoginModal() {
    loginModal.classList.add('show');
    studentNameInput.value = '';
    setTimeout(() => studentNameInput.focus(), 100);
}

function closeLoginModal() {
    loginModal.classList.remove('show');
}

function loginUser(name) {
    const trimmed = name.trim();
    if (trimmed === '') {
        alert('Please enter your name.');
        return;
    }
    currentUser = trimmed;
    localStorage.setItem('edurise_user', trimmed);
    updateUIForUser();
    closeLoginModal();
    // Refresh leaderboard if visible
    if (leaderboardSection.classList.contains('active')) renderLeaderboard();
}

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = 'Guest';
        localStorage.setItem('edurise_user', 'Guest');
        updateUIForUser();
        // Show home
        showHome();
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Login
loginBtn.addEventListener('click', openLoginModal);
modalClose.addEventListener('click', closeLoginModal);
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLoginModal();
});
loginSubmitBtn.addEventListener('click', () => loginUser(studentNameInput.value));
studentNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginUser(studentNameInput.value);
});
logoutBtn.addEventListener('click', logoutUser);

// Navigation Buttons
document.querySelectorAll('.btn-class').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const classVal = parseInt(btn.dataset.class);
        showNotes(classVal);
    });
});

document.getElementById('notesNavBtn').addEventListener('click', () => showNotes(null));
document.getElementById('quizNavBtn').addEventListener('click', showQuiz);

// Start Learning -> Shows Notes
startLearningBtn.addEventListener('click', () => showNotes(null));

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
    // Set initial user
    if (!currentUser) {
        currentUser = 'Guest';
        localStorage.setItem('edurise_user', 'Guest');
    }
    updateUIForUser();
    // Show home
    showHome();
    // Pre-populate leaderboard with sample data if empty (for demo)
    if (leaderboard.length === 0) {
        // Add a dummy entry to show UI, but only if user is not guest? Actually let's keep it empty for clean start.
        // Uncomment below to add a demo entry:
        // leaderboard = [{ name: 'Rahul Sharma', score: 5, date: '2026-07-10' }];
        // localStorage.setItem('edurise_leaderboard', JSON.stringify(leaderboard));
    }
}

// Run the app
init();

// Expose functions globally for inline HTML onclick
window.showHome = showHome;
window.showNotes = showNotes;
window.showQuiz = showQuiz;
window.showLeaderboard = showLeaderboard;
window.renderNotes = renderNotes;
window.renderLeaderboard = renderLeaderboard;
window.showQuizResult = showQuizResult;
window.loginUser = loginUser;
window.closeLoginModal = closeLoginModal;
