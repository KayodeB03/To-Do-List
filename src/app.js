//app.js

import createProject from "./projects.js";
import createTodo from "./todo.js";
import { save, load } from "./storage.js";
import { isToday, isPast, isFuture, parseISO, startOfDay } from "date-fns";

const DEFAULT_PROJECT = { name: "Inbox", description: "Default project" };
const VIEWS = ["all", "today", "upcoming", "project"];
const PRIORITIES = ["low", "medium", "high"];

//create project array
const projectArray = {
  projects: [],
};

let currentProjectIndex = 0;
let currentView = "all";

//persist the whole state every time something changes
function persist() {
  save({ projects: projectArray.projects, currentProjectIndex, currentView });
}

//load saved state, or fall back to a single default project
function init() {
  const saved = load();
  const projects = Array.isArray(saved?.projects) ? saved.projects : [];

  projectArray.projects = projects
    .filter((p) => p && typeof p.name === "string")
    .map(createProject);

  if (projectArray.projects.length === 0) {
    projectArray.projects.push(createProject(DEFAULT_PROJECT));
  }

  currentProjectIndex = Math.min(
    Number.isInteger(saved?.currentProjectIndex)
      ? saved.currentProjectIndex
      : 0,
    projectArray.projects.length - 1,
  );
  currentView = VIEWS.includes(saved?.currentView) ? saved.currentView : "all";
}

//find currentProject on click
function currentProject() {
  return projectArray.projects[currentProjectIndex];
}

function setCurrentProject(index) {
  currentProjectIndex = index;
  currentView = "project";
  persist();
}

function getView() {
  return currentView;
}

function setView(view) {
  if (VIEWS.includes(view)) currentView = view;
  persist();
}

// ---------- projects ----------

function addProject(fields) {
  const project = createProject(fields);
  projectArray.projects.push(project);
  persist();
  return project;
}

function updateProject(projectId, { name, description }) {
  const project = findProject(projectId);
  if (!project) return null;

  if (typeof name === "string" && name.trim()) project.name = name.trim();
  if (typeof description === "string") project.description = description.trim();
  persist();
  return project;
}

function deleteProject(projectId) {
  const index = projectArray.projects.findIndex((p) => p.id === projectId);
  if (index === -1) return;

  projectArray.projects.splice(index, 1);
  if (projectArray.projects.length === 0) {
    projectArray.projects.push(createProject(DEFAULT_PROJECT));
  }
  currentProjectIndex = Math.min(
    currentProjectIndex,
    projectArray.projects.length - 1,
  );
  currentView = "all";
  persist();
}

function findProject(projectId) {
  return projectArray.projects.find((p) => p.id === projectId);
}

// ---------- todos ----------

function findTodo(todoId) {
  for (const project of projectArray.projects) {
    const todo = project.todos.find((t) => t.id === todoId);
    if (todo) return { project, todo };
  }
  return null;
}

function addTodo(projectId, fields) {
  const project = findProject(projectId);
  if (!project) return null;

  const todo = createTodo(fields);
  project.todos.push(todo);
  persist();
  return todo;
}

function deleteTodo(todoId) {
  const found = findTodo(todoId);
  if (!found) return;

  found.project.todos = found.project.todos.filter((t) => t.id !== todoId);
  persist();
}

function toggleTodo(todoId) {
  const found = findTodo(todoId);
  if (!found) return;

  found.todo.completed = !found.todo.completed;
  persist();
}

function updateTodo(todoId, patch) {
  const found = findTodo(todoId);
  if (!found) return null;

  const allowed = ["title", "description", "dueDate", "priority", "notes"];
  for (const key of allowed) {
    if (key in patch) found.todo[key] = patch[key];
  }
  if (!PRIORITIES.includes(found.todo.priority)) found.todo.priority = "medium";
  persist();
  return found.todo;
}

//move a todo to a different project
function moveTodo(todoId, targetProjectId) {
  const found = findTodo(todoId);
  const target = findProject(targetProjectId);
  if (!found || !target || found.project === target) return;

  found.project.todos = found.project.todos.filter((t) => t.id !== todoId);
  target.todos.push(found.todo);
  persist();
}

// ---------- views ----------

function dueDateOf(todo) {
  return todo.dueDate ? startOfDay(parseISO(todo.dueDate)) : null;
}

function isDueToday(todo) {
  const date = dueDateOf(todo);
  return date !== null && isToday(date);
}

function isUpcoming(todo) {
  const date = dueDateOf(todo);
  return date !== null && isFuture(date) && !isToday(date);
}

function isOverdue(todo) {
  const date = dueDateOf(todo);
  return date !== null && isPast(date) && !isToday(date) && !todo.completed;
}

//every todo, tagged with the project it belongs to
function allTodos() {
  return projectArray.projects.flatMap((project) =>
    project.todos.map((todo) => ({ project, todo })),
  );
}

//the todos that should be shown for the current view
function visibleTodos() {
  const entries =
    currentView === "project"
      ? currentProject().todos.map((todo) => ({
          project: currentProject(),
          todo,
        }))
      : allTodos();

  const filtered = entries.filter(({ todo }) => {
    if (currentView === "today") return isDueToday(todo) || isOverdue(todo);
    if (currentView === "upcoming") return isUpcoming(todo);
    return true;
  });

  //open first, then soonest due, undated last
  return filtered.sort((a, b) => {
    if (a.todo.completed !== b.todo.completed) return a.todo.completed ? 1 : -1;
    const da = dueDateOf(a.todo);
    const db = dueDateOf(b.todo);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da - db;
  });
}

function counts() {
  const all = allTodos().map(({ todo }) => todo);
  return {
    all: all.filter((t) => !t.completed).length,
    today: all.filter((t) => !t.completed && (isDueToday(t) || isOverdue(t)))
      .length,
    upcoming: all.filter((t) => !t.completed && isUpcoming(t)).length,
    done: all.filter((t) => t.completed).length,
    projects: projectArray.projects.length,
  };
}

init();

//export project array
export default projectArray;

//export current project functionality
export {
  PRIORITIES,
  currentProject,
  setCurrentProject,
  getView,
  setView,
  addProject,
  updateProject,
  deleteProject,
  findProject,
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
};
