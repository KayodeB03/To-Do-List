// dom.js

//importing project creator and project array modules
import createProject from "./projects.js";
import projectArray from "./app.js";

//project dialog module
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

  //add project button event listener
  addProjectButton.addEventListener("click", () => {
    dialog.showModal();
  });

  //cancel button event listener
  cancelButton.addEventListener("click", () => {
    dialog.close();
  });

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
    console.log(projectArray);
    dialog.close();
  });
})();
