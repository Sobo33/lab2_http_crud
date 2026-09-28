const express = require("express")

const app = express()
const port = 3000

app.use (express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let hotels = [
    { id: 1, name: 'Отель Редоран', stars: 3 },
    { id: 2, name: 'Отель Нордский', stars: 5 },
    { id: 3, name: 'Отель Хааджит', stars: 2 }
];

let nextId = 4;

app.get('/hotels', (req, res) => {
    res.json({
        count: hotels.length,
        hotels: hotels
    });
});

app.get('/hotels/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const hotel = hotels.find(i => i, id === id);

    if (!hotel) {
        return res.status(404).json({ error:'Не найден УВЫ' });
    }

    res.json(item)
});

app.post ('/hotels', (req, res) => {
    const { name, stars } = req.body;

    if (!name || stars === undefined) {
        return res.status(400).json ({error: "Название и оценки обязательны для ввода!"});
    }

const newHotel = {
    id: nextId++,
    name: name,
    stars: stars
};

    items.push(newHotel)

    res.status(201).json(newItem);
});

app.put('/hotels/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = hotels.findIndex(i => i.id === id);

    if (!index === -1) {
        res.status(404).json({error: "Ищем... нет такого!"});
    }
    const { name, stars } = req.body;

    if (!name || stars === undefined) {
        return res.status(400).json ({error: "Название и оценки обязательны для ввода!"});
    }

    hotels[index] = {
        id: id,
        name: name || hotels[index].name,
        stars: stars || hotels[index].stars
    };

    res.json(items[index]);
});

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

app.use((req, res) => {
    res.status(404).json({
        error: "Маршрут не найден"
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});






