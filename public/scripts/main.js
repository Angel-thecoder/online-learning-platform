document.addEventListener('DOMContentLoaded', () => {
  // ===== Contact Form =====
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        status.innerText = 'All fields are required.';
        status.style.color = 'red';
        return;
      }

      if (!emailPattern.test(email)) {
        status.innerText = 'Please enter a valid email address.';
        status.style.color = 'red';
        return;
      }

      if (message.length < 10) {
        status.innerText = 'Message must be at least 10 characters.';
        status.style.color = 'red';
        return;
      }

      try {
        const res = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        const data = await res.json();

        if (res.ok) {
          status.innerText = 'Message sent successfully!';
          status.style.color = 'green';
          form.reset();
        } else {
          status.innerText = data.error || 'Failed to send message.';
          status.style.color = 'red';
        }
      } catch (error) {
        status.innerText = 'Something went wrong. Please try again.';
        status.style.color = 'red';
      }
    });
  }

  // ===== Events Filter (AJAX) =====
  const filterForm = document.getElementById('filter-form');
  const eventList = document.getElementById('event-list');

  if (filterForm && eventList) {
    const selects = filterForm.querySelectorAll('select');

    selects.forEach(select => {
      select.addEventListener('change', () => {
        const year = document.getElementById('filter-year').value;
        const type = document.getElementById('filter-type').value;
        const course = document.getElementById('filter-course').value;
        const instructor = document.getElementById('filter-instructor').value;

        const params = new URLSearchParams({ year, type, course, instructor });

        fetch(`/events/filter?${params.toString()}`)
          .then(res => res.text())
          .then(html => {
            eventList.innerHTML = html;
          })
          .catch(error => {
            eventList.innerHTML = '<p>Error loading events. Please try again.</p>';
            console.error('Event AJAX error:', error);
          });
      });
    });
  }

  // ===== Quiz Cube Spinner =====
  const cube = document.getElementById('cube');
  const spinBtn = document.getElementById('spin-btn');
  const quizArea = document.getElementById('quiz-area');
  const questionText = document.getElementById('question-text');
  const answerButtons = document.getElementById('answer-buttons');
  const feedback = document.getElementById('feedback');

  if (cube && spinBtn && quizArea && questionText && answerButtons && feedback) {
    const questions = {
      'Web Dev': {
        question: 'What does HTML stand for?',
        answers: ['HyperText Markup Language', 'HotMail', 'Hyperlinking Text Maps'],
        correct: 0
      },
      'SQL': {
        question: 'Which SQL command retrieves data?',
        answers: ['GET', 'SELECT', 'RETRIEVE'],
        correct: 1
      },
      'Cloud': {
        question: 'What does AWS stand for?',
        answers: ['Amazon Web Services', 'Advanced Web Storage', 'Automatic Web Sync'],
        correct: 0
      },
      'Design': {
        question: 'Which tool is best for UI/UX design?',
        answers: ['Figma', 'Notepad', 'Excel'],
        correct: 0
      },
      'Security': {
        question: 'What is a strong password example?',
        answers: ['12345678', 'password1', 'T9u!xR@7eL'],
        correct: 2
      },
      'Networking': {
        question: 'What device forwards data between networks?',
        answers: ['Router', 'Keyboard', 'Monitor'],
        correct: 0
      }
    };

    let xRotation = 0;
    let yRotation = 0;

    spinBtn.addEventListener('click', () => {
      const xRand = Math.floor(Math.random() * 4 + 1) * 90;
      const yRand = Math.floor(Math.random() * 4 + 1) * 90;
      xRotation += xRand;
      yRotation += yRand;

      cube.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;

      setTimeout(() => {
        const faces = ['front', 'right', 'back', 'left', 'top', 'bottom'];
        const index = Math.floor(Math.random() * faces.length);
        const face = faces[index];
        const label = cube.querySelector(`.${face}`).textContent;
        loadQuestion(label);
      }, 1500);
    });

    function loadQuestion(topic) {
      const data = questions[topic];
      if (!data) return;

      questionText.textContent = data.question;
      answerButtons.innerHTML = '';
      feedback.classList.add('hidden');

      data.answers.forEach((answer, i) => {
        const btn = document.createElement('button');
        btn.textContent = answer;
        btn.setAttribute('data-index', i);
        btn.setAttribute('aria-label', `Answer: ${answer}`);
        btn.addEventListener('click', () => {
          if (i === data.correct) {
            feedback.textContent = 'Correct!';
            feedback.style.color = 'green';
          } else {
            feedback.textContent = 'Try again.';
            feedback.style.color = 'red';
          }
          feedback.classList.remove('hidden');
        });
        answerButtons.appendChild(btn);
      });

      document.getElementById('quiz-question').classList.remove('hidden');
    }
  }
});

// === Live Course Search (AJAX) ===
const searchInput = document.getElementById('course-search');
const courseResults = document.getElementById('course-results');

if (searchInput && courseResults) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    fetch(`/courses/search?q=${encodeURIComponent(query)}`)
      .then(res => res.text())
      .then(html => {
        courseResults.innerHTML = html;
      })
      .catch(err => {
        courseResults.innerHTML = '<p>Error loading search results.</p>';
        console.error('Course search error:', err);
      });
  });
}
