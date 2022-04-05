const boardSize = 4;
const boardGap = 2;
const tileSize = 20;

import { Cell } from "./cell";

export class Grid {
  private _gridCells: Cell[];

  constructor(gameboardElement: HTMLDivElement) {
    gameboardElement.style.setProperty("--gameboard-size", `${boardSize}`);
    gameboardElement.style.setProperty("--gameboard-gap", `${boardGap}vmin`);
    gameboardElement.style.setProperty("--gameboard-tile-size", `${tileSize}vmin`);

    const cells = this.createCellElements(gameboardElement);
    this._gridCells = cells.map((cell, index) => {
      const xPos = index % boardSize;
      const yPos = Math.floor(index / boardSize);
      return new Cell(cell, xPos, yPos);
    });
  }

  get cells(): Cell[] {
    return this._gridCells;
  }

  /**
   * Arranges the cells of the grid in column order.
   * All cells with x=0 end up in columnCells[0]
   */
  get cellsByColumn() {
    return this._gridCells.reduce((columnCells: Cell[][], cell: Cell): Cell[][] => {
      columnCells[cell.x] = columnCells[cell.x] || [];
      columnCells[cell.x][cell.y] = cell;
      return columnCells;
    }, []);
  }

  get cellsByRow() {
    return this._gridCells.reduce((rowCells: Cell[][], cell: Cell): Cell[][] => {
      rowCells[cell.y] = rowCells[cell.y] || [];
      rowCells[cell.y][cell.x] = cell;
      return rowCells;
    }, []);
  }

  private get emptyCells() {
    return this._gridCells.filter(cell => cell.tile === null);
  }

  createCellElements(parent: HTMLElement): HTMLElement[] {
    const cells: HTMLElement[] = [];

    for (let i = 0; i < (boardSize * boardSize); ++i) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      cells.push(cell);
      parent.appendChild(cell);
    }

    return cells;
  }

  randomEmptyCell(): Cell {
    const randomIndex = Math.floor(Math.random() * this.emptyCells.length);
    return this.emptyCells[randomIndex];
  }
}

export default { Grid };