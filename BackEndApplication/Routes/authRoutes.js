const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../Config/db')

const router = express.Router()

router.post('/forgot-password', async (req, res) => {
  const {email, newPassword} = req.body

  db.get('SELECT * FROM users WHERE email=?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      })
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found',
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    db.run(
      'UPDATE users SET password=? WHERE email=?',
      [hashedPassword, email],
      err => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          })
        }

        res.json({
          success: true,
          message: 'Password Updated Successfully',
        })
      },
    )
  })
})

router.post('/register', async (req, res) => {
  try {
    const {name, email, password, role} = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    db.run(
      `INSERT INTO users(name,email,password,role)
       VALUES(?,?,?,?)`,
      [name, email, hashedPassword, role],
      function (err) {
        if (err) {
          return res.status(500).json({
            error: err.message,
          })
        }

        res.status(201).json({
          success: true,
          message: 'User Registered Successfully',
        })
      },
    )
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

router.post('/login', (req, res) => {
  const {email, password} = req.body

  db.get('SELECT * FROM users WHERE email=?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      })
    }

    if (!user) {
      return res.status(401).json({
        message: 'User Not Found',
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid Credentials',
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    )

    res.json({
      success: true,
      message: 'Login Successful',
      token,
    })
  })
})

const auth = require('../Middleware/auth')

router.get('/profile', auth, (req, res) => {
  res.json({
    message: 'Protected Route Accessed',
    user: req.user,
  })
})

router.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      })
    }

    res.json(rows)
  })
})

module.exports = router
