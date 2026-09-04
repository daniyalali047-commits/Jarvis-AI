import express from 'express'
//using open ai api not used in tutorial
import { openaiassistant, virtuallassistant } from '../controllers/assitantcotrolelr.js'
const router = express.Router()

router.post("/virtuallassistant", virtuallassistant)
router.post("/openai", openaiassistant)

export default router