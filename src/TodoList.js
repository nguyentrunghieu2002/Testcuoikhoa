import React, { useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [showOnlyUndoneTasks, setShowOnlyUndoneTasks] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask, newTaskDueDate) => {
    setTasks([
      ...tasks,
      {
        id: tasks.length + 1,
        title: newTask,
        done: false,
        dueDate: newTaskDueDate
      }
    ]);
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
  };

  const undoneTasks = tasks.filter((task) => !task.done);

  const tasksToShow = showOnlyUndoneTasks ? undoneTasks : tasks;

  const handleChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setNewTaskDueDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addTask(newTask, newTaskDueDate);
    setNewTask("");
    setNewTaskDueDate("");
  };

  const handleFilterChange = (event) => {
    setShowOnlyUndoneTasks(event.target.checked);
  };

  const renderDueDate = (task) => {
    if (task.done || !task.dueDate) {
      return null;
    }
    const dueDate = new Date(task.dueDate);
    const distanceToNow = formatDistanceToNowStrict(dueDate, {
      addSuffix: true,
      locale: language === "en" ? en : vi
    });
    return <span>{distanceToNow}</span>;
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const renderLanguageSwitcher = () => {
    return (
      <div>
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>
      </div>
    );
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("index", index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, index) => {
    const draggedIndex = event.dataTransfer.getData("index");
    const updatedTasks = [...tasks];
    const draggedTask = updatedTasks[draggedIndex];
    updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(index, 0, draggedTask);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <h2>{language === "en" ? "Todo List" : "Danh sách công việc"}</h2>
      {renderLanguageSwitcher()}
      <form onSubmit={handleSubmit}>
        <label>
          {language === "en" ? "Task:" : "Công việc:"}
          <input type="text" value={newTask} onChange={handleChange} />
        </label>
        <label>
          {language === "en" ? "Due Date:" : "Hạn chót:"}
          <input
            type="date"
            value={newTaskDueDate}
            onChange={handleDueDateChange}
          />
        </label>
        <button type="submit">
          {language === "en" ? "Add Task" : "Thêm công việc"}
        </button>
      </form>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showOnlyUndoneTasks}
            onChange={handleFilterChange}
          />
          {language === "en"
            ? "Show only undone tasks"
            : "Thể hiện chỉ các công việc chưa hoàn thành"}
        </label>
      </div>
      <ul>
        {tasksToShow.map((task, index) => (
          <li
            key={task.id}
            style={{ textDecoration: task.done ? "line-through" : "none" }}
            draggable
            onDragStart={(event) => handleDragStart(event, index)}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, index)}
          >
            {task.title} {renderDueDate(task)}
            <button onClick={() => toggleTask(task.id)}>
              {task.done
                ? language === "en"
                  ? "Undone"
                  : "Chưa hoàn thành"
                : language === "en"
                ? "Done"
                : "Đã hoàn thành"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default TodoList;
