function startGame() {
  document.getElementById("game").style.display = "flex";
  document.getElementById("black").remove();
}

const tiles = [
  "                  ",
  "            t r   ",
  "            t t   ",
  "          r t t   ",
  "      r   t t t   ",
  "      t rtttt t   ",
  "      t   t t t   ",
  " tttttttr t t t   ",
  "      t   t t t   ",
  "      ttttttttttr ",
  "      t     t     ",
  "      t     r     ",
  "                  ",
];

const discovered = [];

const map = document.getElementById("map");
for (let i = 0; i < tiles.length; i++) {
  map.appendChild(document.createElement("tr"));
  discovered.push([]);

  for (let j = 0; j < tiles[0].length; j++) {
    const td = document.createElement("td");

    if (tiles[i][j] === "t") {
      td.style.borderTopStyle = tiles[i - 1][j] === "t" ? "none" : "solid";
      td.style.borderRightStyle = tiles[i][j + 1] === "t" ? "none" : "solid";
      td.style.borderBottomStyle = tiles[i + 1][j] === "t" ? "none" : "solid";
      td.style.borderLeftStyle = tiles[i][j - 1] === "t" ? "none" : "solid";
      td.style.borderWidth = "1px";
      td.style.borderColor = "black";
    }

    map.children[i].appendChild(td);
    discovered[i].push(0);
  }
}

function getTile(row, col) {
  return document.getElementById("map").children[row].children[col];
}

const pos = {
  row: 0,
  col: 0,
};

function move(dr, dc) {
  if (tiles[pos.row + dr][pos.col + dc] !== "t") return;

  getTile(pos.row, pos.col).textContent = "";

  pos.row += dr;
  pos.col += dc;

  getTile(pos.row, pos.col).textContent = "@";

  if (discovered[pos.row][pos.col] < 2) {
    discovered[pos.row][pos.col] = 2;
    getTile(pos.row, pos.col).style.borderColor = "gray";
  }

  for (const dir of [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]) {
    const i = pos.row + dir[0];
    const j = pos.col + dir[1];
    if (discovered[i][j] === 0) {
      discovered[i][j] = 1;
      if (tiles[i][j] === "t") getTile(i, j).style.borderColor = "#202020";
      if (tiles[i][j] === "r") getTile(i, j).style.outline = "2px solid white";
    }
  }
}

move(1, 12);

addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") move(-1, 0);
  if (e.key === "ArrowDown") move(1, 0);
  if (e.key === "ArrowLeft") move(0, -1);
  if (e.key === "ArrowRight") move(0, 1);
});
