# Blossom Study Timer

Blossom Study Timer is a minimal, responsive Pomodoro-style web app built with plain HTML, Bootstrap, and JavaScript. It helps you stay focused using configurable study and break lengths and gentle audio notifications powered by Tone.js.

## Features

- Configure study duration and number of sessions
- Choose between 5 or 10-minute breaks
- Select from three built-in ringtones
- Responsive UI with Bootstrap
- No build step required — works by opening `index.html` or serving the folder

## Quick start

1. Clone the repository or download the project folder.
2. Open `index.html` in a browser, or serve the folder with a simple local server.

Serve using Python (recommended):

```powershell
# From the project root
python -m http.server 8000
# Then open: http://localhost:8000/
```

## Development notes

- Audio is provided by Tone.js. The app uses the UMD build (CDN) to provide a global `Tone` object.
- If you want to use modern ES modules and local development tooling, convert `script.js` to an ES module and update `index.html` accordingly.

## Files

- `index.html` — main UI and assets
- `script.js` — core timer logic and audio handling
- `style.css` — custom styles
- `.gitignore` — recommended ignores for this project

## License

This project is provided under the MIT License. Feel free to use and adapt it for personal projects.
