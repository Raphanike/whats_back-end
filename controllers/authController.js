    const bcrypt = require('bcryptjs')
    const jwt = require('jsonwebtoken')
    const User = require('../models/User')

    exports.register = async (req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })
    res.status(201).json({ message: 'Usuário criado com sucesso' })
    }

    exports.login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' })

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) return res.status(400).json({ error: 'Senha inválida' })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user._id, name: user.name } })
    }
