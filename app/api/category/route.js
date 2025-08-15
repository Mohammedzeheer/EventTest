import { NextResponse } from 'next/server';
import connectMongo from "../../../libs/mongoDB";
import CategoryModel from "../../../models/Category";

connectMongo();

export async function POST(req) {
    try {
        const { categoryName, isActive, isDeleted } = await req.json();

        await CategoryModel.create({
            categoryName,
            isActive,
            isDeleted
        });

        return NextResponse.json({ message: 'Category created successfully', status: 202 });
    } catch (error) {
        console.log("Failed to create category", error);
        return NextResponse.json({ message: "Failed to create category", status: 210 });
    }
}

export async function GET(req, res) {
    try {
        const categories = await CategoryModel.find({ isDeleted: false });
        return NextResponse.json({ categories });
    } catch (error) {
        console.log("Failed to fetch categories", error);
        return NextResponse.json({ message: "Failed to fetch categories", status: 210 });
    }
}

export async function PUT(req) {
    try {
        const { id, categoryName, isActive, isDeleted } = await req.json();

        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            id,
            { categoryName, isActive, isDeleted },
            { new: true }
        );

        if (!updatedCategory) {
            return NextResponse.json({ message: "Category not found", status: 404 });
        }

        return NextResponse.json({ 
            message: 'Category updated successfully', 
            category: updatedCategory, 
            status: 200 
        });
    } catch (error) {
        console.log("Failed to update category", error);
        return NextResponse.json({ message: "Failed to update category", status: 210 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        const deletedCategory = await CategoryModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!deletedCategory) {
            return NextResponse.json({ message: "Category not found", status: 404 });
        }

        return NextResponse.json({ message: 'Category deleted successfully', status: 200 });
    } catch (error) {
        console.log("Failed to delete category", error);
        return NextResponse.json({ message: "Failed to delete category", status: 210 });
    }
}