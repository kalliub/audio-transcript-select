
# Audio Transcription Selector

## Table of Contents

- [Audio Transcription Selector](#audio-transcription-selector)
  - [Table of Contents](#table-of-contents)
  - [About the project](#about-the-project)
    - [Technologies used](#technologies-used)
      - [Why these technologies?](#why-these-technologies)
  - [Requirements](#requirements)
  - [How to Run](#how-to-run)
    - [Episode data files](#episode-data-files)

## About the project

A friend of mine (which will be called as "user") had extracted some [RPGuaxa podcast episodes](https://www.deviante.com.br/podcasts/rpguaxa/) and their fragments. After that, a Machine Learning algorithm classified the different speakers for each audio fragment, writing the data on a JSON file.

He needed the *"simplest, fastest and dirtiest"* interface to make easier for him to listen to the fragment file and review the speakers identified by the algorithm, so he could fix the speaker identification in case of the algorithm's mistake.

### Technologies used

The project was built using the following technologies:

- [React](https://react.dev)
- [Remix](https://remix.run)
- [MongoDB](https://www.mongodb.com)
- [Prisma](https://www.prisma.io)
- [MUI (Material-UI)](https://mui.com/material-ui/)
- [TypeScript](https://www.typescriptlang.org) (+ [ESLint](https://eslint.org) and [Prettier](https://prettier.io))

#### Why these technologies?

First, I chose **React** because I am more familiar with it. I chose **Remix** because as a requirement, I would have to deal with local files and a database to save the user choices, so a simple, static, client-side application wouldn't be enough and it required a backend.

As I needed a simple NoSQL database to simply save the user choices (because the episodes could easily reach 4000 audio fragments, so it would probably be impossible to finish it quickly), I first chose **MongoDB** because of Atlas, which gives me a free hosted instance to use. Then, I chose **Prisma** to interact with the database, because Remix documentation has lots of information about it so I could implement it with the best practices.

To make a basic style for the application, I chose **MUI** because it is a simple and easy-to-use library that I am familiar with.

Finally, **Typescript**, along with Remix is a natural choice for me, considering the type safety and the best practices that it brings, without mentioning my familiarity.

## Requirements

- Node.js (18+)
- npm
- MongoDB database connection url. You can get a cloud instance for free using [MongoDB Atlas](https://atlas.mongodb.com).

## How to Run

1. Clone the repository

2. Install dependencies: `npm install`

3. Configure the env file according to the `.env.example`

4. Ensure that episodes JSON and fragments exists according you environment EPISODES_FILE_PATH variable. For example: `/app/data/<episode-number>`. Check the [Episode data files](#episode-data-files) section for more information.

5. Run Prisma to sync the data model with your MongoDB database: `npx prisma db push`

6. Back on the first tab, run the frontend application: `npm run dev`

7. Access the application on `http://localhost:3000` through your browser.

### Episode data files

The data JSON should be named `data.json` and the audio folder `fragments/`, with the audio files named as `<timestamp-start>_<timestamp-end>.mp3`, just like the `data.json` file.

An example of the episode 1 file structure:

``` plaintext
app/data/1/data.json
app/data/1/fragments/0_10.mp3
```

As a sample directory, I have changed `EPISODES_FILE_PATH` to `app/episodes` in the `.env` file.
