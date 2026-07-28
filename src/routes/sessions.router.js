import express from 'express';

const router = express.Router()

router.post("/:sessionId/register", async (req, res)=>{
  res.json({}) 
})



router.get("/:sessionId", async (req, res)=>{
  res.json({})
})


export default router