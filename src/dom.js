// dom.js

// ==============================
// Project Tab Creator
// ==============================

const createProjectButton = (() => {
  const projectsContainer = document.querySelector(".projects-list");
  const projectCount = document.querySelector(".projects-stat dd");

  let buttonCount = 0;

  const createProjectTab = () => {
    buttonCount++;

    const newProjectButton = document.createElement("button");
    newProjectButton.className = "project";

    const projectName = document.createElement("span");
    projectName.textContent = "Project";

    const projectNumber = document.createElement("span");
    projectNumber.textContent = buttonCount;

    newProjectButton.append(projectName, projectNumber);

    projectsContainer.appendChild(newProjectButton);

    projectCount.textContent = String(buttonCount).padStart(2, "0");
  };

  return {
    createProjectTab,
  };
})();

// ==============================
// Project Dialog
// ==============================

const projectDialog = (() => {
  const addProjectButton = document.querySelector(".add-project");
  const dialog = document.querySelector(".project-dialog");
  const cancelButton = document.querySelector(".cancel-project");

  addProjectButton.addEventListener("click", () => {
    dialog.showModal();
  });

  cancelButton.addEventListener("click", () => {
    dialog.close();
  });

  return {
    dialog,
  };
})();
