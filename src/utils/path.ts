// utils/path.ts
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);

const __curdir = dirname(__filename);
const __srcdir = path.join(__curdir, '../');
const __rootdir = path.join(__srcdir, '../');
const __envpath = path.join(__rootdir, './.env');
const __publicpath = path.join(__rootdir, './public/');
const __imagespath = path.join(__rootdir, './public/images/');
const __imagesbackuppath = path.join(__rootdir, './backup/images/');
const __viewspath = path.join(__srcdir, './views/');

export { __srcdir, __rootdir, __envpath, __imagespath, __imagesbackuppath, __viewspath, __publicpath };
