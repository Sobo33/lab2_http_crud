const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    const log =
        `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;

    fs.appendFile("access.log", log, (err) => {
        if (err) {
            console.error("Ошибка записи лога:", err);
        }
    });

    next();
});

let hotels = [
    {
        id: 1,
        name: "Grand Hotel",
        stars: 5,
        city: "Moscow",
        price_per_night: 12000
    },
    {
        id: 2,
        name: "City Hotel",
        stars: 4,
        city: "Kazan",
        price_per_night: 7000
    },
    {
        id: 3,
        name: "Park Hotel",
        stars: 3,
        city: "Sochi",
        price_per_night: 5000
    },
    {
        id: 4,
        name: "Moscow Plaza",
        stars: 4,
        city: "Moscow",
        price_per_night: 9000
    }
];

let nextId = 5;

app.get("/hotels", (req, res) => {
    const search = req.query.search;
    const sort = req.query.sort;
    const order = req.query.order;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let result = [...hotels];

    if (search) {
        result = result.filter(hotel =>
            hotel.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }

    if (sort) {
        result.sort((a, b) => {
            if (a[sort] < b[sort]) {
                return order === "desc" ? 1 : -1;
            }

            if (a[sort] > b[sort]) {
                return order === "desc" ? -1 : 1;
            }

            return 0;
        });
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedHotels = result.slice(start, end);

    res.json({
        page: page,
        limit: limit,
        total: result.length,
        hotels: paginatedHotels
    });
});

app.get("/hotels/stats", (req, res) => {
    if (hotels.length === 0) {
        return res.json({
            count: 0,
            average_price: 0
        });
    }

    const totalPrice = hotels.reduce(
        (sum, hotel) => sum + hotel.price_per_night,
        0
    );

    const averagePrice = totalPrice / hotels.length;

    res.json({
        count: hotels.length,
        average_price: averagePrice
    });
});

app.get("/hotels/:id/related", (req, res) => {
    const id = parseInt(req.params.id);

    const hotel = hotels.find(h => h.id === id);

    if (!hotel) {
        return res.status(404).json({
            error: "Отель не найден"
        });
    }

    const relatedHotels = hotels.filter(h =>
        h.city === hotel.city && h.id !== hotel.id
    );

    res.json({
        hotel: hotel,
        related: relatedHotels
    });
});

app.get("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const hotel = hotels.find(h => h.id === id);

    if (!hotel) {
        return res.status(404).json({
            error: "Отель не найден"
        });
    }

    res.json(hotel);
});

app.post("/hotels", (req, res) => {
    const {
        name,
        stars,
        city,
        price_per_night
    } = req.body;

    if (
        !name ||
        stars === undefined ||
        !city ||
        price_per_night === undefined
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
            error:
                "stars и price_per_night должны быть числами"
        });
    }

    // Проверка звёзд
    if (stars < 1 || stars > 5) {
        return res.status(400).json({
            error:
                "Количество звёзд должно быть от 1 до 5"
        });
    }

    // Проверка цены
    if (price_per_night < 0) {
        return res.status(400).json({
            error:
                "Цена не может быть отрицательной"
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

app.post("/hotels/bulk", (req, res) => {
    const newHotels = req.body;

    if (!Array.isArray(newHotels)) {
        return res.status(400).json({
            error: "Ожидается массив отелей"
        });
    }

    if (newHotels.length === 0) {
        return res.status(400).json({
            error: "Массив не должен быть пустым"
        });
    }

    const createdHotels = [];

    for (const hotel of newHotels) {
        const {
            name,
            stars,
            city,
            price_per_night
        } = hotel;

        if (
            !name ||
            stars === undefined ||
            !city ||
            price_per_night === undefined
        ) {
            return res.status(400).json({
                error:
                    "У каждого отеля должны быть name, stars, city и price_per_night"
            });
        }

        if (
            typeof stars !== "number" ||
            typeof price_per_night !== "number"
        ) {
            return res.status(400).json({
                error:
                    "stars и price_per_night должны быть числами"
            });
        }

        if (stars < 1 || stars > 5) {
            return res.status(400).json({
                error:
                    "Количество звёзд должно быть от 1 до 5"
            });
        }

        if (price_per_night < 0) {
            return res.status(400).json({
                error:
                    "Цена не может быть отрицательной"
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
        createdHotels.push(newHotel);
    }

    res.status(201).json({
        count: createdHotels.length,
        hotels: createdHotels
    });
});

app.put("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = hotels.findIndex(
        hotel => hotel.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Отель не найден"
        });
    }

    const {
        name,
        stars,
        city,
        price_per_night
    } = req.body;

    if (
        !name ||
        stars === undefined ||
        !city ||
        price_per_night === undefined
    ) {
        return res.status(400).json({
            error:
                "Для PUT необходимо передать все поля"
        });
    }

    if (
        typeof stars !== "number" ||
        typeof price_per_night !== "number"
    ) {
        return res.status(400).json({
            error:
                "stars и price_per_night должны быть числами"
        });
    }

    if (stars < 1 || stars > 5) {
        return res.status(400).json({
            error:
                "Количество звёзд должно быть от 1 до 5"
        });
    }

    if (price_per_night < 0) {
        return res.status(400).json({
            error:
                "Цена не может быть отрицательной"
        });
    }

    hotels[index] = {
        id,
        name,
        stars,
        city,
        price_per_night
    };

    res.json(hotels[index]);
});

app.patch("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = hotels.findIndex(
        hotel => hotel.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Отель не найден"
        });
    }

    const {
        name,
        stars,
        city,
        price_per_night
    } = req.body;

    if (
        stars !== undefined &&
        (
            typeof stars !== "number" ||
            stars < 1 ||
            stars > 5
        )
    ) {
        return res.status(400).json({
            error:
                "stars должно быть числом от 1 до 5"
        });
    }

    if (
        price_per_night !== undefined &&
        (
            typeof price_per_night !== "number" ||
            price_per_night < 0
        )
    ) {
        return res.status(400).json({
            error:
                "price_per_night должно быть положительным числом"
        });
    }

    if (name !== undefined) {
        hotels[index].name = name;
    }

    if (stars !== undefined) {
        hotels[index].stars = stars;
    }

    if (city !== undefined) {
        hotels[index].city = city;
    }

    if (price_per_night !== undefined) {
        hotels[index].price_per_night =
            price_per_night;
    }

    res.json(hotels[index]);
});

app.delete("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = hotels.findIndex(
        hotel => hotel.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Отель не найден"
        });
    }

    hotels.splice(index, 1);

    res.status(204).send();
});

app.delete("/hotels", (req, res) => {
    hotels = [];

    res.status(204).send();
});

app.get("/test-error", (req, res, next) => {
    next(new Error("Тестовая ошибка"));
});

app.use((req, res) => {
    res.status(404).json({
        error: "Маршрут не найден"
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: "Внутренняя ошибка сервера"
    });
});

app.listen(port, () => {
    console.log(
        `Сервер запущен на http://localhost:${port}`
    );
});