const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./employee_leave.db', err => {
  if (err) {
    console.log(err)
    return
  }

  console.log('✅ SQLite Connected')

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'employee'
    )
  `)

  db.run(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT,
    designation TEXT
  )
`)

  db.run(`
  CREATE TABLE IF NOT EXISTS leaves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    leave_type TEXT,
    reason TEXT,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'Pending'
  )
`)

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      department TEXT,
      designation TEXT
    )
  `)

  console.log('✅ Tables Created')
})

module.exports = db
