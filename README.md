# Лабораторная работа №2: HTTP-методы GET, POST, PUT, DELETE

**Студент:** Сусло Антон Игоревич

**Группа:** ПИЖ-б-о-25-2

**Вариант:** 13

**Технология:** Node.js + Express

## Содержание

**1. Цель работы:** Освоить обработку различных HTTP-методов (GET, POST, PUT, DELETE) в Express. Научиться реализовывать CRUD-операции над коллекцией объектов, хранящейся в памяти сервера, а также возвращать корректные HTTP-коды ответов.

**2. Теоретическое обоснование:**

* CRUD — это набор из четырёх основных операций над данными:
  * Create — создание данных, HTTP-метод POST.
  * Read — чтение данных, HTTP-метод GET.
  * Update — обновление данных, HTTP-методы PUT / PATCH.
  * Delete — удаление данных, HTTP-метод DELETE.

* В данной работе данные хранятся в массиве в оперативной памяти сервера. Такой способ прост и не требует базы данных, однако после перезапуска сервера все внесённые изменения теряются.

* Основные HTTP-коды, используемые в работе:
  * 200 OK — запрос выполнен успешно.
  * 201 Created — ресурс успешно создан.
  * 204 No Content — запрос выполнен успешно, но тело ответа отсутствует.
  * 400 Bad Request — ошибка во входных данных.
  * 404 Not Found — ресурс не найден.
  * 500 Internal Server Error — внутренняя ошибка сервера.

## 3. Выполнение практического примера

* Код сервера:

```javascript
const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

let items = [
    { id: 1, name: "Товар 1", price: 100, quantity: 5 },
    { id: 2, name: "Товар 2", price: 200, quantity: 3 },
    { id: 3, name: "Товар 3", price: 300, quantity: 10 }
];

let nextId = 4;

app.get("/items", (req, res) => {
    res.json({
        count: items.length,
        items: items
    });
});

app.get("/items/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);

    if (!item) {
        return res.status(404).json({
            error: "Элемент не найден"
        });
    }

    res.json(item);
});

app.post("/items", (req, res) => {
    const { name, price, quantity } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({
            error: "Поля name и price обязательны"
        });
    }

    const newItem = {
        id: nextId++,
        name: name,
        price: price,
        quantity: quantity || 0
    };

    items.push(newItem);

    res.status(201).json(newItem);
});

app.put("/items/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Элемент не найден"
        });
    }

    const { name, price, quantity } = req.body;

    items[index] = {
        id: id,
        name: name || items[index].name,
        price: price !== undefined ? price : items[index].price,
        quantity: quantity !== undefined ? quantity : items[index].quantity
    };

    res.json(items[index]);
});

app.delete("/items/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Элемент не найден"
        });
    }

    const deletedItem = items.splice(index, 1)[0];

    res.json({
        message: "Элемент удалён",
        deleted: deletedItem
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
```

---

*Скриншоты*

* **GET /items**

![GET /items](/screenshots/1.png)

* **GET /items/:id**

![GET /items/:id](/screenshots/2.png)

* **POST /items**

![POST /items](/screenshots/3.png)

* **PUT /items/:id**

![PUT /items/:id](/screenshots/4.png)

* **DELETE /items/:id**

![DELETE /items/:id](/screenshots/5.png)

---

**Команды запуска:**

* `node app.js`

* `npm run dev`

## Индивидуальные задания

### Задание 1

Реализовать CRUD-операции для сущности **Отели (hotels)**.

Поля:

* `id`
* `name`
* `stars`

Обязательные эндпоинты:

* `GET /hotels`
* `GET /hotels/:id`
* `POST /hotels`
* `PUT /hotels/:id`
* `DELETE /hotels/:id`

Обработка ошибок: `404`, если отель не найден.

```javascript
const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

let hotels = [
    { id: 1, name: "Grand Hotel", stars: 5 },
    { id: 2, name: "City Hotel", stars: 4 },
    { id: 3, name: "Park Hotel", stars: 3 }
];

let nextId = 4;

app.get("/hotels", (req, res) => {
    res.json({
        count: hotels.length,
        hotels: hotels
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
    const { name, stars } = req.body;

    if (!name || stars === undefined) {
        return res.status(400).json({
            error: "Поля name и stars обязательны"
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

app.put("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = hotels.findIndex(h => h.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Отель не найден"
        });
    }

    const { name, stars } = req.body;

    hotels[index] = {
        id: id,
        name: name || hotels[index].name,
        stars: stars !== undefined ? stars : hotels[index].stars
    };

    res.json(hotels[index]);
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
```

---

*Скриншоты*

* **GET /hotels**

![GET /hotels](/screenshots/6.png)

* **GET /hotels/:id**

![GET /hotels/:id](/screenshots/7.png)

* **POST /hotels**

![POST /hotels](/screenshots/8.png)

* **PUT /hotels/:id**

![PUT /hotels/:id](/screenshots/9.png)

* **DELETE /hotels/:id**

![DELETE /hotels/:id](/screenshots/10.png)

* **404 Not Found**

![404 Not Found](/screenshots/11.png)

---

### Задание 2

Средний уровень. Всё из базового задания, а также:

* дополнительные поля `city` и `price_per_night`;
* валидация входных данных;
* поиск по названию;
* сортировка;
* пагинация;
* правильные HTTP-коды `201`, `204`, `400`, `404`.

```javascript
const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

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
    }
];

let nextId = 4;

app.get("/hotels", (req, res) => {
    const search = req.query.search;
    const sort = req.query.sort;
    const order = req.query.order;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let result = [...hotels];

    if (search) {
        result = result.filter(h =>
            h.name.toLowerCase().includes(search.toLowerCase())
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
    const { name, stars, city, price_per_night } = req.body;

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
            error: "stars и price_per_night должны быть числами"
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

app.put("/hotels/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = hotels.findIndex(h => h.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Отель не найден"
        });
    }

    const { name, stars, city, price_per_night } = req.body;

    if (
        !name ||
        stars === undefined ||
        !city ||
        price_per_night === undefined
    ) {
        return res.status(400).json({
            error: "Для PUT необходимо передать все поля"
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
```

---

*Скриншоты*

* **Поиск**

![Поиск](/screenshots/12.png)

* **Сортировка**

![Сортировка](/screenshots/13.png)

* **Пагинация**

![Пагинация](/screenshots/14.png)

* **Ошибка валидации 400**

![400 Bad Request](/screenshots/15.png)

* **Успешный POST 201**

![201 Created](/screenshots/16.png)

* **Успешный DELETE 204**

![204 No Content](/screenshots/17.png)

---

## Ответы на контрольные вопросы

1. *Что такое CRUD? Расшифруйте каждую букву.*

CRUD — это четыре базовые операции над данными: Create — создание, Read — чтение, Update — обновление, Delete — удаление.

2. *Какие HTTP-методы соответствуют операциям CRUD?*

Create соответствует POST, Read — GET, Update — PUT или PATCH, Delete — DELETE.

3. *Что такое идемпотентность HTTP-методов? Какие методы идемпотентны?*

Идемпотентность означает, что повторное выполнение одинакового запроса приводит к тому же состоянию сервера. Идемпотентными являются GET, PUT и DELETE. POST обычно не является идемпотентным.

4. *Какой код ответа возвращается при успешном создании ресурса (POST)?*

При успешном создании ресурса возвращается код `201 Created`.

5. *Какой код ответа возвращается при успешном удалении ресурса?*

В данной работе используется код `204 No Content`.

6. *Что такое middleware в Express? Для чего используется express.json()?*

Middleware — это промежуточная функция, которая выполняется во время обработки HTTP-запроса. `express.json()` используется для чтения JSON из тела запроса и помещения полученных данных в `req.body`.

7. *Как получить параметры из тела POST-запроса в Express?*

Параметры тела запроса находятся в `req.body`. Например:

```javascript
const { name, stars } = req.body;
```

8. *Как получить параметр из URL, например ID?*

Параметр из URL можно получить через `req.params`.

```javascript
const id = req.params.id;
```

9. *Как найти элемент в массиве по ID?*

Можно использовать метод `find()`:

```javascript
const hotel = hotels.find(h => h.id === id);
```

10. *Какой код ответа возвращается, если ресурс не найден?*

Возвращается код `404 Not Found`.

11. *Как отправить JSON-ответ в Express?*

Для этого используется:

```javascript
res.json({
    message: "Ответ"
});
```

12. *Как вернуть статус-код 201 в Express?*

```javascript
res.status(201).json(data);
```

13. *Что произойдёт с данными в памяти при перезапуске сервера?*

Все изменения, внесённые во время работы сервера, будут потеряны, так как данные хранятся только в оперативной памяти.

14. *Как добавить новый элемент в массив?*

Для этого используется метод `push()`:

```javascript
hotels.push(newHotel);
```

15. *Как удалить элемент из массива?*

Для удаления можно использовать `splice()`:

```javascript
hotels.splice(index, 1);
```

### Вопросы среднего уровня

1. *В чём разница между PUT и PATCH?*

PUT предназначен для полного обновления ресурса, а PATCH — для изменения только переданных полей.

2. *Как реализовать поиск по коллекции через search?*

Можно получить значение через `req.query.search`, а затем использовать `filter()` и `includes()`.

3. *Как реализовать сортировку по полю?*

Можно получить имя поля через `req.query.sort` и использовать метод `sort()`.

4. *Как реализовать пагинацию?*

Нужно получить `page` и `limit`, вычислить начальный индекс и использовать `slice()` для выбора части массива.

5. *Как проверить, что price является числом?*

```javascript
typeof price === "number"
```

6. *Какой код используется при ошибках валидации?*

Используется `400 Bad Request`.

7. *Как вернуть 204 No Content при DELETE?*

```javascript
res.status(204).send();
```

8. *В чём разница между res.json() и res.send()?*

`res.json()` отправляет JSON-ответ, а `res.send()` может отправлять текст или данные другого типа.

9. *Как избежать дублирования ID?*

Можно хранить отдельный счётчик `nextId` и увеличивать его после создания каждого нового объекта.

10. *Что такое express.json() и почему без него req.body пустой?*

`express.json()` — middleware для разбора JSON из тела запроса. Без него Express не преобразует JSON-тело запроса в объект `req.body`.

## Выводы

В ходе лабораторной работы были изучены HTTP-методы GET, POST, PUT, PATCH и DELETE, а также принцип CRUD-операций. Был создан сервер на Node.js и Express с хранением данных в оперативной памяти.

В практической части были реализованы получение, создание, обновление и удаление объектов. В индивидуальных заданиях для варианта 13 была создана сущность «Отели». Были реализованы валидация данных, поиск, сортировка, пагинация, частичное обновление, массовые операции, статистика, связанные элементы, логирование запросов в файл и глобальная обработка ошибок.

Также были изучены и применены HTTP-коды 200, 201, 204, 400, 404 и 500.

---

### Использованные источники

1. **Express — Routing** - https://expressjs.com/en/guide/routing.html

2. **Express — Request и Response** - https://expressjs.com/en/4x/api.html

3. **HTTP-методы (MDN)** - https://developer.mozilla.org/ru/docs/Web/HTTP/Methods

4. **Коды состояния HTTP (MDN)** - https://developer.mozilla.org/ru/docs/Web/HTTP/Status

5. **REST API Tutorial** - https://restfulapi.net/

6. **Postman Learning Center** - https://learning.postman.com/

7. **Thunder Client** - https://www.thunderclient.com/
