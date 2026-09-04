# Jarvis AI

Jarvis AI is a browser-based voice assistant built with Node.js and Express. It combines browser speech recognition, browser text-to-speech, OpenRouter-powered answers, and Wikipedia article summaries in a small, easy-to-run application.

The browser handles microphone input, spoken output, and website commands locally. The Node.js server handles API requests and keeps the OpenRouter key on the server.

## Features

- Voice input through the browser microphone
- Spoken responses through the browser's Web Speech API
- Open websites with commands such as `open youtube` or `open google.com`
- Short conversational answers generated through OpenRouter
- Wikipedia search and introductory article summaries
- Stop control for cancelling speech, microphone recognition, and pending AI requests
- Responsive Jarvis-inspired interface for desktop and Chromebook browsers
- Environment-based configuration for API keys, models, and ports

## How It Works

```text
User speaks in browser
				|
				v
Chrome SpeechRecognition
				|
				+--> "open <website>" --> window.open() + speechSynthesis
				|
				+--> normal question --> Express /Jarvis-AI/openai
																			|
																			v
															OpenRouter chat model
																			|
																			v
															browser speechSynthesis
```

Website commands do not use OpenRouter. They are recognized directly in the browser, which makes them faster and allows the new tab and speech to happen on the user's device. Normal questions are sent to the server, and the server calls OpenRouter using the OpenAI-compatible SDK.

## Project Structure

```text
Jarvis-AI/
├── controllers/
│   └── assitantcotrolelr.js   # Request handlers for AI and Wikipedia routes
├── public/
│   └── index.html              # Voice-first browser interface
├── routes/
│   └── virtual-routes.js       # Express route definitions
├── servises/
│   ├── openai.js               # OpenRouter chat-completion service
│   └── wikipedia.js            # Wikipedia search and summary service
├── .env                        # Local secrets and configuration, not committed
├── .gitignore
├── index.js                    # Express server entry point
├── package.json
└── package-lock.json
```

The folder names and exported function names are kept as they exist in the project, including the current `servises` and `assitantcotrolelr` spellings.

## Requirements

- Node.js 18 or newer
- npm
- An OpenRouter API key
- A modern browser such as Chrome or Chromium
- Microphone permission for voice input

The browser voice features work especially well in ChromeOS. The server itself does not need Linux desktop audio or a local browser because speech and website opening happen in the browser page.

## Installation

```bash
git clone https://github.com/daniyalali047-commits/Jarvis-AI.git
cd Jarvis-AI
npm install
```

Create a `.env` file in the project root:

```env
PORT=5000
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openrouter/free
```

`OPENROUTER_MODEL` must be a chat or instruct model. Do not use an embedding model for normal questions. Free models can have queues, rate limits, or temporary availability problems.

Never commit `.env` or place an API key in frontend JavaScript. The repository ignores `.env` through `.gitignore`.

## Run The Application

```bash
node index.js
```

For development with automatic restarts:

```bash
npx nodemon index.js
```

Open the browser interface at:

```text
http://localhost:5000/
```

When running in GitHub Codespaces, use the public forwarded URL for port `5000` instead of Chromebook `localhost`. In VS Code, open the **Ports** panel and make port `5000` public, then open its forwarded URL.

If port `5000` is already in use, do not start a second server. Stop the existing Node/Nodemon process or use another port:

```bash
PORT=5001 node index.js
```

## Using The Browser Interface

1. Open the root page in Chrome.
2. Allow microphone access when Chrome asks.
3. Click **Use microphone**.
4. Speak a command or question.
5. Click **Stop** to interrupt listening or speech.

Examples:

```text
open youtube
open google
open github.com
what is python
how are you
```

Commands beginning with `open` are converted into a website URL. A value that already starts with `http://` or `https://` is used directly. Other values receive `https://www.` and, when necessary, a `.com` suffix.

The browser speaks responses without displaying the recognized text or answer. The browser's speech voice depends on the voices available in ChromeOS.

## API Reference

All application routes are mounted under `/Jarvis-AI`.

### Ask OpenRouter

```http
POST /Jarvis-AI/openai
Content-Type: application/json
```

Request:

```json
{
	"query": "What is Python?"
}
```

The response is plain text containing a short answer.

### Search Wikipedia

```http
POST /Jarvis-AI/virtuallassistant
Content-Type: application/json
```

Request:

```json
{
	"query": "Albert Einstein",
	"maxlines": 5
}
```

Response:

```json
{
	"title": "Albert Einstein",
	"content": "Albert Einstein was ..."
}
```

`maxlines` is optional and defaults to `5`. The Wikipedia service first searches for the query, then requests the introductory extract for the first matching article. Wikipedia does not require an API key.

### Test With cURL

```bash
curl -X POST http://localhost:5000/Jarvis-AI/openai \
	-H "Content-Type: application/json" \
	-d '{"query":"What is Python?"}'
```

```bash
curl -X POST http://localhost:5000/Jarvis-AI/virtuallassistant \
	-H "Content-Type: application/json" \
	-d '{"query":"Albert Einstein","maxlines":5}'
```

## Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Express port. Defaults to `5000`. |
| `OPENROUTER_API_KEY` | Yes | Secret used for OpenRouter requests. |
| `OPENAI_API_KEY` | Fallback | Supported as a fallback variable name, including OpenRouter-style keys. |
| `OPENROUTER_MODEL` | No | OpenRouter chat model. Defaults to `openrouter/free`. |

The OpenRouter service uses the OpenAI-compatible endpoint `https://openrouter.ai/api/v1` and limits generated answers so Jarvis can speak them more quickly. Actual response time depends on the selected model, free-provider queue, network, and browser speech startup.

## Voice And Platform Notes

- `SpeechRecognition` and `speechSynthesis` run in the browser, not in Node.js.
- The microphone requires browser permission and a supported browser.
- `window.open()` can be blocked if called outside a user interaction; Jarvis opens sites in response to the recognized microphone command.
- Codespaces can serve the page to your Chromebook, but it cannot directly use your Chromebook's speakers or control its browser through server-side Node.js.
- The old `say` and `opn` packages are not needed for the browser voice workflow. They require desktop capabilities on the machine running Node.js.

## Troubleshooting

### `ERR_CONNECTION_REFUSED` on localhost

The server is not running on that port, or it is running inside Codespaces rather than directly on the Chromebook. Start the server and use the forwarded Codespaces URL when appropriate.

### `EADDRINUSE: address already in use :::5000`

Another Node process already owns port `5000`. Use the running server, stop the duplicate process, or choose another port.

### The microphone does not start

Confirm that Chrome has microphone permission for the page and that the browser supports `SpeechRecognition` or `webkitSpeechRecognition`. Refresh the page after changing permission settings.

### Jarvis does not speak

Check that the Chromebook is not muted, the browser tab has permission to play audio, and speech synthesis is supported. OpenRouter errors are shown in the browser console and server terminal.

### OpenRouter returns `401`

Confirm that the key is valid, has not been revoked, and is loaded by the running server. Restart Node after changing `.env`. Do not add an Authorization header to the Jarvis browser request; the server uses the key privately.

### OpenRouter returns `404` for a model

The selected model is unavailable or is not currently free. Copy a current chat/instruct model ID from OpenRouter's Models page into `OPENROUTER_MODEL` and restart the server.

### The answer is slow

Free models may wait in a provider queue. Prefer a small, fast chat/instruct model, keep the answer prompt short, and keep `max_tokens` low. A 5–7 second response cannot be guaranteed when using busy free providers.

## Security

- Keep API keys in `.env` or your deployment secret manager.
- Never commit `.env` or paste keys into screenshots, chat, frontend code, or public repositories.
- Revoke and replace any key that has been exposed.
- Do not expose the OpenRouter key to browser code.
- Use HTTPS and authentication before exposing the server beyond personal development.

## Development Checks

```bash
node --check index.js
node --check controllers/assitantcotrolelr.js
node --check routes/virtual-routes.js
node --check servises/openai.js
```

The project currently does not include automated tests. The API examples above provide quick manual checks for the OpenRouter and Wikipedia services.

## License

No license has been declared for this project yet.
