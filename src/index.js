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

  const userFound = users.find((user) => user.username === body.username )

  if(userFound) {
    return response.status(400).json({error: 'Username already in use'})
  }

  const user = {
    id: uuidv4(),
    name: body.name, 
    username: body.username, 
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  console.log('ENTROU')
  const {user} = request

  console.log('user todos', user.todos)

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
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;