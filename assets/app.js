'use strict';

/**
 * OR Learning Lab — interactive checklist.
 * No external dependencies, tracking, or Moodle API calls.
 */
const tasks = [
  'Паспорт ідеї та опис проблеми',
  'Щонайменше 5 референсів із коротким аналізом',
  '6 паперових ескізів (фото)',
  '9 адаптивних wireframes',
  'Колірна система, типографіка та відступи',
  'Не менше 6 наборів компонентів із варіантами',
  '3 завершені сторінки для комп’ютера',
  '3 завершені сторінки для планшета',
  '3 завершені сторінки для телефона',
  'Інтерактивний прототип і результати тестування'
];

const storageKey = 'or-learning-lab-uiux-stage-1-checklist-v1';
const checklist = document.querySelector('#checklist');
const progressBar = document.querySelector('#progress-bar');
const progressCount = document.querySelector('#progress-count');
const status = document.querySelector('#copy-status');

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(saved) ? saved.filter((index) => Number.isInteger(index) && index >= 0 && index < tasks.length) : [];
  } catch {
    return [];
  }
}

let completed = new Set(readProgress());

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...completed]));
  } catch {
    // The checklist remains usable when local storage is disabled.
  }
}

function updateProgress() {
  progressBar.value = completed.size;
  progressCount.textContent = `${completed.size} із ${tasks.length}`;
}

function renderChecklist() {
  const fragment = document.createDocumentFragment();

  tasks.forEach((task, index) => {
    const label = document.createElement('label');
    label.className = 'check-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = completed.has(index);
    input.addEventListener('change', () => {
      if (input.checked) {
        completed.add(index);
      } else {
        completed.delete(index);
      }
      saveProgress();
      updateProgress();
    });

    const text = document.createElement('span');
    text.textContent = task;
    label.append(input, text);
    fragment.append(label);
  });

  checklist.replaceChildren(fragment);
  updateProgress();
}

function checklistText() {
  return [
    'OR Learning Lab — Етап 1. UI/UX-дизайн',
    ...tasks.map((task, index) => `${completed.has(index) ? '[x]' : '[ ]'} ${task}`),
    `Виконано: ${completed.size} із ${tasks.length}`
  ].join('\n');
}

document.querySelector('#copy-checklist').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(checklistText());
    status.textContent = 'Чекліст скопійовано.';
  } catch {
    status.textContent = 'Копіювання недоступне. Скористайтеся друком або виділіть текст вручну.';
  }
});

document.querySelector('#reset-progress').addEventListener('click', () => {
  if (!window.confirm('Скинути всі позначки виконання на цьому пристрої?')) {
    return;
  }
  completed = new Set();
  saveProgress();
  renderChecklist();
  status.textContent = '';
});

document.querySelector('#print-page').addEventListener('click', () => {
  window.print();
});

renderChecklist();
