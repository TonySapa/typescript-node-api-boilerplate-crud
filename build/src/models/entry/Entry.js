"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const entrySchema = new mongoose_1.Schema({
    field1: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 254,
        required: true
    },
    field2: {
        type: Number
    },
    user: {
        type: String,
        required: true
    }
});
/* entrySchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // returnedObject.id = `${returnedObject._id}`.toString();
    // delete returnedObject._id;
    // delete returnedObject.__v;
    // delete returnedObject.passwordHash;
  }
}); */
entrySchema.plugin(mongoose_unique_validator_1.default);
/** Mongoose model for "entry". With fields: field1, field2 and user.
 * @field field1 is a unique string between 3 and 254 characters
 * @field field2 is a number
 * @field user is a unique string with the user id
 * @
 */
const EntryModel = (0, mongoose_1.model)('Entry', entrySchema);
exports.default = EntryModel;
