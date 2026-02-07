const crossword = {
  numRows: 11,
  numCols: 15,
  words: [
    { dir: "down", letters: "HAMMERHEAD", row: 0, col: 11 },
    { dir: "down", letters: "LOQUAT", row: 3, col: 9 },
    { dir: "across", letters: "TIMETRAVEL", row: 8, col: 5 },
    { dir: "across", letters: "LOVE", row: 4, col: 8 },
    { dir: "down", letters: "QUARTER", row: 4, col: 5 },
    { dir: "down", letters: "ARMATURE", row: 1, col: 13 },
    { dir: "across", letters: "SEAFOAM", row: 6, col: 0 },
  ],
};

const selected = {
  wordNum: 1,
  offset: 0,
};

const table = document.getElementById("crossword");
for (let i = 0; i < crossword.numRows; i++) {
  table.appendChild(document.createElement("tr"));
  for (let j = 0; j < crossword.numCols; j++) {
    const label = document.createElement("span");
    label.className = "label";

    const letter = document.createElement("span");
    letter.className = "letter";

    const td = document.createElement("td");
    td.append(label, letter);
    table.children[i].appendChild(td);
  }
}

function getWord(wordNum) {
  return crossword.words[wordNum - 1];
}

function getCell(row, col) {
  return table.children[row].children[col];
}

function getCellByWord(wordNum, offset) {
  const word = getWord(wordNum);
  if (word.dir === "down") return getCell(word.row + offset, word.col);
  return getCell(word.row, word.col + offset);
}

function getLetter(wordNum, offset) {
  return getCellByWord(wordNum, offset).getElementsByClassName("letter")[0]
    .textContent;
}

function setLabel(row, col, num) {
  getCell(row, col).getElementsByClassName("label")[0].textContent = num;
}

function initCell(wordNum, offset) {
  const word = getWord(wordNum);

  const cell = getCellByWord(wordNum, offset);
  cell.className = "shown";

  if (word.dir === "down") cell.downWord = { wordNum, offset };
  else cell.acrossWord = { wordNum, offset };

  cell.onclick = () => {
    let selectedNum = wordNum;
    let selectedOffset = offset;

    if (cell.downWord && cell.acrossWord) {
      const selectedWord = getWord(selected.wordNum);

      if (
        getCellByWord(wordNum, offset) ===
        getCellByWord(selected.wordNum, selected.offset)
      ) {
        if (selectedWord.dir === "down") {
          selectedNum = cell.acrossWord.wordNum;
          selectedOffset = cell.acrossWord.offset;
        } else {
          selectedNum = cell.downWord.wordNum;
          selectedOffset = cell.downWord.offset;
        }
      } else if (selectedWord.dir === "down") {
        selectedNum = cell.downWord.wordNum;
        selectedOffset = cell.downWord.offset;
      } else {
        selectedNum = cell.acrossWord.wordNum;
        selectedOffset = cell.acrossWord.offset;
      }
    }

    setSelected(selectedNum, selectedOffset);
  };
}

function setSelected(wordNum, offset) {
  if (wordNum !== selected.word) {
    const word = getWord(wordNum);
    const selectedWord = getWord(selected.wordNum);

    for (let offset = 0; offset < selectedWord.letters.length; offset++)
      getCellByWord(selected.wordNum, offset).classList.remove("selected-word");

    for (let offset = 0; offset < word.letters.length; offset++)
      getCellByWord(wordNum, offset).classList.add("selected-word");
  }

  getCellByWord(selected.wordNum, selected.offset).classList.remove(
    "selected-letter",
  );
  getCellByWord(wordNum, offset).classList.add("selected-letter");

  selected.wordNum = wordNum;
  selected.offset = offset;
}

for (const [index, word] of crossword.words.entries()) {
  setLabel(word.row, word.col, index + 1);

  for (let offset = 0; offset < word.letters.length; offset++)
    initCell(index + 1, offset);
}

function fadeToBlack() {
  document.getElementById("black").style.display = "block";

  setTimeout(() => {
    document.getElementById("black").className = "shown";
  }, 1000);

  setTimeout(() => {
    document.getElementById("article").remove();
    document.getElementById("enter").style.color = "white";

    addEventListener("keydown", (e) => {
      if (e.key === "e") startGame();
    });
  }, 11000);
}

function check() {
  for (const [index, word] of crossword.words.entries()) {
    for (let offset = 0; offset < word.letters.length; offset++) {
      if (getLetter(index + 1, offset) !== word.letters[offset]) return;
    }
  }

  fadeToBlack();
}

function handleKeydown(e) {
  if (e.key === "Backspace") {
    getCellByWord(selected.wordNum, selected.offset).getElementsByClassName(
      "letter",
    )[0].textContent = "";

    if (selected.offset > 0) setSelected(selected.wordNum, selected.offset - 1);
  }

  if (e.key.length !== 1) return;

  getCellByWord(selected.wordNum, selected.offset).getElementsByClassName(
    "letter",
  )[0].textContent = e.key.toUpperCase();

  check();

  if (selected.offset < getWord(selected.wordNum).letters.length - 1)
    setSelected(selected.wordNum, selected.offset + 1);
}

function showCrossword() {
  document.getElementById("modal").style.display = "block";
  addEventListener("keydown", handleKeydown);
}

function hideCrossword() {
  document.getElementById("modal").style.display = "none";
  removeEventListener("keydown", handleKeydown);
}

for (const elem of document.getElementsByTagName("sup")) {
  elem.onclick = () => {
    showCrossword();
    setSelected(parseInt(elem.textContent.slice(1, -1)), 0);
  };
}

addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideCrossword();
});
