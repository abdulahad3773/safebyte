// Password checker
const passwordInput = document.getElementById("passwordInput");
const checkPasswordButton = document.getElementById("checkPasswordBtn");

if (passwordInput && checkPasswordButton) {
  const result = document.getElementById("strengthLabel");

  checkPasswordButton.addEventListener("click", function () {
    const password = passwordInput.value;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;

    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (password.length === 0) {
      result.textContent = "Please enter a password.";
      result.className = "weak";
    } else if (password.length >= 12 && score === 4) {
      result.textContent = "Strong password! Excellent combination.";
      result.className = "strong";
    } else if (password.length >= 8 && score >= 3) {
      result.textContent = "Medium password. Improve its length or complexity.";
      result.className = "medium";
    } else {
      result.textContent = "Weak password. Add uppercase, lowercase, numbers and special characters.";
      result.className = "weak";
    }
  });
}


// Quiz
const quizMessage = document.getElementById("quizMessage");

if (quizMessage) {
  const questions = [
    {
      message: "Your account will be locked soon. Click this link to verify your password.",
      isPhishing: true,
      explanation: "The message creates urgency and asks you to use a link to verify your password."
    },
    {
      message: "The meeting has moved to 3 PM in Room 204. See you there.",
      isPhishing: false,
      explanation: "This ordinary update has no suspicious link or request for private information."
    },
    {
      message: "You won a gift card. Reply with your bank details to claim it.",
      isPhishing: true,
      explanation: "An unexpected prize and a request for bank details are warning signs."
    }
  ];

  const safeButton = document.getElementById("safeBtn");
  const phishingButton = document.getElementById("phishBtn");
  const feedback = document.getElementById("quizFeedback");
  const nextButton = document.getElementById("nextQuizBtn");

  let questionNumber = 0;

  function showQuestion() {
    quizMessage.textContent = questions[questionNumber].message;
    feedback.textContent = "";
    feedback.className = "quiz-feedback";
    safeButton.disabled = false;
    phishingButton.disabled = false;
    nextButton.hidden = true;
  }

  function checkAnswer(answerIsPhishing) {
    const question = questions[questionNumber];
    const isCorrect = answerIsPhishing === question.isPhishing;

    feedback.textContent = (isCorrect ? "Correct. " : "Not quite. ") + question.explanation;
    feedback.className = "quiz-feedback " + (isCorrect ? "correct" : "incorrect");

    safeButton.disabled = true;
    phishingButton.disabled = true;
    nextButton.hidden = false;
  }

  safeButton.addEventListener("click", function () {
    checkAnswer(false);
  });

  phishingButton.addEventListener("click", function () {
    checkAnswer(true);
  });

  nextButton.addEventListener("click", function () {
    questionNumber = (questionNumber + 1) % questions.length;
    showQuestion();
  });

  showQuestion();
}


// Form
const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
  const formStatus = document.getElementById("formStatus");

  feedbackForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    formStatus.textContent = "Sending feedback...";
    formStatus.className = "form-status success";

    try {
      const response = await fetch(feedbackForm.action, {
        method: "POST",
        body: new FormData(feedbackForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        formStatus.textContent = "Feedback sent successfully!";
        feedbackForm.reset();
      } else {
        formStatus.textContent = "Something went wrong. Please try again.";
        formStatus.className = "form-status error-status";
      }

    } catch {
      formStatus.textContent = "Network error. Please try again.";
      formStatus.className = "form-status error-status";
    }
  });
}