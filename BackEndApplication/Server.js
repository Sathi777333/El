require('dotenv').config({
  path: __dirname + '/.env',
})

const leaveRoutes = require('./Routes/leaveRoutes')

const express = require('express')

const cors = require('cors')

const db = require('./Config/db')
const authRoutes = require('./Routes/authRoutes')
const employeeRoutes = require('./Routes/employeeRoutes')
const dashboardRoutes = require('./Routes/dashboardRoutes')

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(cors())

app.use(express.json())

app.use('/api/leaves', leaveRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server Running : ${process.env.PORT}`)
})
