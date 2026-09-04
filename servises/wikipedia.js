import axios from "axios";

async function searching(query, maxlines = 5) {
    try {
        const apiURL = "https://en.wikipedia.org/w/api.php";
        const headers = {
            "User-Agent": "Jarvis-AI/1.0 (Wikipedia lookup application)"
        };
        const searchResponse = await axios.get(apiURL, {
            headers,
            params: {
                action: "query",
                list: "search",
                srsearch: query,
                format: "json",
                utf8: 1
            }
        });
        const results = searchResponse.data.query.search;
        if (!results.length) {
            throw new Error("No results found for the given query.");
        }

        const title = results[0].title;
        const articleResponse = await axios.get(apiURL, {
            headers,
            params: {
                action: "query",
                prop: "extracts",
                exintro: 1,
                explaintext: 1,
                redirects: 1,
                titles: title,
                format: "json",
                utf8: 1
            }
        });
        const pages = articleResponse.data.query.pages;
        const article = Object.values(pages)[0];
        const content = article.extract?.split("\n").slice(0, maxlines).join("\n");

        if (!content) {
            throw new Error("Wikipedia article has no summary.");
        }

        return { title: article.title, content };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default searching;