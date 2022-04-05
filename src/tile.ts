export class Tile {
  private _element: HTMLDivElement;
  private _x: number = 0;
  private _y: number = 0;
  private _value: number = 0;

  constructor(container: HTMLElement, value: number = 0) {
    this._element = this.createTileElement(container);
    // Either set the value randomly, or use the given value
    this.value = value === 0 ? (Math.random() > 0.5 ? 2 : 4) : value;
    this._element.innerText = `${this._value}`;
  }

  get x() {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
    this._element.style.setProperty("--x", `${value}`);
  }

  get y() {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
    this._element.style.setProperty("--y", `${value}`);
  }

  get value(): number {
    return this._value;
  }

  set value(theValue: number) {
    this._value = theValue;
    this._element.innerText = `${theValue}`;

    const power = Math.log2(theValue);
    // Every power of two reduces the lightness by 9%;
    const tileLightness = 100 - power * 9;
    this._element.style.setProperty("--bg-lightness", `${tileLightness}%`);
    const textLightness = tileLightness < 50 ? 90 : 10;
    this._element.style.setProperty("--text-lightness", `${textLightness}%`);
  }

  private createTileElement(parent: HTMLElement): HTMLDivElement {
    const element = document.createElement("div");
    element.classList.add("tile");

    parent.appendChild(element);
    return element;
  }

  public remove(): void {
    this._element?.remove();
  }

  public waitForTransition(isAnimation = false): Promise<void> {
    const eventName = isAnimation ? "animationend" : "transitionend";
    return new Promise<void>(resolve => {
      this._element.addEventListener(eventName, (_) => {
        resolve();
      }, { once: true });
    })
  }
}

export default { Tile };
