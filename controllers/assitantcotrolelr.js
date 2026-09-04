import searching from "../servises/wikipedia.js"
import askOpenAI from "../servises/openai.js"
//wikepedia search services
export async function virtuallassistant (req , resp){
    try {
        const {query , maxlines} = req.body;
        if (!query) {
            return resp.status(400).json({error: "Query parameter is required."})
        }
       const result =  await searching(query, maxlines ? parseInt(maxlines) : 5)
       resp.json(result)
    } catch (error) {
        console.log(error)
        resp.status(500).json({error: error.message})
    }
}


//Using oepnai not used in tutorial
export async function openaiassistant (req, resp){
    try {
        const { query } = req.body;
        if (!query) {
            return resp.status(400).json({error: "Query parameter is required."})
        }

        const result = await askOpenAI(query)
        resp.type("text").send(result.answer)
    } catch (error) {
        console.log(error)
        resp.status(500).json({error: error.message})
    }
}

