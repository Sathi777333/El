const express = require('express')
const db = require('../Config/db')
const auth = require('../Middleware/auth')

const router = express.Router()

router.post('/', auth, (req, res) => {
  const {name, email, department, designation} = req.body

  db.run(
    `INSERT INTO employees(name,email,department,designation)
     VALUES(?,?,?,?)`,
    [name, email, department, designation],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        })
      }

      res.json({
        success: true,
        employeeId: this.lastID,
        message: 'Employee Added Successfully',
      })
    },
  )
})

router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM employees', [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      })
    }

    res.json(rows)
  })
})

// Create Employee
router.post('/', auth, (req, res) => {
  const {name, email, department, designation} = req.body

  db.run(
    `INSERT INTO employees(name,email,department,designation)
     VALUES(?,?,?,?)`,
    [name, email, department, designation],
    function (err) {
      if (err) {
        return res.status(500).json({error: err.message})
      }

      res.status(201).json({
        success: true,
        employeeId: this.lastID,
      })
    },
  )
})

// Get All Employees
router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM employees', [], (err, rows) => {
    if (err) {
      return res.status(500).json({error: err.message})
    }

    res.json(rows)
  })
})

// Get Employee By Id
router.get('/:id', auth, (req, res) => {
  db.get('SELECT * FROM employees WHERE id=?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({error: err.message})
    }

    res.json(row)
  })
})

// Update Employee
router.put('/:id', auth, (req, res) => {
  const {name, email, department, designation} = req.body

  db.run(
    `UPDATE employees
     SET name=?,email=?,department=?,designation=?
     WHERE id=?`,
    [name, email, department, designation, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({error: err.message})
      }

      res.json({
        success: true,
        message: 'Employee Updated Successfully',
      })
    },
  )
})

// Delete Employee
router.delete('/:id', auth, (req, res) => {
  db.run('DELETE FROM employees WHERE id=?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({error: err.message})
    }

    res.json({
      success: true,
      message: 'Employee Deleted Successfully',
    })
  })
})

module.exports = router

module.exports = router
