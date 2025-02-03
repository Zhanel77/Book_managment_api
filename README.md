# Book_managment_api
# Creating a README.md file with the necessary content
readme_content = """# Book Management API

This is a simple Book Management API built with Node.js, Express, MongoDB, and Swagger for documentation.

## Features
- 📚 Manage books (Create, Read, Update, Delete)
- 🌍 Fetch weather data from OpenWeather API
- 📜 API documentation using Swagger

## Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- Swagger
- OpenWeather API

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Zhanel77/Book_managment_api.git
Navigate to the project directory:
sh

cd Book_managment_api
Install dependencies:
sh
npm install
Create a .env file in the root directory and add:
env:
MONGO_URI=mongodb+srv://YOUR_MONGO_ATLAS_URI
WEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
PORT=3000
Start the server:
sh
node server.js

API Endpoints
Books API
Method	Endpoint	Description
GET	    /books	Get all books
POST	/books	Add a new book
PUT	    /books/:id	Update a book by ID
DELETE	/books/:id	Delete a book by ID
Weather API
Method	Endpoint	Description
GET	    /weather/:city	Get weather data for a city
Swagger Documentation
Visit:
bash
http://localhost:3000/api-docs/
Deployment
The API is deployed on Render:
arduino
https://book-managment-api-4mlr.onrender.com
Postman Collection
Postman file have book_managment_api.json
 
