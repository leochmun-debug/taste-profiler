// State
let currentState = 0; 
let answers = {};
let questions = [];

const availableImages = [
    "Captura de pantalla 2026-08-18 a la(s) 1.04.49 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.05.34 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.07.30 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.29.52 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.33.07 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.33.19 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.33.34 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.38.39 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.40.29 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.41.14 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.45.15 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.45.35 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.51.34 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.51.48 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.53.21 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.53.31 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.53.47 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.54.05 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.54.40 p.m..png",
    "Captura de pantalla 2026-08-18 a la(s) 1.59.12 p.m..png"
];

// Base Text Questions
const textQuestions = [
    {
        id: 1,
        type: "text",
        question: "¿qué marca es más de tu preferencia si vas a usar un traje para una grad del Tec?",
        options: ["GUCCI", "HUGO BOSS"],
        label: "fashion",
        prompt: "¿qué marca es más de tu preferencia si vas a usar un traje para una grad del Tec?"
    },
    {
        id: 2,
        type: "image-choice",
        question: "supongamos que va a viajar a Roma mañana, ¿qué maleta ligera te llevas?",
        options: [
            { label: "MONT BLANC", value: "MONT BLANC", image: "./images/mont_blanc_brief_case.png" },
            { label: "PRADA", value: "PRADA", image: "./images/Leather_duffel_bag_Prada.png" }
        ],
        label: "travel preference",
        prompt: "supongamos que va a viajar a Roma mañana, ¿qué maleta ligera te llevas?"
    },
    {
        id: 3,
        type: "text",
        question: "¿Qué prefieres tratándose de tu automóvil?",
        options: ["JAPONÉS", "ALEMÁN"],
        label: "lifestyle",
        prompt: "¿Qué prefieres tratándose de tu automóvil?"
    },
    {
        id: 4,
        type: "text",
        question: "¿En un viaje a Europa qué eliges?",
        options: ["LONDRES", "PARÍS"],
        label: "travel",
        prompt: "¿En un viaje a Europa qué eliges?"
    },
    {
        id: 5,
        type: "text",
        question: "Para el fin de semana:",
        options: ["CABAÑA AISLADA EN EL BOSQUE", "HOTEL BOUTIQUE EN EL CENTRO"],
        label: "leisure",
        prompt: "Para el fin de semana:"
    }
];

// Elements
const appContainer = document.getElementById('app');

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Initialization
function init() {
    // Check local storage for saved state
    const savedState = localStorage.getItem('tasteProfilerState');
    const savedAnswers = localStorage.getItem('tasteProfilerAnswers');
    const savedQuestions = localStorage.getItem('tasteProfilerQuestions');
    
    if (savedState && savedAnswers && savedQuestions) {
        currentState = parseInt(savedState);
        answers = JSON.parse(savedAnswers);
        questions = JSON.parse(savedQuestions);
    } else {
        // Generate questions array dynamically
        questions = [...textQuestions];
        
        let shuffledImages = shuffle([...availableImages]).slice(0, 10);
        shuffledImages.forEach((img, index) => {
            questions.push({
                id: questions.length + 1,
                type: "image",
                question: "like or dislike",
                // Make sure to correctly encode the path because of spaces and special chars
                image: encodeURI(`./images/${img}`),
                filename: img,
                options: ["like", "not quite"],
                label: `image ${index + 1}`,
                prompt: "like or dislike"
            });
        });
        localStorage.setItem('tasteProfilerQuestions', JSON.stringify(questions));
    }
    
    render();
}

function saveState() {
    localStorage.setItem('tasteProfilerState', currentState);
    localStorage.setItem('tasteProfilerAnswers', JSON.stringify(answers));
}

// Ensure globally available for inline onclick
window.clearState = function() {
    localStorage.removeItem('tasteProfilerState');
    localStorage.removeItem('tasteProfilerAnswers');
    localStorage.removeItem('tasteProfilerQuestions');
    currentState = 0;
    answers = {};
    init(); // Re-initialize to generate new random images
}

window.selectOption = function(questionId, option) {
    answers[questionId] = option;
    saveState();
    
    // Add selected class to the clicked button for visual feedback
    const buttons = document.querySelectorAll('.option-button, .image-choice-btn');
    buttons.forEach(btn => {
        const value = btn.dataset.value || btn.innerText.trim();
        if (value === option) {
            btn.classList.add('selected');
        }
    });

    // Advance after brief delay
    setTimeout(() => {
        currentState++;
        saveState();
        render();
    }, 400);
}

window.goBack = function() {
    if (currentState > 0) {
        currentState--;
        saveState();
        render();
    }
}

window.startBrief = function() {
    currentState = 1;
    saveState();
    render();
}

// Glyph Component (Logo from user's assets)
const getGlyph = () => `
    <div class="top-glyph">
        <img src="./images/logo.png" alt="Logo" style="width: 45px; height: auto; object-fit: contain;">
    </div>
`;

// Render logic
function render() {
    appContainer.innerHTML = ''; // Clear current
    window.scrollTo(0, 0);

    if (currentState === 0) {
        renderWelcome();
    } else if (currentState <= questions.length) {
        renderQuestion(questions[currentState - 1]);
    } else {
        renderCompletion();
    }
}

function renderWelcome() {
    const screen = document.createElement('div');
    screen.className = 'screen welcome-screen';
    
    screen.innerHTML = `
        <h1 class="main-title font-primary">mood-board,<br>design brief</h1>
        <div class="subtitle font-secondary">private brief for your new home, Jorge</div>
        
        <div class="progress-header font-secondary">
            <span>welcome</span>
            <span>0 / ${questions.length}</span>
        </div>
        <hr class="divider">
        
        <div class="intro-box font-primary">
            este es un brief de diseño para crear un mood-board ultra-personalizado para ti
        </div>
        
        <div class="category-label font-primary">fashion, culture and taste</div>
        <div class="category-desc font-secondary">
            todas son preguntas curadas para lograr captar<br>
            ideas, gustos, ambientes y sensaciones que sean<br>
            importantes en este proceso de diseño.
        </div>
        
        <button class="cta-button font-primary" onclick="startBrief()">empecemos el brief</button>
    `;
    
    appContainer.appendChild(screen);
}

function renderQuestion(q) {
    const screen = document.createElement('div');
    screen.className = 'screen question-screen';
    
    let contentHtml = '';
    
    if (q.type === 'text') {
        contentHtml = `
            <div class="question-prompt font-primary">
                ${q.prompt.split(' ').map(word => `<span>${word}</span>`).join(' ')}
            </div>
            <div class="options-container">
                ${q.options.map(opt => `
                    <button class="option-button font-primary ${answers[q.id] === opt ? 'selected' : ''}" 
                            onclick="selectOption(${q.id}, '${opt}')">${opt}</button>
                `).join('')}
            </div>
        `;
    } else if (q.type === 'image') {
        contentHtml = `
            <div class="question-prompt font-primary" style="justify-content: flex-end;">
                <span>${q.prompt}</span>
            </div>
            <div class="image-container">
                <img src="${q.image}" alt="Reference Image" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
            </div>
            <div class="options-container">
                ${q.options.map(opt => `
                    <button class="option-button image-option font-primary ${answers[q.id] === opt ? 'selected' : ''}" 
                            onclick="selectOption(${q.id}, '${opt}')">${opt}</button>
                `).join('')}
            </div>
        `;
    } else if (q.type === 'image-choice') {
        contentHtml = `
            <div class="question-prompt font-primary">
                ${q.prompt.split(' ').map(word => `<span>${word}</span>`).join(' ')}
            </div>
            <div class="options-container" style="flex-direction: row; gap: 10px; margin-top: 20px;">
                ${q.options.map((opt) => `
                    <div style="flex: 1; border: 1px solid var(--border-color); cursor: pointer; display: flex; flex-direction: column;" 
                         class="image-choice-btn ${answers[q.id] === opt.value ? 'selected' : ''}" data-value="${opt.value}"
                         onclick="selectOption(${q.id}, '${opt.value}')">
                         <div style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; background-color: #fff;">
                             <img src="${opt.image}" style="width: 100%; height: auto; max-height: 150px; object-fit: contain; display: block;">
                         </div>
                         <div class="font-primary label-text" style="text-align: center; padding: 10px; font-weight: bold; border-top: 1px solid var(--border-color); font-size: 12px;">
                             ${opt.label}
                         </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    screen.innerHTML = `
        ${getGlyph()}
        <div class="subtitle font-secondary">a private design brief just for you, Jorge.</div>
        
        <div class="progress-header font-secondary">
            <span>${q.label}</span>
            <span>${q.id} / ${questions.length}</span>
        </div>
        <hr class="divider">
        
        <div class="section-lead font-primary">
            estas son algunas preguntas de preferencias<br>personales
        </div>
        
        ${contentHtml}
        
        <div class="bottom-controls">
            <button class="back-button font-primary" onclick="goBack()">back</button>
            <button class="clear-button font-secondary" onclick="clearState()">clear saved answers</button>
        </div>
    `;
    
    appContainer.appendChild(screen);
}

function renderCompletion() {
    const screen = document.createElement('div');
    screen.className = 'screen completion-screen';
    
    // Format answers for email
    let emailBodyText = "Hello,\n\nHere are my design brief answers:\n\n";
    questions.forEach(q => {
        if (q.type === 'text') {
            emailBodyText += `Question: ${q.question}\nAnswer: ${answers[q.id]}\n\n`;
        } else if (q.type === 'image') {
            emailBodyText += `Image File: ${q.filename}\nAnswer: ${answers[q.id]}\n\n`;
        }
    });
    
    // We will inject the Formspree fetch logic into the DOM via onclick
    window.emailBodyText = emailBodyText;
    
    screen.innerHTML = `
        <div class="completion-header font-primary">
            your brief
            <span class="font-secondary">is prepared</span>
        </div>
        
        <div class="progress-header font-secondary" style="justify-content: space-between; margin-bottom: 20px;">
            <span>complete</span>
            <span>${questions.length} / ${questions.length}</span>
        </div>
        
        <h1 class="hero-heading font-primary">thank you</h1>
        
        <div class="confirmation-text font-secondary">
            your valuable answers have been prepared and we are<br>
            thrilled to start working on your project.
        </div>
        
        <div class="centered-glyph">
             ${getGlyph().replace('class="top-glyph"', 'style="position: relative;"')}
        </div>
        
        <button id="formspree-btn" class="share-btn font-primary" onclick="submitToFormspree()">Send Answers to Designer</button>
        
        <div class="contact-info font-secondary" style="margin-top: 20px;">
            contact info. leo.ch.mun@gmail.com<br>
            +52 2282 88 8275
        </div>
    `;
    
    appContainer.appendChild(screen);
}

// Formspree Integration Logic
window.submitToFormspree = async function() {
    const btn = document.getElementById('formspree-btn');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    // ⚠️ Waiting for the Formspree endpoint URL from the user
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xeajvged';

    if (FORMSPREE_ENDPOINT === 'YOUR_FORMSPREE_URL_HERE') {
        alert("Please provide your Formspree endpoint URL to complete the integration.");
        btn.innerText = originalText;
        btn.disabled = false;
        return;
    }

    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                subject: "New Taste Profiler Submission",
                answers: window.emailBodyText
            })
        });

        if (response.ok) {
            btn.innerText = 'Sent Successfully!';
            btn.style.backgroundColor = 'var(--active-color)';
            btn.style.color = '#000';
            btn.style.border = '1px solid var(--border-color)';
        } else {
            alert('Oops! There was a problem submitting your form.');
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        alert('Oops! There was a problem submitting your form.');
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// Start app
document.addEventListener('DOMContentLoaded', init);
