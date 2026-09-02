//import css, loader, todo, dom, and projects modules
import "./style.css";
import "./loader.js";
import "./todo.js";
import "./dom.js";
import "./projects.js";

//import createTodo and createProject functions
import createTodo from "./todo.js";
import createProject from "./projects.js";

//create test todo and project
const todo = createTodo({
  title: "Finish portfolio",
  description: "Complete my portfolio",
  dueDate: "2026-09-05",
  priority: "high",
});

console.log(todo);

const project = createProject({
  name: "Personal",
  todos: [todo],
});

console.log(project);
