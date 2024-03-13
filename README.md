# Hacker News Data Spooling

## Features

This task include the following functionalities:

- Data spooling from the Hacker News API
- Storing data in a database
- Handling duplicate items
- Using queues for asynchronous processing
- Implementation of jobs for periodic data spooling

## Technologies Used

- NestJS
- Sequelize
- Bull
- Hacker News API

## Installation

To set up the project take the following steps:

- Clone the repository: git clone <https://github.com/devfresher/hacker-news-spooler>
- Install dependencies: npm install
- Set up environment variables: Create a .env file (from .env.example) and specify the required environment variables.
- Setup a redis connection and add it as part of the environment variables in the .env file
- Start the application: npm start

## Data Spooling Simulation

To simulate the data spooling, when the application has been started successfully, navigate to the browser or any API client and send a get request to <https://localhost:3000/stories/simulate-spooling>. Spooling starts automatically. Subsequent spools happens every 12 hours interval

## API Documentation

API documentation can be found <https://documenter.getpostman.com/view/32471171/2sA2xjyAic>
