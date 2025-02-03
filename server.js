// ✅ Подключение зависимостей
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json()); 

// ✅ Объявляем PORT СРАЗУ (до использования)
const PORT = process.env.PORT || 3000;

// ✅ Подключение к MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("✅ Подключено к MongoDB Atlas"))
.catch(err => console.error("❌ Ошибка подключения к MongoDB:", err));

// ✅ Определяем схему книги
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);

// ✅ SWAGGER ДОКУМЕНТАЦИЯ
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Management API",
      version: "1.0.0",
      description: "API для управления книгами",
    },
  },
  apis: ["./server.js"], 
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// ✅ РОУТЫ API (CRUD)

// 📌 Получить все книги
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 📌 Добавить новую книгу
app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 📌 Обновить книгу по ID
app.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: "Ошибка обновления" });
  }
});

// 📌 Удалить книгу по ID
app.delete("/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Книга удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка удаления" });
  }
});

// 📌 Получить погоду через OpenWeather API
app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;
  const API_KEY = process.env.WEATHER_API_KEY;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    res.json({
      city: data.name,
      temperature: `${data.main.temp}°C`,
      condition: data.weather[0].description,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения данных о погоде" });
  }
});

// ✅ Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
