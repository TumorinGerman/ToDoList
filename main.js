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
    const liForTasks = document.createElement("li");
    liForTasks.classList.add("list-group-item");
    liForTasks.setAttribute("id", `${id}`);
    const checkboxForTasks = document.createElement("input");
    checkboxForTasks.classList.add("form-check-input", "me-1");
    checkboxForTasks.setAttribute("type", "checkbox");
    checkboxForTasks.setAttribute("value", " ");
    checkboxForTasks.setAttribute("id", `${id}`);

    const labelForTasks = document.createElement("label");
    labelForTasks.classList.add("form-check-label");
    labelForTasks.setAttribute("for", `${id}`);
    labelForTasks.textContent = name;
    liForTasks.append(checkboxForTasks);
    liForTasks.append(labelForTasks);
    ulForTasks.append(liForTasks);
  });

  const inputDelTask = document.createElement("input");
  inputDelTask.setAttribute("type", "button");
  inputDelTask.setAttribute("value", "Delete Task(s)");
  inputDelTask.classList.add("btn", "btn-danger");

  elements.tasksContainer.append(ulForTasks);
  elements.tasksContainer.append(inputDelTask);

  inputDelTask.addEventListener("click", (ev) => {
    ev.preventDefault();
    const allCheckboxes = document.querySelectorAll(
      "[data-container=tasks]  [type=checkbox]"
    );
    [...allCheckboxes].map((element) => {
      if (element.checked) {
        state.tasks.forEach((task, index) => {
          if (task.id === element.id) {
            state.tasks.splice(index, 1);
          }
        });
      }
    });
    renderTasks(state, elements);
  });
};

const renderLists = (state, elements) => {
  elements.listsContainer.innerHTML = "";
  const ulForLists = document.createElement("ul");
  ulForLists.classList.add("list-group");

  state.lists.forEach(({ id, name }) => {
    const liForList = document.createElement("li");
    let channelNameElement;

    const checkboxForList = document.createElement("input");
    checkboxForList.classList.add("form-check-input", "me-1");
    checkboxForList.setAttribute("type", "radio");
    checkboxForList.setAttribute("id", `${id}`);
    checkboxForList.setAttribute("name", "listGroupRadio");

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

    liForList.append(checkboxForList);
    liForList.append(channelNameElement);
    ulForLists.append(liForList);
  });

  elements.listsContainer.append(ulForLists);
  if (state.lists.length > 1) {
    const inputDelList = document.createElement("input");
    inputDelList.setAttribute("type", "button");
    inputDelList.setAttribute("value", "Delete List");
    inputDelList.classList.add("btn", "btn-danger");
    elements.listsContainer.append(inputDelList);

    inputDelList.addEventListener("click", (ev) => {
      const triggerRadio = document.querySelectorAll(
        "[data-container=lists] [type=radio]"
      );
      [...triggerRadio].map((element) => {
        if (element.checked) {
          if (element.id === "1") {
            alert('You can\'t delete default List "General"');
            return;
          }
          const tasksOfThisList = state.tasks.filter(
            ({ listId }) => listId === element.id
          );
          if (tasksOfThisList.length !== 0) {
            alert(
              "You can't delete List with Tasks. Please delete all Tasks first."
            );
            return;
          }
          state.lists.forEach((list, index) => {
            if (list.id === element.id) {
              state.lists.splice(index, 1);
            }
          });
        }
      });
      renderLists(state, elements);
    });
  }
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
