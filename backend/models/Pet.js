const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        species: {
            type: String,
            required: true
        },

        breed: {
            type: String,
            default: "Unknown"
        },

        age: {
            type: Number,
            required: true
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true
        },

        vaccinated: {
            type: Boolean,
            default: false
        },

        description: {
            type: String,
            required: true
        },

        imageURL: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Available", "Pending", "Adopted"],
            default: "Available"
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Pet", petSchema);