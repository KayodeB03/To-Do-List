//app.js

//create project array
import createProject from "./projects.js";

const projectArray = {
  projects: [],
};

const testProject = createProject({
  name: "Test Project",
  description: "This is a fake project",
});

projectArray.projects.push(testProject);

let currentProjectIndex = 0;
//find currentProject on click
function currentProject() {
  return projectArray.projects[currentProjectIndex];
}

function setCurrentProject(index) {
  currentProjectIndex = index;
}

//export project array
export default projectArray;

//export current project functionality
export { currentProject, setCurrentProject };
