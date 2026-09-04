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

// Only run app.listen locally, not on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000
    app.listen(PORT , '0.0.0.0', ()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}

// Required for Vercel deployment
export default app