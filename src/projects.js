const createProject = ({ name, description = "", todos = [] }) => {
  return {
    name,
    description,
    todos,
  };
};

export default createProject;
