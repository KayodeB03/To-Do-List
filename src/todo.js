//todo.js

//create todo function
const createTodo = ({
  title = "",
  description = "",
  dueDate = "",
  priority = "",
  notes = "",
  completed = false,
}) => {
  return {
    title,
    description,
    dueDate,
    priority,
    notes,
    completed,
  };
};

//export createTodo function
export default createTodo;
