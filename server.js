require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json()); 

// 🔹 Подключение к MongoDB с обработкой ошибок
require('dotenv').config(); // Подключаем .env

const express = require('express'); // Подключаем express
const mongoose = require('mongoose'); // Подключаем mongoose (ОБРАТИТЕ ВНИМАНИЕ: должно быть ОДИН раз)


// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Подключено к MongoDB Atlas"))
.catch(err => console.error("❌ Ошибка подключения к MongoDB:", err));

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});


// 🔹 Определяем схему книги
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);

// 📌 SWAGGER ДОКУМЕНТАЦИЯ
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

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Получить все книги
 *     description: Возвращает список всех книг из базы данных
 *     responses:
 *       200:
 *         description: Успешный запрос
 */
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Добавить новую книгу
 *     description: Создает новую запись о книге
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               year:
 *                 type: integer
 *               genre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Книга успешно добавлена
 */
app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Обновить книгу
 *     description: Изменяет данные книги по ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID книги
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               year:
 *                 type: integer
 *               genre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Книга обновлена
 */
app.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: "Ошибка обновления" });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Удалить книгу
 *     description: Удаляет книгу по ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID книги
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Книга удалена
 */
app.delete("/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Книга удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка удаления" });
  }
});

/**
 * @swagger
 * /weather/{city}:
 *   get:
 *     summary: Получить погоду
 *     description: Получает данные о погоде из OpenWeather API
 *     parameters:
 *       - name: city
 *         in: path
 *         required: true
 *         description: Название города
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Погода получена
 */
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

// 🔥 Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
