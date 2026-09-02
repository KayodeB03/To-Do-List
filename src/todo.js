//todo.js

//create todo function
const createTodo = ({
  id = crypto.randomUUID(),
  title = "",
  description = "",
  dueDate = "",
  priority = "medium",
  notes = "",
  completed = false,
  createdAt = new Date().toISOString(),
}) => {
  return {
    id,
    title,
    description,
    dueDate,
    priority,
    notes,
    completed,
    createdAt,
  };
};

//export createTodo function
export default createTodo;
