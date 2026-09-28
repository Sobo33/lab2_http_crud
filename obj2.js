const express = require("express")

const app = express()
const port = 3000

app.use (express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let hotels = [
    { id: 1, name: 'Hotel Redoran', stars: 3, city: 'Mournehold', price_per_night: 15 },
    { id: 2, name: 'Hotel Nord', stars: 5, city: 'Riften', price_per_night: 50 },
    { id: 3, name: 'Hotel Khadjiit', stars: 2, city: 'Vivec', price_per_night: 5 }
];

let nextId = 4;

app.post("/hotels", (req, res) => {
    const { name, stars, city, price_per_night } = req.body;

    if (
        !name || stars === undefined ||
        !city || price_per_night === undefined
    ) {
        return res.status(400).json({
            error: "Все поля обязательны"
        });
    }

    if (
        typeof stars !== "number" ||
        typeof price_per_night !== "number"
    ) {
        return res.status(400).json({
            error: "Кол-во звёзд и цены в числовом формате так-то..."
        });
    }

    if (stars < 1 || stars > 5) {
        return res.status(400).json({
            error: "Количество звёзд должно быть от 1 до 5"
        });
    }

    if (price_per_night < 0) {
        return res.status(400).json({
            error: "Цена не может быть отрицательной"
        });
    }

    const newHotel = {
        id: nextId++,
        name,
        stars,
        city,
        price_per_night
    };

    hotels.push(newHotel);

    res.status(201).json(newHotel);
});

app.get("/hotels", (req, res) => {
    const search = req.query.search;
    const sort = req.query.sort;
    const order = req.query.order;

    let result = hotels;

    // Поиск
    if (search) {
        result = result.filter(h =>
            h.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Сортировка
    if (sort) {
        result = [...result].sort((a, b) => {
            if (a[sort] < b[sort]) {
                return order === "desc" ? 1 : -1;
            }

            if (a[sort] > b[sort]) {
                return order === "desc" ? -1 : 1;
            }

            return 0;
        });
    }

    res.json({
        count: result.length,
        hotels: result
    });
});

app.delete("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = hotels.findIndex(h => h.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Отель не найден"
        });
    }

    hotels.splice(index, 1);

    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({
        error: "Маршрут не найден"
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});