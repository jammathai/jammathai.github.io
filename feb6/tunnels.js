const doors = [
  "familiar",
  "simple",
  "ancient",
  "white",
  "SOPHIA",
  "fuzzy",
  "open",
];

const colors = ["red", "orange", "yellow", "green", "dodgerblue", "violet"];

const neighborhood = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

let discoveredRooms = 0;
let blockMovement = 0;
let roomShown = false;

const tiles = [];
for (let i = 0; i < words.numRows + words.padTop + words.padBottom; i++) {
  tiles.push([]);
  for (let j = 0; j < words.numCols + words.padLeft + words.padRight; j++) {
    tiles[i].push({ symbol: " ", discovered: 0, msg: "", door: null });
  }
}

function getPos(word, offset) {
  if (word.dir === "down")
    return [words.padTop + word.row + offset, words.padLeft + word.col];
  return [words.padTop + word.row, words.padLeft + word.col + offset];
}

for (const word of words.list) {
  for (let offset = 0; offset < word.letters.length; offset++) {
    const [i, j] = getPos(word, offset);
    tiles[i][j].symbol = "t";
    tiles[i][j].msg = word.acrostic ? word.acrostic[offset] : "";
  }

  let [i, j] = getPos(word, word.room === "start" ? -1 : word.letters.length);
  tiles[i][j].symbol = "r";

  [i, j] = getPos(word, word.room === "start" ? 0 : word.letters.length - 1);
  tiles[i][j].door = undefined;
}

for (let i = 0; i < tiles.length; i++) {
  map.appendChild(document.createElement("tr"));

  for (let j = 0; j < tiles[0].length; j++) {
    const td = document.createElement("td");

    if (tiles[i][j].symbol === "t") {
      td.style.borderTopStyle =
        tiles[i - 1][j].symbol === "t" ? "none" : "solid";
      td.style.borderRightStyle =
        tiles[i][j + 1].symbol === "t" ? "none" : "solid";
      td.style.borderBottomStyle =
        tiles[i + 1][j].symbol === "t" ? "none" : "solid";
      td.style.borderLeftStyle =
        tiles[i][j - 1].symbol === "t" ? "none" : "solid";
      td.style.borderColor = "black";
    }

    map.children[i].appendChild(td);
  }
}

function getTile(row, col) {
  return map.children[row].children[col];
}

const pos = {
  row: 0,
  col: 0,
};

function queueMsg(msg, color, style, anim, charTime, animTime) {
  text.innerHTML = "";
  text.style.color = color;
  text.style.fontStyle = style;

  for (const [index, char] of [...msg].entries()) {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.opacity = "0%";
    text.appendChild(span);

    for (const [pos, opacity] of anim.entries()) {
      setTimeout(
        () => {
          span.style.opacity = opacity + "%";
        },
        index * charTime + pos * animTime,
      );
    }
  }

  return msg.length * charTime + anim.length * animTime;
}

function showRoom() {
  if (tiles[pos.row][pos.col].door === null) return;

  for (const dir of neighborhood) {
    const i = pos.row + dir[0];
    const j = pos.col + dir[1];

    if (tiles[i][j].symbol === "r")
      getTile(i, j).style.outline =
        "2px solid " + colors[tiles[pos.row][pos.col].door];
  }

  blockMovement++;
  modal.style.display = "block";
  modal.children[tiles[pos.row][pos.col].door].style.display = "block";
  roomShown = true;
}

function hideRoom() {
  if (!roomShown) return;
  blockMovement--;
  modal.style.display = "none";
  modal.children[tiles[pos.row][pos.col].door].style.display = "none";
  roomShown = false;
}

function move(dr, dc) {
  if (blockMovement) return;

  if (tiles[pos.row + dr][pos.col + dc].symbol !== "t") return;

  enter.style.opacity = "0%";

  getTile(pos.row, pos.col).textContent = "";

  pos.row += dr;
  pos.col += dc;

  getTile(pos.row, pos.col).textContent = "☺";

  if (tiles[pos.row][pos.col].discovered < 2) {
    tiles[pos.row][pos.col].discovered = 2;
    getTile(pos.row, pos.col).style.borderColor = "gray";
  }

  for (const dir of neighborhood) {
    const i = pos.row + dir[0];
    const j = pos.col + dir[1];
    if (tiles[i][j].discovered === 0) {
      tiles[i][j].discovered = 1;
      if (tiles[i][j].symbol === "t")
        getTile(i, j).style.borderColor = "#202020";
    }
  }

  const nextStartTime =
    queueMsg(
      tiles[pos.row][pos.col].msg,
      "gray",
      "italic",
      [12.5, 25, 50, 100, 100, 100, 100, 100, 100, 100, 100, 50, 25, 12.5, 0],
      75,
      75,
    ) + 100;

  if (tiles[pos.row][pos.col].door !== null) {
    blockMovement++;

    if (tiles[pos.row][pos.col].door === undefined)
      tiles[pos.row][pos.col].door = discoveredRooms++;

    setTimeout(() => {
      const endTime =
        queueMsg(
          "The door is " + doors[tiles[pos.row][pos.col].door],
          "white",
          "normal",
          [
            2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35,
            40, 45, 50, 55, 65, 75, 100,
          ],
          0,
          100,
        ) - 100;

      setTimeout(() => {
        enter.style.opacity = "100%";
        blockMovement--;
      }, endTime);
    }, nextStartTime);
  }
}

move(1, 13);

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      move(-1, 0);
      break;
    case "ArrowDown":
      move(1, 0);
      break;
    case "ArrowLeft":
      move(0, -1);
      break;
    case "ArrowRight":
      move(0, 1);
      break;
    case "e":
      showRoom();
      break;
    case "Escape":
      hideRoom();
      break;
  }
});
