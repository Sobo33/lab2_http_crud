const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let hotels = [
    { id: 1, name: "Hotel 1", stars: 3 },
    { id: 2, name: "Hotel 2", stars: 5 },
    { id: 3, name: "Hotel 3", stars: 2 }
];

let nextId = 4;


// GET — получить все отели
app.get("/hotels", (req, res) => {
    res.json({
        count: hotels.length,
        hotels: hotels
    });
});


// GET — получить один отель
app.get("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const hotel = hotels.find(i => i.id === id);

    if (!hotel) {
        return res.status(404).json({
            error: "Не найден УВЫ"
        });
    }

    res.json(hotel);
});


// POST — добавить новый отель
app.post("/hotels", (req, res) => {
    const { name, stars } = req.body;

    if (!name || stars === undefined) {
        return res.status(400).json({
            error: "Название и оценки обязательны для ввода!"
        });
    }

    const newHotel = {
        id: nextId++,
        name: name,
        stars: stars
    };

    hotels.push(newHotel);

    res.status(201).json(newHotel);
});


// PUT — изменить отель
app.put("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = hotels.findIndex(i => i.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Ищем... нет такого!"
        });
    }

    const { name, stars } = req.body;

    if (!name || stars === undefined) {
        return res.status(400).json({
            error: "Название и оценки обязательны для ввода!"
        });
    }

    hotels[index] = {
        id: id,
        name: name,
        stars: stars
    };

    res.json(hotels[index]);
});


// DELETE — удалить отель
app.delete("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = hotels.findIndex(h => h.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Отель не найден"
        });
    }

    const deletedHotel = hotels.splice(index, 1)[0];

    res.json({
        message: "Отель удалён",
        deleted: deletedHotel
    });
});


// Неизвестный маршрут
app.use((req, res) => {
    res.status(404).json({
        error: "Маршрут не найден"
    });
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});