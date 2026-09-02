import createTodo from "./todo.js";

const createProject = ({
  id = crypto.randomUUID(),
  name,
  description = "",
  todos = [],
}) => {
  return {
    id,
    name,
    description,
    // Rehydrate plain JSON todos through the factory so defaults are applied.
    todos: todos.map(createTodo),
  };
};

export default createProject;
