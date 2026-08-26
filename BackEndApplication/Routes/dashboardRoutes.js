const express = require('express')
const db = require('../Config/db')
const auth = require('../Middleware/auth')

const router = express.Router()

router.get('/', auth, (req, res) => {
  db.get(
    `
    SELECT
      (SELECT COUNT(*) FROM employees) AS totalEmployees,
      (SELECT COUNT(*) FROM leaves WHERE status='Pending') AS pendingLeaves,
      (SELECT COUNT(*) FROM leaves WHERE status='Approved') AS approvedLeaves,
      (SELECT COUNT(*) FROM leaves WHERE status='Rejected') AS rejectedLeaves
    `,
    [],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        })
      }

      res.json(row)
    },
  )
})

module.exports = router
