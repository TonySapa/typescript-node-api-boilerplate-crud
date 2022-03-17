"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const domain_1 = require("../../domain");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 254,
        required: true
    },
    passwordHash: {
        type: String,
        minlength: 8,
        maxlength: 254,
        required: true
    },
    account_status: {
        type: String,
        enum: domain_1.typesOfAccountStatus,
        default: domain_1.typesOfAccountStatus[0],
        required: true
    },
    account_status_token: {
        type: String
    }
});
userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = `${returnedObject._id}`.toString();
        // delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});
userSchema.plugin(mongoose_unique_validator_1.default);
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
