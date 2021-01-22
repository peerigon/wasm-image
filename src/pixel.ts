import { Position } from "./position";

export class Pixel implements Position {
  constructor(public readonly x: number, public readonly y: number) {}
}
