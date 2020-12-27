import * as fs from "fs/promises";
import {resolve} from "path";

const pathToImages = resolve(__dirname, "images");

export const ballPng = () => fs.readFile(resolve(pathToImages, "ball.png"));
export const basi2c08Png = () => fs.readFile(resolve(pathToImages, "basi2c08.png"));
export const catJpg = () => fs.readFile(resolve(pathToImages, "cat.jpg"));