"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../index"));
// import User from '../../models/user/User';
const api = (0, supertest_1.default)(index_1.default);
/* const newEntry = {
  field1: 'Hello World',
  field2: 47
}; */
describe('Entries router', () => {
    test('User can post a new entry', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/entries/ping')
            .expect(200);
    }), 100000);
});
afterAll(() => {
    void mongoose_1.default.connection.close();
});
