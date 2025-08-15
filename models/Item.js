import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
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

// Index for better query performance
ItemSchema.index({ categoryId: 1, isDeleted: 1 });
ItemSchema.index({ itemName: 1 });

const ItemModel = mongoose.models.Item || mongoose.model('Item', ItemSchema);

export default ItemModel;