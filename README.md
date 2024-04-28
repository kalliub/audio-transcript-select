# Audio Transcription Selector

## Requirements

- Node.js (18+)
- npm
- Python3
- MongoDB database connection url

## How to Run

1. Clone the repository

2. Install dependencies: `npm install`

3. Configure the env file according to the `.env.example`

4. Copy the data files to the `data` folder: `/app/data/<episode-number>`.

5. Run Prisma to sync the database: `npx prisma db push`

6. On a separate console tab, run the python http.server on the project root folder to serve the static files: `python3 -m http.server`

7. Back on the first tab, run the frontend application: `npm run dev`

8. Access the application on `http://localhost:3000`

## Additional Info

1. The data JSON should be named `data.json` and the audio folder `fragments/`, with the audio files named as `<timestamp-start>_<timestamp-end>.mp3`, just like the `data.json` file.
