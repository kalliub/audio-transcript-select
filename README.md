
# Audio Transcription Selector

## About the project

First of all, this project has become a study project for me. I wanted to implement some best development practices and use it as a catalog for future reference.

A friend of mine had extracted some [RPGuaxa podcast episodes](https://www.deviante.com.br/podcasts/rpguaxa/) and their fragments. After that, a Machine Learning algorithm classified the different speakers for each audio fragment, writing the data on a JSON file.

He needed the *"simplest, fastest and dirtiest"* interface to make easier for him to listen to the fragment file and review the speakers identified by the algorithm, so he could fix the speaker identification in case of the algorithm's mistake.

## Table of Contents

- [Audio Transcription Selector](#audio-transcription-selector)
  - [About the project](#about-the-project)
  - [Table of Contents](#table-of-contents)
    - [Technologies used](#technologies-used)
      - [Why these technologies?](#why-these-technologies)
  - [Requirements](#requirements)
  - [How to Run (using local database instance)](#how-to-run-using-local-database-instance)
  - [Additional information](#additional-information)
    - [Episode data files](#episode-data-files)
    - [MongoDB Atlas](#mongodb-atlas)
    - [Running tests locally](#running-tests-locally)
      - [Attention](#attention)

### Technologies used

The project was built with:

- [React](https://react.dev)
- [Remix](https://remix.run)
- [MongoDB](https://www.mongodb.com)
- [Mongoose](https://mongoosejs.com/)
- [MUI (Material-UI)](https://mui.com/material-ui/)
- [Cypress](https://www.cypress.io)
- [TypeScript](https://www.typescriptlang.org) (+ [ESLint](https://eslint.org) and [Prettier](https://prettier.io))
- [Docker](https://www.docker.com)

#### Why these technologies?

First, I chose **React** because I am more familiar with it.

**Remix** because as a requirement, I would have to deal with local files and a database to save the user choices, so a simple, static, client-side application wouldn't be enough and it would require a backend service.

**MongoDB** was chosen because I needed a simple NoSQL database to each the user choices (because the episodes could easily reach 4000 audio fragments, so it would probably be impossible to finish it quickly). MongoDB was my first option because of Atlas, which gives me a free hosted instance to use.

Eventually, I needed to switch from Prisma to **Mongoose**, because Prisma had complications on supporting local MongoDB instances, so it would be easier to change.

To make a basic style for the application, I chose **MUI** because it is a simple and easy-to-use library that I am familiar with.

Later, when writing tests, **Cypress** was a natural choice, because I started to be mentored by a QA engineer that uses it a lot, so this turned to be a good study opportunity.

**Docker** and **Docker Compose** helped me to run the application on an isolated environment, so my friend could run a complete application without troubles. Beyond that, isolated environments helped me to stablish good testing practices and easily integrate with the CI/CD.

Finally, **Typescript**, along with Remix is a natural choice for me, considering the type safety and the best practices that it brings, without mentioning my familiarity.

## Requirements

- Docker
- MongoDB Atlas URL (optional, but recommended)

## How to Run (using local database instance)

1. Clone the repository
2. Ensure that episodes JSON and fragments are in the correct path. For example: `/app/episodes/<episode-number>`. Check the [Episode data files](#episode-data-files) section for more information;
3. Check the environment variables on `docker-compose.yml` - `app` service.
4. [If using MongoDB Atlas, check this section](#mongodb-atlas)
5. Run the Docker Compose: `docker compose up --build`
6. Access the application on `localhost:3000` through your browser.

## Additional information

### Episode data files

The data JSON should be named `data.json` and the audio folder `fragments/`, with the audio files named as `<timestamp-start>_<timestamp-end>.mp3`, just like the `data.json` file.

You can change the episodes file path by setting the `EPISODES_FILE_PATH` environment variable to `/app/whatever` in the `docker-compose.yml` file, `app` service.

Here's an example of the episode 1 file structure:

``` plaintext
/app/episodes/1/data.json
/app/episodes/1/fragments/0_10.mp3
```

### MongoDB Atlas

For production usage, I highly recommend to create a free instance on [MongoDB Atlas](https://atlas.mongodb.com) to use as your database. After creating the instance, you can get the connection string on the "Connect" tab of your cluster.

The URL should look like: `mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority`.

Then:

1. Open `docker-compose.yml` file and find the `app` service, `environment` section;
2. Set the `MONGO_DB_URL` environment variable to the connection string you got from Atlas.
3. Comment the authentication variables. They are already included in the connection string.
   1. `MONGO_DB_USER`
   2. `MONGO_DB_PASSWORD`
   3. `MONGO_DB_NAME` (default db name is `app`, but you can set a custom one here, if not included on the connection string)

### Running tests locally

You can run the tests with Cypress opening the Cypress GUI with `npm run test:open` or running the tests on the CLI with `npm run test`.

I highly recommend you to use the local mongodb instance to run your tests, so you can have a clean database for each test run.

1. Certify that the `docker-compose.yml` file has the `app` service with the correct environment variables:
   1. `MONGO_DB_URL`;
   2. `MONGO_DB_USER`;
   3. `MONGO_DB_PASSWORD`;
   4. `MONGO_DB_NAME`.
2. Run the application with `docker compose up --build`;
3. On a different terminal, run the tests with `npm run test` or `npm run test:open`.

#### Attention

- If desired, you can change the database connection variables on the `cypress.config.ts` file.
- You must be careful with these configurations, because the same tests will run on the GitHub Actions pipeline.
