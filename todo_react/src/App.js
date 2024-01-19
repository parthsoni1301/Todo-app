import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);
  useEffect(() => {
    document.title = 'To Do App';
  }, []);
  const addTask = () => {
    fetch('http://127.0.0.1:8000/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTask, completed: false }),
    })
      .then((response) => response.json())
      .then((data) => setTasks([...tasks, data]))
      .catch((error) => console.error('Error adding task:', error));

    setNewTask('');
  };

  const markCompleted = (taskId, completed) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed } : task
    );

    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    })
      .then(() => setTasks(updatedTasks))
      .catch((error) => console.error('Error updating task:', error));
  };

  const deleteTask = (taskId) => {
    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      method: 'DELETE',
    })
      .then(() => setTasks(tasks.filter((task) => task.id !== taskId)))
      .catch((error) => console.error('Error deleting task:', error));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className={`container mt-5 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Todo List</h1>
        <div className="text-right">
          <label className="switch">
            <input type="checkbox" onChange={toggleDarkMode} />
            <span className="slider round"></span>
          </label>
          <span className="ml-2">Dark Mode</span>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mx-auto text-center">
          <div className="mb-3">
            <input
              type="text"
              className="form-control d-inline-block"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder='Enter the new task...'
            />
            <button
              className="btn btn-primary"
              onClick={addTask}
              disabled={!newTask.trim()} 
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h2>Incomplete Tasks</h2>
          <ul className="list-group">
            {incompleteTasks.map((task) => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{task.title}</span>
                <div>
                  <button
                    className="btn btn-success mx-2"
                    onClick={() => markCompleted(task.id, true)}
                  >
                    Mark as Completed
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete Task
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h2>Completed Tasks</h2>
          <ul className="list-group">
            {completedTasks.map((task) => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{task.title}</span>
                <div>
                  <button
                    className="btn btn-warning mx-2"
                    onClick={() => markCompleted(task.id, false)}
                  >
                    Mark as Incomplete
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete Task
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
