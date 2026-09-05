import express from 'express'
//using open ai api not used in tutorial
import { openaiassistant, virtuallassistant, weatherassistant } from '../controllers/assitantcotrolelr.js'
const router = express.Router()

// Each route connects a URL to a controller function.
router.post("/virtuallassistant", virtuallassistant)
router.post("/openai", openaiassistant)
router.post("/weather", weatherassistant)

export default router