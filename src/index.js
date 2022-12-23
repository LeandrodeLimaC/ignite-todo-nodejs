const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  if(!username) {
    return response.status(400).json({error: 'Username is required'})
  }

  const userFound = users.find((user) => user.username === username )

  if(!userFound) {
    return response.status(404).json({error: 'Username not found'})
  }

  request.user = userFound
  next()
}

app.post('/users', (request, response) => {
  const {body} = request
  
  if(!body.name || !body.username) {
    return response.status(400).json({error: 'Name and Username are required'})
  }

  const usernameAlreadyExists = users.some((user) => user.username === body.username )

  if(usernameAlreadyExists) {
    return response.status(400).json({error: 'Username already in use, please choose another'})
  }

  const newUser = {
    id: uuidv4(),
    name: body.name, 
    username: body.username, 
    todos: []
  }

  users.push(newUser)

  return response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const {title, deadline} = request.body

  const newTodo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user, params, body: { title, deadline } } = request
  
  const todoIndex = user.todos.findIndex((todo) => todo.id === params.id)

  if(todoIndex === -1) {
    return response.status(404).json({error: "Todo not found"})
  }

  const todoUpdated = {
    ...user.todos[todoIndex],
    ...(title && { title: title }),
    ...(deadline && { deadline: new Date(deadline) })
  }

  user.todos[todoIndex] = todoUpdated

  return response.status(200).json(todoUpdated)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;