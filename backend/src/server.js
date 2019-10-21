const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const cors = require('cors');

const app = express();
const server = http.Server(app);
const io = socketio(server);



mongoose.connect('mongodb+srv://guilherme:omnistack@omnistack-4l9xv.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})
// GET, POST, PUT, DELETE

// req.query = acessar query params(para filtros)
// req.params = acessar route params(para edição, delete)
// req.body = acessar corpo da requisicao(edicao, criacao)

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);

