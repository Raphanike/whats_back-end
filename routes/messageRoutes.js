const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const messageRoutes = require('./routes/messageRoutes') // ✅ aqui

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes) // ✅ aqui

// Porta
const PORT = process.env.PORT || 5000

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado')
        app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`)
        })
    })
    .catch((err) => console.log('Erro ao conectar no MongoDB:', err))
