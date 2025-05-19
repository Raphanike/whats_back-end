const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/auth', authRoutes)

// Porta (Render usa process.env.PORT)
const PORT = process.env.PORT || 5000

// Conexão com MongoDB Atlas e inicialização do servidor
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado')
        app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`)
        })
    })
    .catch((err) => console.log('Erro ao conectar no MongoDB:', err))
