let rows = +prompt("rows:", "10");
let columns = +prompt("columns:", "10");
let bombs = +prompt("bombs:", "10");
let isMapGenerated = false;

let map = [];
for (let row = 0; row < rows; row++) {
    map.push([]);
    for (let column = 0; column < columns; column++)
        map[row].push({ number: 0, isClicked: false });
}

for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
        let button = create("button", document.getElementsByTagName("div")[0], "", { width: `${1000 / columns}px`, height: `${700 / rows}px` })
        button.id = row * columns + column;
        button.onclick = function(e) {
            if (!isMapGenerated) {
                isMapGenerated = true;
                putBombs(bombs, row * columns + column);
            }
            button.innerHTML = map[row][column].number;
            if (map[row][column].number == "0" && !map[row][column].isClicked) {
                expand(row, column);
            }
            map[row][column].isClicked = true;
            checkForEnd(row, column);
        }
    }
}

function create(tag, parent, innerHTML, styles) {
    let element = document.createElement(tag);
    parent.append(element);
    element.innerHTML = innerHTML;
    for (let key in styles)
        eval(`element.style.${key} = styles[key]`);
    return element;
}

function putBombs(bombs, cell) {
    let array = [cell];
    while (bombs > 0) {
        let randomNum = Math.round(Math.random() * (columns * rows - 1));
        if (!array.includes(randomNum)) {
            array.push(randomNum);
            bombs--;
        }
    }
    for (let index = 1; index < array.length; index++)
        map[Math.floor(array[index] / columns)][array[index] % columns].number = 'b';
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (map[row][column].number != 'b')
                map[row][column].number = bombsAround(row, column);
        }
    }
}

function bombsAround(row, column) {
    let b = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (row + i < rows && row + i >= 0 && column + j < columns && column + j >= 0) {
                if (map[row + i][column + j].number == 'b')
                    b++;
            }
        }
    }
    return b;
}

function expand(row, column) {
    let button = document.getElementById(row * columns + column);
    map[row][column].isClicked = true;
    button.innerHTML = map[row][column].number;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (row + i < rows && row + i >= 0 && column + j < columns && column + j >= 0) {
                if (map[row + i][column + j].number == '0' && !map[row + i][column + j].isClicked)
                    expand(row + i, column + j);
                else if (map[row + i][column + j].number != "0" && map[row + i][column + j].number != "b")
                    document.getElementById((row + i) * columns + column + j).innerHTML = map[row + i][column + j].number;
            }
        }
    }
}

function checkForEnd(row, column) {
    let notClicked = 0;
    [...document.getElementsByTagName("button")].forEach(element => {
        if (element.innerHTML == "")
            notClicked++;
    })
    if (bombs == notClicked)
        document.getElementById("text").innerText = "You Won";
    else if (map[row][column].number == "b")
        document.getElementById("text").innerText = "You Lost";
    else
        return;
    [...document.getElementsByTagName("button")].forEach(element => element.disabled = true);
}