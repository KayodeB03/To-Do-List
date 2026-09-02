const todoBlueprint = ({
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

export default todoBlueprint;
