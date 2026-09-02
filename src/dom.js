// dom.js

import createProject from "./projects.js";

const projectDialog = (() => {
  const addProjectButton = document.querySelector(".add-project");
  const dialog = document.querySelector(".project-dialog");
  const cancelButton = document.querySelector(".cancel-project");
  const createProjectButton = document.querySelector(".create-project");
  const projectNameInput = document.querySelector("#project-name");
  const projectDescriptionInput = document.querySelector(
    "#project-description",
  );
  const projectList = document.querySelector(".projects-list");

  addProjectButton.addEventListener("click", () => {
    dialog.showModal();
  });

  cancelButton.addEventListener("click", () => {
    dialog.close();
  });

  createProjectButton.addEventListener("click", () => {
    const projectCount = document.querySelector(".projects-stat dd");
    const project = createProject({
      name: projectNameInput.value,
      description: projectDescriptionInput.value,
    });

    const projectButton = document.createElement("button");
    projectButton.className = "project";

    const projectName = document.createElement("span");
    projectName.textContent = project.name;

    const taskCount = document.createElement("span");
    taskCount.textContent = String(project.todos.length).padStart(2, "0");

    projectButton.append(projectName, taskCount);

    projectList.appendChild(projectButton);

    projectCount.textContent = String(projectList.children.length).padStart(
      2,
      "0",
    );

    console.log(project);
    dialog.close();
  });

  return {
    dialog,
    projectNameInput,
    projectDescriptionInput,
    projectList,
  };
})();
