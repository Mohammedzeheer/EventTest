import { NextResponse } from 'next/server';
import connectMongo from "../../../libs/mongoDB";
import ItemModel from "../../../models/Item";
import CategoryModel from "../../../models/Category";

connectMongo();

export async function POST(req) {
    try {
        const { itemName, categoryId, isActive } = await req.json();
        
        // Validate that category exists and is active
        const category = await CategoryModel.findById(categoryId);
        if (!category || category.isDeleted || !category.isActive) {
            return NextResponse.json({ 
                message: "Invalid or inactive category", 
                status: 400 
            });
        }

        // Check if item already exists in the same category
        const existingItem = await ItemModel.findOne({
            itemName: { $regex: new RegExp(`^${itemName}$`, 'i') },
            categoryId,
            isDeleted: false
        });

        if (existingItem) {
            return NextResponse.json({ 
                message: "Item already exists in this category", 
                status: 409 
            });
        }

        await ItemModel.create({
            itemName,
            categoryId,
            isActive: isActive !== undefined ? isActive : true,
            isDeleted: false
        });

        return NextResponse.json({ 
            message: 'Item created successfully', 
            status: 202 
        });
    } catch (error) {
        console.log("Failed to create item", error);
        return NextResponse.json({ 
            message: "Failed to create item", 
            status: 210 
        });
    }
}

export async function GET(req) {
    try {
        const items = await ItemModel.find({ isDeleted: false })
            .populate('categoryId', 'categoryName isActive')
            .sort({ createdAt: -1 });

        return NextResponse.json({ items });
    } catch (error) {
        console.log("Failed to fetch items", error);
        return NextResponse.json({ 
            message: "Failed to fetch items", 
            status: 210 
        });
    }
}

export async function PUT(req) {
    try {
        const { id, itemName, categoryId, isActive } = await req.json();

        // Validate that category exists and is active
        const category = await CategoryModel.findById(categoryId);
        if (!category || category.isDeleted || !category.isActive) {
            return NextResponse.json({ 
                message: "Invalid or inactive category", 
                status: 400 
            });
        }

        // Check if item name already exists in the same category (excluding current item)
        const existingItem = await ItemModel.findOne({
            _id: { $ne: id },
            itemName: { $regex: new RegExp(`^${itemName}$`, 'i') },
            categoryId,
            isDeleted: false
        });

        if (existingItem) {
            return NextResponse.json({ 
                message: "Item already exists in this category", 
                status: 409 
            });
        }

        const updatedItem = await ItemModel.findByIdAndUpdate(
            id,
            { itemName, categoryId, isActive },
            { new: true }
        ).populate('categoryId', 'categoryName isActive');

        if (!updatedItem) {
            return NextResponse.json({ 
                message: "Item not found", 
                status: 404 
            });
        }

        return NextResponse.json({
            message: 'Item updated successfully',
            item: updatedItem,
            status: 200
        });
    } catch (error) {
        console.log("Failed to update item", error);
        return NextResponse.json({ 
            message: "Failed to update item", 
            status: 210 
        });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        const deletedItem = await ItemModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!deletedItem) {
            return NextResponse.json({ 
                message: "Item not found", 
                status: 404 
            });
        }

        return NextResponse.json({ 
            message: 'Item deleted successfully', 
            status: 200 
        });
    } catch (error) {
        console.log("Failed to delete item", error);
        return NextResponse.json({ 
            message: "Failed to delete item", 
            status: 210 
        });
    }
}