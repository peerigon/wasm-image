import * as fs from "fs/promises";
import {resolve} from "path";

const pathToImages = resolve(__dirname, "images");

export const readBallPng = () => fs.readFile(resolve(pathToImages, "ball.png"));
export const readBasi2c08Png = () => fs.readFile(resolve(pathToImages, "basi2c08.png"));
export const readCatJpg = () => fs.readFile(resolve(pathToImages, "cat.jpg"));