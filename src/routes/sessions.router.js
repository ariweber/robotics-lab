import Router from 'express';

const router = Router()

router.post("/:sessionId/register", async (req, res)=>{
  res.json({}) 
})



router.get("/sessions/:sessionId", async (req, res)=>{
  res.json({})
})


export default router