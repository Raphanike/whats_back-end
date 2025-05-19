const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
const { Server } = require('socket.io')
const authRoutes = require('./routes/authRoutes')

dotenv.config()
const app = express()
const server = http.createServer(app)
const Message = require('./models/message')
const messageRoutes = require('./routes/messageRoutes')
app.use('/api/messages', messageRoutes)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
    })

    app.use(cors())
    app.use(express.json())
    app.use('/api/auth', authRoutes)

    // SOCKET.IO
    io.on('connection', (socket) => {
    console.log('Novo usuário conectado:', socket.id)

    socket.on('send_message', async (data) => {
    const { sender, receiver, content } = data

    // Salva no banco
    const message = new Message({ sender, receiver, content })
    await message.save()

    // Envia para todos os sockets
    io.emit('receive_message', message)
})


    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id)
    })
    })

    // MONGO + START
    mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB conectado')
    server.listen(process.env.PORT, () => {
        console.log(`Servidor rodando na porta ${process.env.PORT}`)
    })
    }).catch(err => console.log(err))
