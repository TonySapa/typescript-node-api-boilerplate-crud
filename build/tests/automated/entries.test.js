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
const index_1 = __importDefault(require("../../src/index"));
const Entry_1 = __importDefault(require("../../src/models/entry/Entry"));
// import User from '../../models/user/User';
const api = (0, supertest_1.default)(index_1.default);
const newEntry = {
    field1: 'Hello World',
    field2: 47
};
describe('Entries router.', () => {
    test('Entries router is running.', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield api
            .get('/api/entries/ping')
            .expect(200);
        expect(res.text).toContain('Hello World');
    }), 100000);
    /****************************************************************************
     * User is able to post new entries.
     * When authentication fails response is a 401, message_code: 4012.
     * A repeated entry when a field should be unique returns 400 validation.
     ***************************************************************************/
    describe('User can post new entries.', () => {
        test('User can post new entries.', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Entry_1.default.deleteMany({});
            yield api
                .post('/api/entries')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwenJ1cmRZLkN4Z0c2THA5bS5IMkt1Q01Bb3lZZXFOcW9WaTE4NTlVYlFhSklMcWcvUGh3eSIsImlhdCI6MTY0NzUxNTA4M30.PgRStGQjArJMt0icw_yWYW_gYPqQ5Myf8EUowd8no28')
                .send(newEntry)
                .expect('Content-Type', /application\/json/)
                .expect(201);
        }), 10000);
        test('Posting without token authentication returns 401 documented error.', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Entry_1.default.deleteMany({});
            const wrongTokenEntry = yield api
                .post('/api/entries')
                .send(newEntry)
                .expect('Content-Type', /application\/json/)
                .expect(401);
            expect(wrongTokenEntry.body.message_code).toBe(4012);
            expect(wrongTokenEntry.body.message_text).toBe('Token is invalid or has expired');
        }), 10000);
        test('If user doesn\'t exist returns a documented response and don\'t save the entry', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Entry_1.default.deleteMany({});
            const userDoesnExist = yield api
                .post('/api/entries')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRvbnlzYXBhOTBAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkMHpydXJkWS5DeGdHNkxwOW0uSDJLdUNNQW95WWVxTnFvVmkxODU5VWJRYUpJTHFnL1Bod3kiLCJpYXQiOjE2NDc1MTUwODN9.U0KZVH8VA9ZCxXBcLuVrCbdDrWxhYp49RPAvVD-DRXc')
                .send(newEntry)
                .expect('Content-Type', /application\/json/)
                .expect(401);
            expect(userDoesnExist.body.message_code).toBe(4012);
            expect(userDoesnExist.body.message_text).toBe('Token is invalid or has expired');
        }), 10000);
        test('When posting entry with repeated fields that should be unique returns 409 with validation error.', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api
                .post('/api/entries')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwenJ1cmRZLkN4Z0c2THA5bS5IMkt1Q01Bb3lZZXFOcW9WaTE4NTlVYlFhSklMcWcvUGh3eSIsImlhdCI6MTY0NzUxNTA4M30.PgRStGQjArJMt0icw_yWYW_gYPqQ5Myf8EUowd8no28')
                .send(newEntry);
            const userDoesnExist = yield api
                .post('/api/entries')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvbmlzYW5jaGV6LmRldkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQwenJ1cmRZLkN4Z0c2THA5bS5IMkt1Q01Bb3lZZXFOcW9WaTE4NTlVYlFhSklMcWcvUGh3eSIsImlhdCI6MTY0NzUxNTA4M30.PgRStGQjArJMt0icw_yWYW_gYPqQ5Myf8EUowd8no28')
                .send(newEntry)
                .expect('Content-Type', /application\/json/)
                .expect(409);
            expect(userDoesnExist.body.message_code).toBe(4092);
            expect(userDoesnExist.body.message_text).toBe('Entry validation failed: field1: Error, expected `field1` to be unique. Value: `Hello World`');
        }), 10000);
    });
});
afterAll(() => {
    void mongoose_1.default.connection.close();
});
