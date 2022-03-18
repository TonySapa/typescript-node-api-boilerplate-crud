"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./utils/config");
const logger_1 = require("./utils/logger");
const app_1 = __importDefault(require("./app"));
mongoose_1.default.connect(`${config_1.MONGODB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
    (0, logger_1.info)('connected to MongoDB');
})
    .catch((error) => {
    (0, logger_1.error)('error connection to MongoDB:', `${error.message}`);
});
const PORT = 3000;
app_1.default.listen(PORT, () => {
    (0, logger_1.info)(`Server running on port ${PORT}`);
});
exports.default = app_1.default;
