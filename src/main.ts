import { Grid } from "./grid";
import { Cell } from "./cell";
import { Tile } from "./tile";

enum MoveDirection {
  up,
  down,
  left,
  right,
}

let gameBoard: HTMLDivElement;
let scoreBox: HTMLSpanElement;
let goModal: HTMLDialogElement;
let goModalScore: HTMLElement;
let goModalCloseButton: HTMLElement;
let goModalPlayButton: HTMLElement;
let grid: Grid;

let score: number;

const MoveDirectionKeyMap = new Map<string, MoveDirection>([
  ["ArrowUp", MoveDirection.up],
  ["ArrowDown", MoveDirection.down],
  ["ArrowLeft", MoveDirection.left],
  ["ArrowRight", MoveDirection.right],
]);

const MoveDirectionCells = [
  () => {
    return grid.cellsByColumn;
  },
  () => {
    return grid.cellsByColumn.map((column) => column.reverse());
  },
  () => {
    return grid.cellsByRow;
  },
  () => {
    return grid.cellsByRow.map((row) => row.reverse());
  },
];

const findUIElements = () => {
  gameBoard = document.getElementById("gameboard") as HTMLDivElement;
  scoreBox = document.getElementById("score") as HTMLSpanElement;
  goModal = document.getElementById("gameover-modal") as HTMLDialogElement;
  goModalScore = document.getElementById("modalScore") as HTMLElement;
  goModalCloseButton = document.getElementById("closeButton") as HTMLElement;
  goModalPlayButton = document.getElementById("playButton") as HTMLElement;

  goModalCloseButton.addEventListener("click", () => {
    if (goModal.open) {
      goModal.close();
    }
  });

  goModalPlayButton.addEventListener("click", () => {
    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.lastChild as Node);
    }

    setup();

    if (goModal.open) {
      goModal.close();
    }
  });
};

const setup = () => {
  score = 0;
  scoreBox.textContent = `${score}`;
  goModalScore.textContent = `${score}`;

  grid = new Grid(gameBoard);

  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);

  setupInput();
};

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(event: KeyboardEvent) {
  if (event.key.toLowerCase() === "p" && !goModal.attributes.getNamedItem("open")) {
    goModal.showModal();
  }

  if (event.key.toLowerCase() === "escape" && goModal.attributes.getNamedItem("open")) {
    console.log("modal is open, closing it");
    goModal.close();
  }

  if (!MoveDirectionKeyMap.has(event.key)) {
    setupInput();
    return;
  }

  const direction = MoveDirectionKeyMap.get(event.key) as MoveDirection;
  const cellsToMove = MoveDirectionCells[direction]();

  if (!canMove(cellsToMove)) {
    setupInput();
    return;
  }

  await slideTiles(cellsToMove);
  // Merge any tiles that can be merged
  grid.cells.forEach((cell) => {
    const points = cell.mergeTiles();
    score = score + points;
  });

  scoreBox.textContent = `${score ?? 0}`;
  goModalScore.textContent = `${score ?? 0}`;

  // Add a new cell to the board at a random position
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  // If no moves are left after creating the new tile, game over
  if (!MoveDirectionCells.some((cells) => canMove(cells()))) {
    newTile.waitForTransition(true).then(() => {
      goModal.showModal();
    });
  }

  // After handling arrow keys, call setupInput again to listen for next keypress
  setupInput();
}

function slideTiles(cells: Cell[][]): Promise<void[]> {
  return Promise.all(
    cells.flatMap((group) => {
      const promises: Promise<void>[] = [];
      for (let i = 1; i < group.length; ++i) {
        const cell = group[i];
        if (cell.tile === null) {
          continue;
        }

        let lastValidCell: Cell | null = null;

        for (let j = i - 1; j >= 0; --j) {
          const movingTo = group[j];
          if (!movingTo.canAccept(cell.tile)) {
            // Can't move any further, stop looking
            break;
          }
          lastValidCell = movingTo;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMove(cells: Cell[][]): boolean {
  const allowed = cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0 || cell.tile === null) {
        return false;
      }
      const movingTo = group[index - 1];
      return movingTo.canAccept(cell.tile);
    });
  });

  return allowed;
}

findUIElements();
setup();
