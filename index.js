import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import virtualRoutes from './routes/virtual-routes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/Jarvis-AI', virtualRoutes)

app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Only listen on a port during local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

export default app