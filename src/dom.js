// dom.js

//importing project array and application logic
import projectArray from "./app.js";
import {
  currentProject,
  setCurrentProject,
  getView,
  setView,
  addProject,
  updateProject,
  deleteProject,
  addTodo,
  deleteTodo,
  toggleTodo,
  updateTodo,
  moveTodo,
  findTodo,
  visibleTodos,
  counts,
  isDueToday,
  isOverdue,
} from "./app.js";
import { format, parseISO, isTomorrow, isThisYear } from "date-fns";

const VIEW_TITLES = {
  all: "All Tasks",
  today: "Today",
  upcoming: "Upcoming",
};

const pad = (n) => String(n).padStart(2, "0");

//human date label for a task row
const formatDue = (todo) => {
  if (!todo.dueDate) return "";
  const date = parseISO(todo.dueDate);
  if (isDueToday(todo)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, isThisYear(date) ? "MMM dd" : "MMM dd yyyy");
};

//project dialog module
const projectManager = (() => {
  const addProjectButton = document.querySelector(".add-project");
  const dialog = document.querySelector(".project-dialog");
  const form = document.querySelector(".project-form");
  const cancelButton = document.querySelector(".cancel-project");
  const projectNameInput = document.querySelector("#project-name");
  const projectDescriptionInput = document.querySelector(
    "#project-description",
  );
  const projectList = document.querySelector(".projects-list");
  const heading = form.querySelector(".project-form-title");
  const submitButton = form.querySelector(".create-project");
  const editProjectButton = document.querySelector(".edit-project");
  const deleteProjectButton = document.querySelector(".delete-project");

  //null while creating a new project, otherwise the id being edited
  let editingProjectId = null;

  //add project button event listener
  addProjectButton.addEventListener("click", () => {
    editingProjectId = null;
    form.reset();
    heading.textContent = "New Project";
    submitButton.textContent = "Create Project";
    dialog.showModal();
  });

  //edit the project currently in view
  editProjectButton.addEventListener("click", () => {
    const project = currentProject();
    editingProjectId = project.id;
    projectNameInput.value = project.name;
    projectDescriptionInput.value = project.description;
    heading.textContent = "Edit Project";
    submitButton.textContent = "Save";
    dialog.showModal();
  });

  //cancel button event listener
  cancelButton.addEventListener("click", () => {
    dialog.close();
  });

  //create or update on submit (submit respects the `required` attribute)
  form.addEventListener("submit", () => {
    const fields = {
      name: projectNameInput.value.trim(),
      description: projectDescriptionInput.value.trim(),
    };

    if (editingProjectId === null) {
      addProject(fields);
      setCurrentProject(projectArray.projects.length - 1);
    } else {
      updateProject(editingProjectId, fields);
    }
    editingProjectId = null;
    render();
  });

  //delete the project currently in view
  deleteProjectButton.addEventListener("click", () => {
    const project = currentProject();
    const count = project.todos.length;
    const message =
      count === 0
        ? `Delete "${project.name}"?`
        : `Delete "${project.name}" and its ${count} task${count === 1 ? "" : "s"}?`;
    if (!confirm(message)) return;
    deleteProject(project.id);
    render();
  });

  //render projects
  const renderProjects = (project, index) => {
    const projectButton = document.createElement("button");
    projectButton.className = "project";
    if (getView() === "project" && project === currentProject()) {
      projectButton.classList.add("is-active");
    }

    const projectName = document.createTextNode(project.name);

    const taskCount = document.createElement("span");
    taskCount.textContent = pad(
      project.todos.filter((t) => !t.completed).length,
    );

    projectButton.append(projectName, taskCount);

    projectButton.addEventListener("click", () => {
      setCurrentProject(index);
      render();
    });

    projectList.appendChild(projectButton);
  };

  const renderProjectList = () => {
    projectList.replaceChildren();
    projectArray.projects.forEach(renderProjects);
  };

  return { renderProjectList };
})();

//sidebar view buttons + counts
const viewManager = (() => {
  const buttons = document.querySelectorAll(".view-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setView(button.dataset.view);
      render();
    });
  });

  const renderViews = () => {
    const c = counts();
    buttons.forEach((button) => {
      const view = button.dataset.view;
      button.classList.toggle("is-active", getView() === view);
      button.querySelector("span").textContent = pad(c[view]);
    });
  };

  return { renderViews };
})();

//masthead title + stats
const masthead = (() => {
  const title = document.querySelector(".masthead h1");
  const description = document.querySelector(".masthead-description");
  const projectsStat = document.querySelector(".projects-stat dd");
  const doneStat = document.querySelector(".done-stat dd");
  const dateStat = document.querySelector(".date-stat dd");
  const projectActions = document.querySelector(".project-actions");

  //update title
  const titleUpdater = () => {
    const view = getView();
    title.textContent =
      view === "project" ? currentProject().name : VIEW_TITLES[view];
    description.textContent =
      view === "project" ? currentProject().description : "";
  };

  const renderMasthead = () => {
    titleUpdater();
    const c = counts();
    projectsStat.textContent = pad(c.projects);
    doneStat.textContent = pad(c.done);
    dateStat.textContent = format(new Date(), "MM / dd");
    projectActions.hidden = getView() !== "project";
  };

  return { renderMasthead };
})();

//task dialog (create / expand / edit / delete)
const todoDetail = (() => {
  const dialog = document.querySelector(".todo-dialog");
  const form = document.querySelector(".todo-form");
  const heading = form.querySelector(".todo-form-title");
  const fields = {
    title: form.querySelector("#todo-title"),
    description: form.querySelector("#todo-description"),
    dueDate: form.querySelector("#todo-due"),
    priority: form.querySelector("#todo-priority"),
    projectId: form.querySelector("#todo-project"),
    notes: form.querySelector("#todo-notes"),
  };
  const deleteButton = form.querySelector(".delete-todo");
  const cancelButton = form.querySelector(".cancel-todo");

  //null while creating a new task, otherwise the id being edited
  let openTodoId = null;

  const fillProjectOptions = (selected) => {
    fields.projectId.replaceChildren(
      ...projectArray.projects.map((p) => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.name;
        option.selected = p === selected;
        return option;
      }),
    );
  };

  const readFields = () => ({
    title: fields.title.value.trim(),
    description: fields.description.value.trim(),
    dueDate: fields.dueDate.value,
    priority: fields.priority.value,
    notes: fields.notes.value.trim(),
  });

  //open empty, targeting the current project
  const openNew = () => {
    openTodoId = null;
    form.reset();
    heading.textContent = "New Task";
    deleteButton.hidden = true;
    fields.priority.value = "medium";
    //in the Today view, new tasks default to being due today
    if (getView() === "today") {
      fields.dueDate.value = format(new Date(), "yyyy-MM-dd");
    }
    fillProjectOptions(currentProject());
    dialog.showModal();
  };

  //open populated with an existing task
  const open = (todoId) => {
    const found = findTodo(todoId);
    if (!found) return;
    openTodoId = todoId;

    const { project, todo } = found;
    heading.textContent = "Task";
    deleteButton.hidden = false;
    fields.title.value = todo.title;
    fields.description.value = todo.description;
    fields.dueDate.value = todo.dueDate;
    fields.priority.value = todo.priority;
    fields.notes.value = todo.notes;
    fillProjectOptions(project);

    dialog.showModal();
  };

  form.addEventListener("submit", () => {
    if (openTodoId === null) {
      addTodo(fields.projectId.value, readFields());
    } else {
      updateTodo(openTodoId, readFields());
      moveTodo(openTodoId, fields.projectId.value);
    }
    openTodoId = null;
    render();
  });

  cancelButton.addEventListener("click", () => dialog.close());

  deleteButton.addEventListener("click", () => {
    deleteTodo(openTodoId);
    openTodoId = null;
    dialog.close();
    render();
  });

  return { open, openNew };
})();

//task grid
const taskGrid = (() => {
  const grid = document.querySelector(".tasks-grid");

  const renderTask = ({ project, todo }, index) => {
    const card = document.createElement("article");
    card.className = "task-card";
    card.dataset.id = todo.id;
    card.dataset.priority = todo.priority;
    if (todo.completed) card.classList.add("is-done");

    const head = document.createElement("div");
    head.className = "task-card-head";

    const idx = document.createElement("span");
    idx.className = "task-index";
    idx.textContent = pad(index + 1);

    const check = document.createElement("input");
    check.className = "task-check";
    check.type = "checkbox";
    check.checked = todo.completed;
    check.setAttribute("aria-label", "Mark complete");
    check.addEventListener("change", () => {
      toggleTodo(todo.id);
      render();
    });

    const remove = document.createElement("button");
    remove.className = "task-remove";
    remove.type = "button";
    remove.setAttribute("aria-label", "Delete task");
    remove.innerHTML = "&times;";
    remove.addEventListener("click", () => {
      deleteTodo(todo.id);
      render();
    });

    head.append(idx, check, remove);

    const title = document.createElement("button");
    title.className = "task-title";
    title.type = "button";
    title.textContent = todo.title;
    title.addEventListener("click", () => todoDetail.open(todo.id));

    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent =
      getView() === "project" ? todo.description : project.name;

    const foot = document.createElement("div");
    foot.className = "task-card-foot";

    const date = document.createElement("span");
    date.className = "task-date";
    date.textContent = formatDue(todo) || "No date";
    if (isOverdue(todo)) date.dataset.overdue = "";

    const priority = document.createElement("span");
    priority.className = "task-priority";
    priority.dataset.level = todo.priority;
    priority.textContent = todo.priority;

    foot.append(date, priority);
    card.append(head, title, description, foot);
    return card;
  };

  //the trailing cell that creates a task
  const renderAddCard = () => {
    const button = document.createElement("button");
    button.className = "task-card task-card-add";
    button.type = "button";
    button.textContent = "+ New Task";
    button.addEventListener("click", todoDetail.openNew);
    return button;
  };

  //shown when the current view has nothing in it
  const renderEmpty = () => {
    const empty = document.createElement("div");
    empty.className = "tasks-empty";

    const heading = document.createElement("p");
    heading.className = "tasks-empty-title";
    heading.textContent =
      getView() === "project"
        ? `No tasks in ${currentProject().name}`
        : "Nothing here";

    const hint = document.createElement("p");
    hint.className = "tasks-empty-hint";
    hint.textContent =
      getView() === "project"
        ? "This project is empty. Add the first task."
        : `New tasks go into ${currentProject().name}.`;

    const button = document.createElement("button");
    button.className = "tasks-empty-btn";
    button.type = "button";
    button.textContent = "Create a task";
    button.addEventListener("click", todoDetail.openNew);

    empty.append(heading, hint, button);
    return empty;
  };

  const renderTasks = () => {
    const entries = visibleTodos();
    grid.classList.toggle("is-empty", entries.length === 0);
    grid.replaceChildren(
      ...(entries.length === 0
        ? [renderEmpty()]
        : [...entries.map(renderTask), renderAddCard()]),
    );
  };

  return { renderTasks };
})();

//re-render everything from state
function render() {
  projectManager.renderProjectList();
  viewManager.renderViews();
  masthead.renderMasthead();
  taskGrid.renderTasks();
}

render();
