import express from 'express'
import dotenv  from 'dotenv'
import bodyParser from 'body-parser'
import virtualRoutes from './routes/virtual-routes.js'

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/Jarvis-AI', virtualRoutes)

app.get("/", (req , resp)=>{
    resp.sendFile('index.html', { root: 'public' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT)