import { Schema,model,models } from "mongoose";

const librarySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    logo: {
        type: String,
    },
},{timestamps:true})

export const Library = models.Library || model("Library", librarySchema);