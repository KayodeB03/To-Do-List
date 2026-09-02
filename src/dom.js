// dom.js

//importing project creator and project array modules
import projectArray from "./app.js";
import createTodo from "./todo.js";
import createProject from "./projects.js";
import { setCurrentProject, currentProject } from "./app.js";

//project dialog module
const projectManager = (() => {
  const addProjectButton = document.querySelector(".add-project");
  const dialog = document.querySelector(".project-dialog");
  const cancelButton = document.querySelector(".cancel-project");
  const createProjectButton = document.querySelector(".create-project");
  const projectNameInput = document.querySelector("#project-name");
  const projectDescriptionInput = document.querySelector(
    "#project-description",
  );

  const todo = createTodo({
    title: "Finish portfolio",
    description: "Complete my portfolio",
    dueDate: "2026-09-05",
    priority: "high",
  });

  console.log(todo);

  const projectList = document.querySelector(".projects-list");

  //add project button event listener
  addProjectButton.addEventListener("click", () => {
    dialog.showModal();
  });

  //cancel button event listener
  cancelButton.addEventListener("click", () => {
    dialog.close();
  });

  const renderProjects = (project) => {
    const projectButton = document.createElement("button");
    projectButton.className = "project";

    const projectName = document.createElement("span");
    projectName.textContent = project.name;

    const taskCount = document.createElement("span");
    taskCount.textContent = String(project.todos.length).padStart(2, "0");

    projectButton.append(projectName, taskCount);

    projectButton.addEventListener("click", () => {
      setCurrentProject(projectArray.projects.indexOf(project));
      console.log(currentProject());
      titleUpdater();
    });

    projectList.appendChild(projectButton);
  };
  renderProjects(projectArray.projects[0]);

  const projectCount = document.querySelector(".projects-stat dd");
  projectCount.textContent = String(projectList.children.length).padStart(
    2,
    "0",
  );

  //create project button event listener
  createProjectButton.addEventListener("click", () => {
    const projectCount = document.querySelector(".projects-stat dd");
    const project = createProject({
      name: projectNameInput.value,
      description: projectDescriptionInput.value,
    });

    //create project button
    const projectButton = document.createElement("button");
    projectButton.className = "project";

    //create project name
    const projectName = document.createElement("span");
    projectName.textContent = project.name;

    //create task count
    const taskCount = document.createElement("span");
    taskCount.textContent = String(project.todos.length).padStart(2, "0");

    //append projectName and taskCount to the project button
    projectButton.append(projectName, taskCount);

    //append project button to the project list
    projectList.appendChild(projectButton);

    //update project count
    projectCount.textContent = String(projectList.children.length).padStart(
      2,
      "0",
    );

    //add project to project array
    projectArray.projects.push(project);
    //close dialog
    dialog.close();

    //set currentProject
    projectButton.addEventListener("click", () => {
      setCurrentProject(projectArray.projects.indexOf(project));
      console.log(currentProject());
      titleUpdater();
    });
  });

  const titleUpdater = () => {
    const project = currentProject();

    const title = document.querySelector("h1");
    title.textContent = project.name;
  };
})();
