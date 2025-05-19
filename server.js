const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const server = http.createServer(app);
const Message = require('./models/message');
const messageRoutes = require('./routes/messageRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);

// Configuração do Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);

  socket.on('send_message', async (data) => {
    const { sender, receiver, content } = data;

    // Salva no banco
    const message = new Message({ sender, receiver, content });
    await message.save();

    // Envia para todos os sockets conectados
    io.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

// Conexão com o MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    // Iniciar o servidor
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log('Erro ao conectar no MongoDB:', err));
