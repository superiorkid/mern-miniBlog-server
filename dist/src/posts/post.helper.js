"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlug = void 0;
const createSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};
exports.createSlug = createSlug;
