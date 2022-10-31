const renderTasks = (state, elements) => {
  elements.tasksContainer.innerHTML = "";

  const filteredTasks = state.tasks.filter(
    ({ listId }) => listId === state.activeListId
  );

  if (filteredTasks.length === 0) {
    return;
  }

  const ulForTasks = document.createElement("ul");
  ulForTasks.classList.add("list-group");

  filteredTasks.forEach(({ id, name }) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.setAttribute("id", `${id}`);
    const checkbox = document.createElement("input");
    checkbox.classList.add("form-check-input", "me-1");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("value", " ");
    checkbox.setAttribute("id", `${id}`);

    const label = document.createElement("label");
    label.classList.add("form-check-label");
    label.setAttribute("for", `${id}`);
    label.textContent = name;
    li.append(checkbox);
    li.append(label);
    ulForTasks.append(li);
  });

  const inputDelTask = document.createElement("input");
  inputDelTask.setAttribute("type", "submit");
  inputDelTask.setAttribute("value", "Delete Task(s)");
  inputDelTask.classList.add("btn", "btn-danger");
  inputDelTask.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
  });

  elements.tasksContainer.append(ulForTasks);
  elements.tasksContainer.append(inputDelTask);
};

const renderLists = (state, elements) => {
  elements.listsContainer.innerHTML = "";
  const ulForLists = document.createElement("ul");

  state.lists.forEach(({ id, name }) => {
    const li = document.createElement("li");
    let channelNameElement;

    if (id === state.activeListId) {
      channelNameElement = document.createElement("b");
      channelNameElement.textContent = name;
    } else {
      channelNameElement = document.createElement("a");
      channelNameElement.setAttribute("href", `#${name.toLowerCase()}`);
      channelNameElement.textContent = name;
      channelNameElement.addEventListener("click", (e) => {
        e.preventDefault();
        state.activeListId = id;
        renderLists(state, elements);
        renderTasks(state, elements);
      });
    }

    li.append(channelNameElement);
    ulForLists.append(li);
  });

  elements.listsContainer.append(ulForLists);
};

const runApp = () => {
  const defaultChannelId = _.uniqueId();
  const state = {
    activeListId: defaultChannelId,
    lists: [{ id: defaultChannelId, name: "General" }],
    tasks: [],
  };

  const elements = {
    listsContainer: document.querySelector('[data-container="lists"]'),
    tasksContainer: document.querySelector('[data-container="tasks"]'),
  };

  const newListForm = document.querySelector(
    '[data-container="new-list-form"]'
  );
  const newTaskForm = document.querySelector(
    '[data-container="new-task-form"]'
  );

  newListForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const listName = formData.get("name");
    const list = { id: _.uniqueId(), name: listName.trim() };
    form.reset();
    form.querySelector("input").focus();
    state.lists.push(list);
    renderLists(state, elements);
  });

  newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const taskName = formData.get("name");
    const task = {
      id: _.uniqueId(),
      name: taskName.trim(),
      listId: state.activeListId,
    };
    form.reset();
    form.querySelector("input").focus();
    state.tasks.push(task);
    renderTasks(state, elements);
  });

  renderLists(state, elements);
  renderTasks(state, elements);
};

runApp();
