// Quiz System Functionality
class QuizSystem {
    constructor(quizContainer, quizData) {
        this.quizContainer = document.querySelector(quizContainer);
        this.quizData = quizData;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedModule = null;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Module selection listeners would be added dynamically
        if (this.quizContainer) {
            this.quizContainer.addEventListener('click', (event) => {
                const moduleBtn = event.target.closest('.module-select-btn');
                if (moduleBtn) {
                    this.startQuiz(moduleBtn.dataset.module);
                }

                const optionBtn = event.target.closest('.quiz-option');
                if (optionBtn) {
                    this.selectOption(optionBtn);
                }

                const nextBtn = event.target.closest('#nextQuestionBtn');
                if (nextBtn) {
                    this.nextQuestion();
                }

                const retryBtn = event.target.closest('#retryQuizBtn');
                if (retryBtn) {
                    this.resetQuiz();
                }
            });
        }
    }

    startQuiz(moduleName) {
        this.selectedModule = this.quizData.find(module => module.id === moduleName);
        if (!this.selectedModule) {
            console.error('Module not found');
            return;
        }

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.renderQuestion();
    }

    renderQuestion() {
        if (!this.selectedModule) return;

        const currentQuestion = this.selectedModule.questions[this.currentQuestionIndex];
        
        const quizHtml = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <h2>${this.selectedModule.title}</h2>
                    <p>Frage ${this.currentQuestionIndex + 1} von ${this.selectedModule.questions.length}</p>
                </div>
                <div class="quiz-content">
                    <h3>${currentQuestion.text}</h3>
                    <ul class="quiz-options">
                        ${currentQuestion.options.map((option, index) => `
                            <li class="quiz-option" data-index="${index}" data-correct="${option.correct}">
                                ${option.text}
                            </li>
                        `).join('')}
                    </ul>
                    <div class="quiz-feedback" style="display: none;">
                        <p class="feedback-text"></p>
                    </div>
                </div>
                <div class="quiz-footer">
                    <button id="nextQuestionBtn" class="btn btn-primary" disabled>Nächste Frage</button>
                </div>
            </div>
        `;

        this.quizContainer.innerHTML = quizHtml;
    }

    selectOption(optionElement) {
        // Remove previous selections
        const options = this.quizContainer.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });

        // Mark current selection
        optionElement.classList.add('selected');

        // Show feedback
        const feedbackContainer = this.quizContainer.querySelector('.quiz-feedback');
        const currentQuestion = this.selectedModule.questions[this.currentQuestionIndex];
        const isCorrect = optionElement.dataset.correct === 'true';
        
        if (isCorrect) {
            optionElement.classList.add('correct');
            this.score++;
        } else {
            optionElement.classList.add('incorrect');
            // Highlight the correct answer
            const correctOption = Array.from(options).find(opt => opt.dataset.correct === 'true');
            if (correctOption) correctOption.classList.add('correct');
        }

        // Show feedback text
        const feedbackText = this.quizContainer.querySelector('.feedback-text');
        feedbackText.textContent = isCorrect 
            ? currentQuestion.feedback.correct 
            : currentQuestion.feedback.incorrect;
        feedbackContainer.style.display = 'block';

        // Enable next question button
        const nextBtn = this.quizContainer.querySelector('#nextQuestionBtn');
        nextBtn.disabled = false;
    }

    nextQuestion() {
        this.currentQuestionIndex++;

        // Check if quiz is finished
        if (this.currentQuestionIndex >= this.selectedModule.questions.length) {
            this.showResults();
            return;
        }

        // Render next question
        this.renderQuestion();
    }

    showResults() {
        const resultHtml = `
            <div class="quiz-results">
                <h2>Quiz Ergebnisse</h2>
                <div class="result-score">
                    <p>Du hast ${this.score} von ${this.selectedModule.questions.length} Fragen richtig beantwortet.</p>
                    <div class="result-percentage">
                        ${Math.round((this.score / this.selectedModule.questions.length) * 100)}%
                    </div>
                </div>
                <div class="quiz-actions">
                    <button id="retryQuizBtn" class="btn btn-primary">Quiz wiederholen</button>
                    <a href="../index.html" class="btn btn-secondary">Zurück zur Übersicht</a>
                </div>
            </div>
        `;

        this.quizContainer.innerHTML = resultHtml;
    }

    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.renderQuestion();
    }
}

// Quiz Data (could be imported from external JSON)
const quizModules = [
    {
        id: 'anatomie',
        title: 'Anatomie & Physiologie',
        questions: [
            {
                text: 'Welcher Muskel ist der Hauptakteur bei der Kniestreckung?',
                options: [
                    { text: 'M. quadriceps femoris', correct: true },
                    { text: 'M. biceps femoris', correct: false },
                    { text: 'M. gastrocnemius', correct: false },
                    { text: 'M. tibialis anterior', correct: false }
                ],
                feedback: {
                    correct: 'Der M. quadriceps femoris (Oberschenkelstrecker) ist der Hauptmuskel für die Kniestreckung und besteht aus vier Teilen: Rectus femoris, Vastus medialis, Vastus lateralis und Vastus intermedius.',
                    incorrect: 'Der M. quadriceps femoris ist der Hauptmuskel für die Kniestreckung. Der Bizeps femoris ist Teil der hinteren Oberschenkelmuskulatur (Hamstrings) und beugt das Knie.'
                }
            },
            {
                text: 'Welche Funktion hat das Schulterblatt (Scapula)?',
                options: [
                    { text: 'Es verbindet den Oberarmknochen mit dem Schlüsselbein', correct: false },
                    { text: 'Es dient als Ansatzfläche für mehrere Muskeln und ermöglicht Bewegung des Armes', correct: true },
                    { text: 'Es schützt die Lunge vor äußeren Einwirkungen', correct: false },
                    { text: 'Es stabilisiert den Nacken bei Rotationsbewegungen', correct: false }
                ],
                feedback: {
                    correct: 'Das Schulterblatt (Scapula) dient in erster Linie als Ansatzfläche für viele Muskeln, die für die Bewegung und Stabilisation des Arms und der Schulter wichtig sind.',
                    incorrect: 'Das Schulterblatt (Scapula) dient hauptsächlich als Ansatzfläche für Muskeln und ist essenziell für die Beweglichkeit des Arms.'
                }
            }
        ]
    },
    {
        id: 'biomechanik',
        title: 'Biomechanik',
        questions: [
            {
                text: 'Welches Newtonsche Gesetz beschreibt die Trägheit?',
                options: [
                    { text: 'Gesetz der Trägheit (1. Newtonsches Gesetz)', correct: true },
                    { text: 'Aktionsgesetz (2. Newtonsches Gesetz)', correct: false },
                    { text: 'Reaktionsgesetz (3. Newtonsches Gesetz)', correct: false },
                    { text: 'Gravitationsgesetz', correct: false }
                ],
                feedback: {
                    correct: 'Das 1. Newtonsche Gesetz besagt, dass ein Körper in Ruhe oder gleichförmiger Bewegung bleibt, solange keine äußere Kraft auf ihn einwirkt.',
                    incorrect: 'Das 1. Newtonsche Gesetz beschreibt die Trägheit eines Körpers und seine Tendenz, seinen Bewegungszustand beizubehalten.'
                }
            },
            {
                text: 'Was beschreibt das 2. Newtonsche Gesetz (F = m × a)?',
                options: [
                    { text: 'Jede Aktion erzeugt eine gleich große, entgegengesetzte Reaktion', correct: false },
                    { text: 'Die Beschleunigung eines Körpers ist proportional zur einwirkenden Kraft und umgekehrt proportional zu seiner Masse', correct: true },
                    { text: 'Die Gravitationskraft zwischen zwei Körpern', correct: false },
                    { text: 'Die Trägheit eines Körpers', correct: false }
                ],
                feedback: {
                    correct: 'Das 2. Newtonsche Gesetz beschreibt den Zusammenhang zwischen Kraft, Masse und Beschleunigung. Je größer die Kraft, desto größer die Beschleunigung, und je größer die Masse, desto geringer die Beschleunigung.',
                    incorrect: 'Das 2. Newtonsche Gesetz besagt, dass die Beschleunigung eines Körpers proportional zur einwirkenden Kraft und umgekehrt proportional zu seiner Masse ist.'
                }
            }
        ]
    },
    {
        id: 'ernaehrung',
        title: 'Ernährung',
        questions: [
            {
                text: 'Welchen Energiegehalt haben Kohlenhydrate pro Gramm?',
                options: [
                    { text: '4 kcal', correct: true },
                    { text: '7 kcal', correct: false },
                    { text: '9 kcal', correct: false },
                    { text: '12 kcal', correct: false }
                ],
                feedback: {
                    correct: 'Kohlenhydrate liefern 4 kcal (Kilokalorien) pro Gramm, genauso wie Proteine.',
                    incorrect: 'Kohlenhydrate liefern 4 kcal pro Gramm. Zum Vergleich: Proteine liefern ebenfalls 4 kcal/g, Fette 9 kcal/g und Alkohol 7 kcal/g.'
                }
            }
        ]
    }
];

// Initialize Quiz System when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the quiz container exists
    const quizContainer = document.querySelector('#quiz-container');
    if (quizContainer) {
        const quizSystem = new QuizSystem('#quiz-container', quizModules);
    }
});

// Optional: Export for potential module usage
export { QuizSystem, quizModules };
