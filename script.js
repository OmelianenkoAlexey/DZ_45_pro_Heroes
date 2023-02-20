// ! ДЗ 47. Heroes 🦸🏼‍♂️ 🦸🏻‍♀️

// Вывести список персонажей в виде таблицы.

// Таблицы создаете сами на сайте

// https://mockapi.io/projects

// Пример объекта ресурса heroes(то есть path должен быть heroes):

// {
//     "name": "Iron Man",
//         "comics": "Marvel",
//             "favourite": true,
//                 "id": "1"
// }


// Пример объекта ресурса universes:

// {
//     "id": "1",
//         "name": "Marvel"
// }

// ! Таблица состоит из 4-х колонок:

// Name Surname
// Comics (DC, Marvel, Comix Zone)
// Favourite (чекбокс)
// Actions (одна кнопка Delete)

// ! Над таблицей форма добавления с тремя полями:

// Name Surname (input)
// Comics (DC, Marvel, Comix Zone) (select) – данные запрашиваем методом GET с ресурса universes

// Favourite (true, false) (checkbox).

// ! Действия:

// При сабмите формы происходит добавление персонажа в базу (POST)
// и вывод в html строки с информацией о герое в таблицу.
// Если в базе уже существует герой с таким же свойством name,
// то объект не добавляется в базу (можно просто в консоль вывести инфу,
// что юзер с таким именем уже есть в базе).
// При изменении состояния checkbox в колонке Favourite происходит изменение данных по этому персонажу в базе (PUT).
// При нажатии на кнопку Delete в строке персонажа происходит удалениес базы
// соответствующего героя (DELETE) и удаление соответствующей tr с таблицы.

// Базовая верстка в прикрепленном архиве heroes.zip.

const API = "https://63f0c7635b7cf4107e26a8c8.mockapi.io";

// ! Универсальный запрос
async function controller(method, action, body) {
    const URL = `${API}/${action}`;
    const params = {
        method,
        headers: {
            "Content-Type": "application/json"
        },
    };
    if (body) params.body = JSON.stringify(body);

    const response = await fetch(URL, params);
    const data = await response.json();
    return data;
}

const form = document.getElementById("heroesForm");
// ! Событие на форму
form.addEventListener("submit", async e => {
    e.preventDefault();
    const newUser = await createUser();
});

// ! Запрос на comics из сервера
function getCosmics() {
    controller("GET", "universes")
        .then(data => {
            data.forEach(item => {
                const comics = document.getElementById("comics");
                const optionCosmics = document.createElement("option");
                optionCosmics.value = `${item.name}`;
                optionCosmics.innerText = `${item.name}`;
                comics.append(optionCosmics);
            })
        });
}
getCosmics();

// ! Создание юзера
async function createUser() {
    const fullName = document.getElementById("name").value;
    const comics = document.getElementById("comics").value;
    const inputFavourite = document.getElementById("inputFavourite").checked;

    // ! Запрос с сервера на проверку совпадения имени юзера
    const dataServ = await controller("GET", "heroes");

    let onOff = true;
    dataServ.forEach(async item => {

        if (fullName === item.name) {
            console.log("Пользователь с таким именем уже существует");
            alert("Пользователь с таким именем уже существует");
            onOff = false;
        }
    })

    if (onOff) {
        const body = {
            name: fullName,
            comics,
            favorite: inputFavourite,
        }

        const response = await controller("POST", "heroes", body);
        await responseUserServ();
    }
};

const tbody = document.getElementById("tbody");
// ! Запрос users из сервера
async function responseUserServ() {
    tbody.innerHTML = "";
    controller("GET", "heroes")
        .then(data => {
            data.forEach(async item => {
                await renderUser(item)
            })
        });
}
responseUserServ();

// ! Рендер юзера
async function renderUser(item) {

    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.innerText = `${item.name}`;

    const tdComics = document.createElement("td");
    tdComics.innerText = `${item.comics}`;

    const tdFavorite = document.createElement("td");

    const labelFavorite = document.createElement("label");
    labelFavorite.classList.add("heroFavouriteInput");
    labelFavorite.innerText = "Favourite:";

    const inputFavorite = document.createElement("input");
    inputFavorite.setAttribute("type", "checkbox");

    // ! добавление checked переводит checkbox в true
    if (item.favorite === true) inputFavorite.setAttribute("checked", "");




    // inputFavorite.checkbox = `${item.favorite}`;

    inputFavorite.addEventListener("click", async () => {
        // ! Запрос на изменение состояния Favourite
        const body = { ...item, favorite: inputFavorite.checked };
        const response = await controller("PUT", `heroes/${item.id}`, body);
    })

    const tdButton = document.createElement("td");
    const button = document.createElement("button");
    button.innerText = "Delete:";

    tr.append(tdName);
    tr.append(tdComics);

    labelFavorite.append(inputFavorite);
    tdFavorite.append(labelFavorite);
    tr.append(tdFavorite);

    tdButton.append(button);
    tr.append(tdButton);

    tbody.append(tr);

    // ! Удаление юзера
    button.addEventListener("click", async () => {
        const response = await controller("DELETE", `heroes/${item.id}`);
        responseUserServ();
    })
}





// !!!!!!!!!!!!!!!!
// ! Добавление в universes
// const infoCosmics = [
//     {
//         "name": "Marvel",
//     },
//     {
//         "name": "DC",
//     },
//     {
//         "name": "Comix Zone",
//     },
// ];

// function postComics(cosmic) {
//     const body = cosmic[2];
//     const data = controller("POST", "universes", body)
// }
// postComics(infoCosmics);

