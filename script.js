const projects = [
  {
    name: "Подключение социально значимых объектов",
    owner: "Департамент B2G",
    status: "На контроле",
    tone: "amber",
    text: "Нужны подтверждения доступа к площадкам и синхронизация графика с районными акиматами.",
    tags: ["МИО", "Инфраструктура", "Сроки"],
    type: ["mio", "risk"]
  },
  {
    name: "Цифровизация обращений по качеству связи",
    owner: "Служба эксплуатации",
    status: "В работе",
    tone: "blue",
    text: "Формируется единый реестр обращений, SLA и карта повторных инцидентов по населенным пунктам.",
    tags: ["Сервис", "Аналитика"],
    type: ["all"]
  },
  {
    name: "Единый паспорт проектов региона",
    owner: "Офис цифровых проектов",
    status: "Стабильно",
    tone: "green",
    text: "Паспорта инициатив приведены к единому формату: цель, эффект, бюджет, риски, ответственные.",
    tags: ["Документы", "Проекты"],
    type: ["all"]
  },
  {
    name: "Согласование размещения оборудования",
    owner: "Юридический блок",
    status: "Риск",
    tone: "red",
    text: "Требуется сверка правовых оснований, сервитутов и ограничений по объектам коммунальной собственности.",
    tags: ["НПА", "МИО", "Риски"],
    type: ["mio", "risk"]
  }
];

const documents = [
  ["Письмо", "Запрос графика доступа к объектам", "Акимат области", "05.07.2026", "На подписи"],
  ["Служебка", "Риски по подключению ФАП", "Региональный директор", "06.07.2026", "Черновик"],
  ["Отчет", "Статус цифровых проектов за неделю", "Центральный аппарат", "08.07.2026", "В работе"],
  ["Письмо", "Согласование списка ответственных", "Управление цифровизации", "09.07.2026", "Новый"]
];

const tasks = [
  ["Сверить сроки по 12 соцобъектам", "до 04.07.2026, ответственный: проектный офис", "danger"],
  ["Подготовить вопросы к встрече с МИО", "до 05.07.2026, ответственный: B2G", "warning"],
  ["Обновить паспорт проекта по обращениям", "до 08.07.2026, ответственный: эксплуатация", ""],
  ["Проверить правовые ограничения по размещению", "до 10.07.2026, ответственный: юристы", ""]
];

const legalMap = {
  procurement: "<strong>Закупки и договоры</strong><br>Проверьте способ закупки, лимиты, основания для прямого договора, сроки согласования и наличие подтвержденного бюджета.",
  personal: "<strong>Персональные данные</strong><br>Нужны цель обработки, минимальный состав данных, доступ по ролям, журналирование и согласованная модель хранения.",
  infra: "<strong>Инфраструктура и доступ</strong><br>Проверьте право размещения, технические условия, охранные зоны, доступ к площадке и ответственность за электропитание.",
  mio: "<strong>Взаимодействие с МИО</strong><br>Зафиксируйте поручение, протокол, ответственных, сроки предоставления данных и канал эскалации по спорным вопросам."
};

function renderProjects(filter = "all") {
  const list = document.querySelector("#projectList");
  list.innerHTML = "";
  projects
    .filter((project) => filter === "all" || project.type.includes(filter))
    .forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.innerHTML = `
        <div>
          <strong>${project.name}</strong>
          <p>${project.text}</p>
          <div class="tags">${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
        <div>
          <span class="status ${project.tone}">${project.status}</span>
          <p>${project.owner}</p>
        </div>
      `;
      list.appendChild(card);
    });
}

function renderDocuments() {
  const rows = document.querySelector("#documentRows");
  rows.innerHTML = documents
    .map((item) => `<tr><td>${item[0]}</td><td>${item[1]}</td><td>${item[2]}</td><td>${item[3]}</td><td>${item[4]}</td></tr>`)
    .join("");
}

function renderTasks() {
  const list = document.querySelector("#taskList");
  list.innerHTML = tasks
    .map((task) => `<div class="task-item ${task[2]}"><strong>${task[0]}</strong><span>${task[1]}</span></div>`)
    .join("");
}

function buildAssistantAnswer(text, mode) {
  const cleanText = text.trim() || "инициатива по цифровому проекту региона";
  const templates = {
    brief: `<strong>Краткая справка</strong><br>Тема: ${cleanText}.<br>Фокус: цель, текущий статус, ответственные, риски, запрос к МИО и следующий шаг. Рекомендуется приложить паспорт проекта и таблицу поручений.`,
    letter: `<strong>Проект письма</strong><br>Просим рассмотреть вопрос: ${cleanText}. Предлагаем закрепить ответственных, подтвердить сроки предоставления данных и провести рабочую сверку статуса до ближайшего отчетного периода.`,
    meeting: `<strong>Повестка встречи</strong><br>1. Текущий статус: ${cleanText}.<br>2. Блокирующие вопросы и решения МИО.<br>3. Ответственные по каждой стороне.<br>4. Сроки, протокол и следующий контрольный срез.`,
    risk: `<strong>Риски и меры</strong><br>Риск сроков: назначить владельца и контрольную дату. Правовой риск: сверить НПА/ВНД. Коммуникационный риск: зафиксировать протокол с МИО. Риск данных: хранить только необходимый минимум.`
  };
  return templates[mode];
}

function setProjectFilter(button) {
  document.querySelectorAll("[data-project-filter]").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderProjects(button.dataset.projectFilter);
}

function addDocumentRow() {
  documents.unshift(["Черновик", "Новый документ по инициативе", "Уточняется", "Не задан", "Новый"]);
  renderDocuments();
}

function setLegalTopic(key) {
  document.querySelector("#legalOutput").innerHTML = legalMap[key];
}

function makeProtocol() {
  document.querySelector("#protocolOutput").innerHTML = "<strong>Проект протокола</strong><br>Решили: подтвердить список объектов, назначить ответственных от МИО и Казахтелеком, обновить график до 05.07.2026, следующий контроль - 08.07.2026.";
}

document.addEventListener("click", (event) => {
  const projectFilter = event.target.closest("[data-project-filter]");
  const legalTopic = event.target.closest("[data-legal]");

  if (projectFilter) {
    setProjectFilter(projectFilter);
  }

  if (event.target.closest("#addDocument")) {
    addDocumentRow();
  }

  if (legalTopic) {
    setLegalTopic(legalTopic.dataset.legal);
  }

  if (event.target.closest("#makeProtocol")) {
    makeProtocol();
  }
});

document.querySelector("#generateAnswer").addEventListener("click", () => {
  const text = document.querySelector("#assistantInput").value;
  const mode = document.querySelector("#assistantMode").value;
  document.querySelector("#assistantOutput").innerHTML = buildAssistantAnswer(text, mode);
});

document.querySelector("#clearAssistant").addEventListener("click", () => {
  document.querySelector("#assistantInput").value = "";
  document.querySelector("#assistantOutput").innerHTML = "<strong>Готов к работе.</strong><p>Введите задачу, выберите формат и получите структурированный черновик без передачи данных наружу.</p>";
});

renderProjects();
renderDocuments();
renderTasks();
