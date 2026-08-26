const express = require('express')
const db = require('../Config/db')
const auth = require('../Middleware/auth')

const router = express.Router()

/* Apply Leave */
router.post('/', auth, (req, res) => {
  const {employee_id, leave_type, reason, start_date, end_date} = req.body

  db.run(
    `INSERT INTO leaves
    (employee_id, leave_type, reason, start_date, end_date)
    VALUES (?, ?, ?, ?, ?)`,
    [employee_id, leave_type, reason, start_date, end_date],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        })
      }

      res.status(201).json({
        success: true,
        leaveId: this.lastID,
        message: 'Leave Applied Successfully',
      })
    },
  )
})

/* Get All Leaves */
router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM leaves', [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      })
    }

    res.json(rows)
  })
})

/* Approve Leave */
router.put('/:id/approve', auth, (req, res) => {
  db.run(
    `UPDATE leaves
     SET status = 'Approved'
     WHERE id = ?`,
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        })
      }

      res.json({
        success: true,
        message: 'Leave Approved',
      })
    },
  )
})

/* Reject Leave */
router.put('/:id/reject', auth, (req, res) => {
  db.run(
    `UPDATE leaves
     SET status = 'Rejected'
     WHERE id = ?`,
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        })
      }

      res.json({
        success: true,
        message: 'Leave Rejected',
      })
    },
  )
})

/* Delete Leave */
router.delete('/:id', auth, (req, res) => {
  db.run('DELETE FROM leaves WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message,
      })
    }

    res.json({
      success: true,
      message: 'Leave Deleted Successfully',
    })
  })
})

router.get('/leave-chart', auth, (req, res) => {
  db.all(
    `
    SELECT status, COUNT(*) as count
    FROM leaves
    GROUP BY status
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        })
      }

      res.json(rows)
    },
  )
})

router.get('/department-chart', auth, (req, res) => {
  db.all(
    `
    SELECT department,
           COUNT(*) as count
    FROM employees
    GROUP BY department
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        })
      }

      res.json(rows)
    },
  )
})
router.get('/monthly-leaves', auth, (req, res) => {
  db.all(
    `
    SELECT substr(start_date,1,7) as month,
           COUNT(*) as total
    FROM leaves
    GROUP BY month
    ORDER BY month
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        })
      }

      res.json(rows)
    },
  )
})

module.exports = router
