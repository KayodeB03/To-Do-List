const createTodo = ({
  title = "",
  description = "",
  dueDate = "",
  priority = "low",
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

export default createTodo;
