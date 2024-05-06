const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [];

// Generate unique task ID
let taskIdCounter = 1;

// Function to add a new task
function addTask(title, description, status) {
    const newTask = {
        id: taskIdCounter++,
        title: title,
        description: description,
        status: status
    };
    tasks.push(newTask);
    return newTask;
}

// Function to retrieve all tasks
function getAllTasks() {
    return tasks;
}

// Function to find a task by ID
function findTaskById(id) {
    return tasks.find(task => task.id === id);
}

// Function to update an existing task
function updateTask(id, title, description, status) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].title = title;
        tasks[taskIndex].description = description;
        tasks[taskIndex].status = status;
        return tasks[taskIndex];
    }
    return null;
}

// Function to remove a task
function removeTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        const removedTask = tasks.splice(taskIndex, 1);
        return removedTask[0];
    }
    return null;
}

// Route to add a new task
app.post('/tasks', (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !status) {
        return res.status(400).json({ error: 'Title and status are required fields' });
    }
    const newTask = addTask(title, description || '', status);
    res.status(201).json(newTask);
});

// Route to get all tasks
app.get('/tasks', (req, res) => {
    const allTasks = getAllTasks();
    res.json(allTasks);
});

// Route to update an existing task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, status } = req.body;
    const updatedTask = updateTask(taskId, title, description, status);
    if (updatedTask) {
        res.json(updatedTask);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Route to delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const removedTask = removeTask(taskId);
    if (removedTask) {
        res.json(removedTask);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
