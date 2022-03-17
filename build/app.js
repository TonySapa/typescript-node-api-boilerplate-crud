"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("./utils/logger");
const middleware_1 = require("./utils/middleware");
const users_1 = __importDefault(require("./controllers/users"));
const emails_1 = __importDefault(require("./controllers/emails"));
const entries_1 = __importDefault(require("./controllers/entries"));
const express_handlebars_1 = require("express-handlebars");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(middleware_1.tokenExtractor);
app.engine('.hbs', (0, express_handlebars_1.engine)({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.get('/ping', (_req, res) => {
    (0, logger_1.info)('someone pinged here');
    res.send('pong');
});
app.use('/api/users', users_1.default);
app.use('/api/emails', emails_1.default);
app.use('/api/entries', entries_1.default);
exports.default = app;
