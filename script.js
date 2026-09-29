const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-speak]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      button.setAttribute('aria-label', 'Озвучивание недоступно в этом браузере');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(button.dataset.speak);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  });
});

let activeAudio = null;
document.querySelectorAll('[data-audio]').forEach((button) => {
  button.addEventListener('click', async () => {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      document.querySelectorAll('[data-audio]').forEach((item) => item.classList.remove('is-playing'));
    }
    if (activeAudio?.src.endsWith(button.dataset.audio)) {
      activeAudio = null;
      return;
    }
    activeAudio = new Audio(button.dataset.audio);
    button.classList.add('is-playing');
    activeAudio.addEventListener('ended', () => {
      button.classList.remove('is-playing');
      activeAudio = null;
    }, { once: true });
    try {
      await activeAudio.play();
    } catch (error) {
      button.classList.remove('is-playing');
      activeAudio = null;
      feedback.textContent = 'Не удалось открыть аудио. Проверь, что WAV-файлы лежат в папке assets/audio.';
    }
  });
});

const answers = document.querySelectorAll('.quiz-options button');
const feedback = document.querySelector('.quiz-feedback');
const resetButton = document.querySelector('.quiz-reset');

answers.forEach((answer) => {
  answer.addEventListener('click', () => {
    const isCorrect = answer.dataset.answer === 'today';
    answer.classList.add(isCorrect ? 'correct' : 'incorrect');
    answers.forEach((option) => { option.disabled = true; });
    feedback.textContent = isCorrect
      ? 'Правильно! “Today” значит «сегодня». Отличная работа!'
      : `Почти! Правильный ответ — today («сегодня»). Попробуй ещё раз.`;
    resetButton.hidden = false;
  });
});

resetButton.addEventListener('click', () => {
  answers.forEach((answer) => {
    answer.disabled = false;
    answer.classList.remove('correct', 'incorrect');
  });
  feedback.textContent = 'Твой первый ответ — отличный старт!';
  resetButton.hidden = true;
});
