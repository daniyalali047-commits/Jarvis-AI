import searching from "../servises/wikipedia.js"
import askOpenAI from "../servises/openai.js"
import getWeather from "../servises/weather-service.js"
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
// Receive the location from the browser and return the weather as JSON.
export async function weatherassistant (req, resp){
    try {
        const { location } = req.body;
        if (!location) {
            return resp.status(400).json({error: "Location is required."})
        }

        // The service performs the actual WeatherAPI request.
        const result = await getWeather(location)
        resp.json(result)
    } catch (error) {
        console.log(error)
        resp.status(500).json({error: error.message})
    }
}

