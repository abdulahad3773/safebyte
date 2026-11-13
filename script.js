// Password checker
const passwordInput = document.getElementById("passwordInput");
const checkPasswordButton = document.getElementById("checkPasswordBtn");

if (passwordInput && checkPasswordButton) {
  const result = document.getElementById("strengthLabel");

  checkPasswordButton.addEventListener("click", function () {
    const password = passwordInput.value;

    if (password.length === 0) {
      result.textContent = "Enter a sample password first.";
    } else if (password.length < 8) {
      result.textContent = "Weak: use at least 8 characters.";
    } else if (password.length < 12) {
      result.textContent = "Okay: try using 12 or more characters.";
    } else {
      result.textContent = "Good length. Use a unique password for every account.";
    }
  });
}

// Phishing quiz
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

// Feedback form with Formspree AJAX integration
const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const topic = document.getElementById("topic").value;
    const message = document.getElementById("message").value.trim();
    const consent = document.getElementById("consent").checked;

    const validName = name.length >= 2;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validTopic = topic !== "";
    const validMessage = message.length >= 10;

    document.getElementById("nameError").textContent = validName ? "" : "Enter at least 2 characters.";
    document.getElementById("emailError").textContent = validEmail ? "" : "Enter a valid email.";
    document.getElementById("topicError").textContent = validTopic ? "" : "Select a topic.";
    document.getElementById("messageError").textContent = validMessage ? "" : "Enter at least 10 characters.";
    document.getElementById("consentError").textContent = consent ? "" : "Please tick the confirmation box.";

    const status = document.getElementById("formStatus");
    const formIsValid = validName && validEmail && validTopic && validMessage && consent;

    if (formIsValid) {
      status.textContent = "Sending your feedback...";
      status.className = "form-status success";

      try {
        const response = await fetch(feedbackForm.action, {
          method: "POST",
          body: new FormData(feedbackForm),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          status.textContent = "Thank you! Your feedback has been sent successfully.";
          status.className = "form-status success";
          feedbackForm.reset();
        } else {
          const data = await response.json();
          if (data.hasOwnProperty('errors')) {
            status.textContent = data.errors.map(error => error.message).join(", ");
          } else {
            status.textContent = "Oops! There was a problem submitting your form.";
          }
          status.className = "form-status error-status";
        }
      } catch (error) {
        status.textContent = "Network error. Please check your connection and try again.";
        status.className = "form-status error-status";
      }
    } else {
      status.textContent = "Please correct the fields marked above.";
      status.className = "form-status error-status";
    }
  });
}