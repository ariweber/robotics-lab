import express from 'express';

const router = express.Router()

router.get("/:usersID", async (req, res) => {
  res.json({})

})


router.post("/", async (req, res) => {
  res.json({})
})

export default router