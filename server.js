const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const { Server } = require('socket.io')

const authRoutes = require('./routes/authRoutes')
// Você deve importar também as rotas de mensagens se tiver

dotenv.config()

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',  // Ajuste a origem conforme sua necessidade
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/auth', authRoutes)
// app.use('/api/messages', messageRoutes) // se você tiver rotas de mensagens

// Socket.IO
io.on('connection', (socket) => {
  console.log('Usuário conectado: ' + socket.id)

  socket.on('send_message', (msg) => {
    // Aqui você pode salvar a mensagem no banco (usar o model Message)
    // e depois emitir para o destinatário

    // Exemplo simples: emitir para todos conectados
    io.emit('receive_message', msg)
  })

  socket.on('disconnect', () => {
    console.log('Usuário desconectado: ' + socket.id)
  })
})

// Conexão com MongoDB Atlas e inicialização do servidor
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado')
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })
  })
  .catch((err) => console.log('Erro ao conectar no MongoDB:', err))
