const regionData = {
  almaty: {
    title: "г. Алматы",
    text: "Фокус: городские цифровые инициативы, партнеры, вопросы качества связи, координация с профильными управлениями.",
    chips: ["Акимат города", "партнеры", "цифровизация"]
  },
  oblast: {
    title: "Алматинская область",
    text: "Фокус: районные акиматы, социальные объекты, инфраструктура, доступ к площадкам и контроль сроков.",
    chips: ["районы", "соцобъекты", "инфраструктура"]
  },
  zhetysu: {
    title: "Жетысуская область",
    text: "Фокус: межрайонная координация, проекты связи, встречи с МИО и фиксация поручений по территориям.",
    chips: ["МИО", "проекты связи", "поручения"]
  }
};

const defaultTasks = [
  ["2026-07-05", "Акимат г. Алматы", "GR-встреча по городским цифровым сервисам", "г. Алматы", "В работе"],
  ["2026-07-08", "Акимат Алматинской области", "Доступ к площадкам для подключения соцобъектов", "Алматинская область", "Срочно"],
  ["2026-07-10", "Партнер B2G", "Сверка статуса совместной инициативы", "Жетысуская область", "План"]
];

const defaultContacts = [
  ["Алия Садыкова", "Управление цифровизации", "Руководитель направления", "цифровые проекты"],
  ["Ерлан Мусин", "Районный акимат", "Заместитель акима", "инфраструктура"],
  ["Дана Ким", "Партнер", "GR-менеджер", "совместные инициативы"]
];

const legalItems = [
  ["Взаимодействие с МИО", "Протокол встречи, ответственные, сроки, основание запроса и канал эскалации."],
  ["Персональные данные", "Минимальный состав данных, цель обработки, доступ по ролям и журналирование."],
  ["Закупки и договоры", "Способ закупки, бюджет, сроки согласования, договорные обязательства и риски."],
  ["Размещение оборудования", "Право доступа к площадке, технические условия, охранные зоны и электропитание."],
  ["ВНД Казахтелеком", "Регламенты согласования, служебные записки, отчетность и внутренние поручения."]
];

const sourceLinks = [
  ["IT и AI", "https://digitalbusiness.kz/", "Digital Business Казахстан"],
  ["Цифровизация РК", "https://www.gov.kz/memleket/entities/mdai", "Министерство цифрового развития"],
  ["Телеком", "https://telecom.kz/", "Казахтелеком"],
  ["Финансы", "https://kase.kz/", "KASE"],
  ["Политика и госуправление", "https://www.akorda.kz/", "Akorda"],
  ["г. Алматы", "https://www.gov.kz/memleket/entities/almaty", "Акимат Алматы"],
  ["Алматинская область", "https://www.gov.kz/memleket/entities/zhetysu-almaty", "Акимат области"],
  ["Жетысуская область", "https://www.gov.kz/memleket/entities/zhetysu", "Акимат Жетысу"]
];

let tasks = JSON.parse(localStorage.getItem("grTasks") || "null") || defaultTasks;
let contacts = JSON.parse(localStorage.getItem("grContacts") || "null") || defaultContacts;
let draftsCount = Number(localStorage.getItem("grDraftsCount") || 0);

function saveState() {
  localStorage.setItem("grTasks", JSON.stringify(tasks));
  localStorage.setItem("grContacts", JSON.stringify(contacts));
  localStorage.setItem("grDraftsCount", String(draftsCount));
}

function renderRegion(key = "almaty") {
  const data = regionData[key];
  document.querySelectorAll(".map-zone").forEach((button) => {
    button.classList.toggle("active", button.dataset.region === key);
  });
  document.querySelector("#regionInfo").innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.text}</p>
    <div class="tags">${data.chips.map((chip) => `<span class="status">${chip}</span>`).join(" ")}</div>
  `;
}

function renderTasks() {
  document.querySelector("#taskRows").innerHTML = tasks
    .map((task) => {
      const hot = task[4] === "Срочно" ? " hot" : "";
      return `
        <tr>
          <td>${task[0]}</td>
          <td>${task[1]}</td>
          <td>${task[2]}</td>
          <td>${task[3]}</td>
          <td><span class="status${hot}">${task[4]}</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderLegal() {
  document.querySelector("#legalList").innerHTML = legalItems
    .map((item) => `<article class="legal-item"><h3>${item[0]}</h3><p>${item[1]}</p></article>`)
    .join("");
}

function renderLinks() {
  document.querySelector("#linksGrid").innerHTML = sourceLinks
    .map((link) => `<a class="source-link" href="${link[1]}" target="_blank" rel="noopener noreferrer"><strong>${link[0]}</strong><span>${link[2]}</span></a>`)
    .join("");
}

function renderContacts() {
  document.querySelector("#contactList").innerHTML = contacts
    .map((contact) => `
      <article class="contact-card">
        <strong>${contact[0]}</strong>
        <span>${contact[1]} · ${contact[2]}</span>
        <span>Тема: ${contact[3]}</span>
      </article>
    `)
    .join("");
}

function renderCounters() {
  document.querySelector("#meetingsCount").textContent = tasks.length;
  document.querySelector("#weekTasksCount").textContent = tasks.filter((task) => task[4] !== "Завершено").length;
  document.querySelector("#contactsCount").textContent = contacts.length;
  document.querySelector("#draftsCount").textContent = draftsCount;
}

function buildDraft(type, recipient, topic) {
  const to = recipient.trim() || "адресату";
  const text = topic.trim() || "по вопросу взаимодействия в рамках GR-направления Алматинского региона";
  const templates = {
    letter: `<strong>Проект письма</strong><p>Уважаемые коллеги! Просим рассмотреть вопрос: ${text}. Для своевременной координации предлагаем определить ответственных лиц, подтвердить актуальные сроки и направить позицию в рабочем порядке. Адресат: ${to}.</p>`,
    memo: `<strong>Проект служебной записки</strong><p>В целях обеспечения GR-сопровождения сообщаем о необходимости проработки вопроса: ${text}. Предлагается закрепить ответственного, проверить нормативные ограничения и подготовить позицию для встречи с ${to}.</p>`,
    agenda: `<strong>Повестка встречи</strong><p>1. Текущий статус: ${text}.<br>2. Вопросы к ${to}.<br>3. Риски, ограничения и НПА/ВНД.<br>4. Ответственные и сроки.<br>5. Следующие шаги и формат контроля.</p>`,
    protocol: `<strong>Проект протокола</strong><p>По вопросу ${text} договорились: закрепить ответственных со стороны участников, обновить статус до ближайшего контрольного срока, обменяться исходными данными и провести повторную сверку после выполнения первичных поручений.</p>`
  };
  return templates[type];
}

document.addEventListener("click", (event) => {
  const zone = event.target.closest("[data-region]");
  if (zone) {
    renderRegion(zone.dataset.region);
  }
});

function addTaskFromForm() {
  const date = document.querySelector("#taskDate").value;
  const org = document.querySelector("#taskOrg").value.trim();
  const topic = document.querySelector("#taskTopic").value.trim();

  if (!date || !org || !topic) {
    return;
  }

  tasks.unshift([
    date,
    org,
    topic,
    document.querySelector("#taskRegion").value,
    "В работе"
  ]);
  document.querySelector("#taskForm").reset();
  saveState();
  renderTasks();
  renderCounters();
}

document.querySelector("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  addTaskFromForm();
});

document.querySelector("#taskForm button[type='submit']").addEventListener("click", (event) => {
  event.preventDefault();
  addTaskFromForm();
});

document.querySelector("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  contacts.unshift([
    document.querySelector("#contactName").value,
    document.querySelector("#contactOrg").value,
    document.querySelector("#contactRole").value || "контакт",
    document.querySelector("#contactTheme").value || "GR-взаимодействие"
  ]);
  event.currentTarget.reset();
  saveState();
  renderContacts();
  renderCounters();
});

document.querySelector("#makeDraft").addEventListener("click", () => {
  const type = document.querySelector("#draftType").value;
  const recipient = document.querySelector("#draftRecipient").value;
  const topic = document.querySelector("#draftTopic").value;
  document.querySelector("#draftOutput").innerHTML = buildDraft(type, recipient, topic);
  draftsCount += 1;
  saveState();
  renderCounters();
});

renderRegion();
renderTasks();
renderLegal();
renderLinks();
renderContacts();
renderCounters();
