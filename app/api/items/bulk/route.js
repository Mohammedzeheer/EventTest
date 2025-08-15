import { NextResponse } from 'next/server';
import connectMongo from "../../../../libs/mongoDB";
import ItemModel from "../../../../models/Item";
import CategoryModel from "../../../../models/Category";

connectMongo();

export async function POST(req) {
    try {
        const { items } = await req.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ 
                message: "Invalid items data", 
                status: 400 
            });
        }

        // Validate all categories exist and are active
        const categoryIds = [...new Set(items.map(item => item.categoryId))];
        const categories = await CategoryModel.find({
            _id: { $in: categoryIds },
            isDeleted: false,
            isActive: true
        });

        if (categories.length !== categoryIds.length) {
            return NextResponse.json({ 
                message: "One or more categories are invalid or inactive", 
                status: 400 
            });
        }

        // Get existing items to check for duplicates
        const existingItems = await ItemModel.find({
            isDeleted: false,
            categoryId: { $in: categoryIds }
        }).select('itemName categoryId');

        const existingItemsMap = new Map();
        existingItems.forEach(item => {
            const key = `${item.itemName.toLowerCase()}-${item.categoryId}`;
            existingItemsMap.set(key, true);
        });

        // Filter out duplicates and prepare items for insertion
        const itemsToInsert = [];
        const duplicates = [];
        const processedItems = new Set();

        for (const item of items) {
            const key = `${item.itemName.toLowerCase()}-${item.categoryId}`;
            
            // Check if already exists in database
            if (existingItemsMap.has(key)) {
                duplicates.push(item.itemName);
                continue;
            }

            // Check if duplicate in current batch
            if (processedItems.has(key)) {
                continue;
            }

            processedItems.add(key);
            itemsToInsert.push({
                itemName: item.itemName,
                categoryId: item.categoryId,
                isActive: item.isActive !== undefined ? item.isActive : true,
                isDeleted: false
            });
        }

        // Insert items in bulk
        let insertedCount = 0;
        if (itemsToInsert.length > 0) {
            const result = await ItemModel.insertMany(itemsToInsert);
            insertedCount = result.length;
        }

        const response = {
            message: `Bulk operation completed`,
            inserted: insertedCount,
            duplicates: duplicates.length,
            status: 202
        };

        if (duplicates.length > 0) {
            response.duplicateItems = duplicates;
        }

        return NextResponse.json(response);
    } catch (error) {
        console.log("Failed to create bulk items", error);
        return NextResponse.json({ 
            message: "Failed to create bulk items", 
            status: 210 
        });
    }
}