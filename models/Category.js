import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const CategoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default CategoryModel;