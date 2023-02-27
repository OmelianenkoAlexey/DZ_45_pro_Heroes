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
};

// ! IMAGE BASE 64
const getBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => resolve("");
    });
};

const form = document.getElementById("heroesForm");
// ! Событие на форму
form.addEventListener("submit", e => {
    e.preventDefault();
    const newUser = createUser();
});

// ! Запрос на comics из сервера
async function getCosmics() {
    const response = await controller("GET", "universes");
    response.forEach(item => {
        const comics = document.getElementById("comics");
        const optionCosmics = document.createElement("option");
        optionCosmics.value = `${item.name}`;
        optionCosmics.innerText = `${item.name}`;
        comics.append(optionCosmics);
    })
}
getCosmics();

// ! Создание юзера
async function createUser() {
    const fullName = document.getElementById("name").value;
    const comics = document.getElementById("comics").value;
    const inputFavourite = document.getElementById("inputFavourite").checked;

    // ! НЕ нужно ставить value
    const image = document.getElementById("avatar");
    console.log(image);
    console.dir(image);

    const avatar = await getBase64(image.files[0]);
    console.log(avatar);

    // ! Запрос с сервера на проверку совпадения имени юзера
    const dataServ = await controller("GET", "heroes");

    // ! способ 2
    if (dataServ.find(item => fullName === item.name)) {
        console.log("Пользователь с таким именем уже существует");
        alert("Пользователь с таким именем уже существует");
    } else {
        const body = {
            name: fullName,
            comics,
            avatar,
            favorite: inputFavourite,
        }

        const response = await controller("POST", "heroes", body);
        await renderUser(response);
        console.log(response);
    }
};

const tbody = document.getElementById("tbody");
// ! Запрос users из сервера
async function responseUserServ() {
    const response = await controller("GET", "heroes");
    response.forEach(async item => {
        await renderUser(item)
    })
}
responseUserServ();

// ! Рендер юзера
async function renderUser(item) {

    const tr = document.createElement("tr");

    tr.id = `${item.id}`;

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

    inputFavorite.addEventListener("click", async () => {
        // ! Запрос на изменение состояния Favourite
        const body = { ...item, favorite: inputFavorite.checked };
        const response = await controller("PUT", `heroes/${item.id}`, body);
    })

    const tdButton = document.createElement("td");
    const button = document.createElement("button");
    button.innerText = "Delete:";

    const avatarImage = document.createElement("img");
    avatarImage.setAttribute("src", `${item.avatar}`);



    tr.append(tdName);
    tr.append(tdComics);

    labelFavorite.append(inputFavorite);
    tdFavorite.append(labelFavorite);
    tr.append(tdFavorite);

    tdButton.append(button);
    tr.append(tdButton);

    tr.append(avatarImage);

    tbody.prepend(tr);

    // ! Удаление юзера
    button.addEventListener("click", async () => {
        const response = await controller("DELETE", `heroes/${item.id}`);
        const element = document.getElementById(`${item.id}`)
        element.remove();
    })
}

const input = document.getElementById("input");
const cont = document.getElementById("cont");
const coment = document.getElementById("coment");
cont.append(coment);

// !событие на изменение (input или change)
input.addEventListener("input", e => {
    console.log(e.target.value);

    e.target.value === '' ? coment.innerText = "Введите что нибудь." : coment.innerText = '';
})





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

