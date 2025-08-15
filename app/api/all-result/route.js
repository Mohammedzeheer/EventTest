import { NextResponse } from 'next/server';
import connectMongo from "../../../libs/mongoDB";
import ResultModel from "../../../models/Result";

connectMongo();

// GET method - Fetch all results
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const item = searchParams.get('item');
        const limit = parseInt(searchParams.get('limit')) || 150;
        const skip = parseInt(searchParams.get('skip')) || 0;

        // Build query based on parameters (optional filtering)
        let query = {};
        if (category) {
            query.category = new RegExp(category, 'i');
        }
        if (item) {
            query.item = new RegExp(item, 'i');
        }

        // Fetch all results
        const results = await ResultModel.find(query)
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(limit)
            .skip(skip)
            .lean(); // Better performance

        // Get total count
        const totalCount = await ResultModel.countDocuments(query);

        return NextResponse.json({ 
            success: true,
            data: results, // This matches your React code expectation
            totalCount,
            message: `Found ${results.length} results`
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch results:", error);
        return NextResponse.json({ 
            message: "Failed to fetch results", 
            success: false,
            data: [],
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        }, { status: 500 });
    }
}


export async function PATCH(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const action = searchParams.get('action');

        if (!id) {
            return NextResponse.json({ 
                message: "Result ID is required", 
                status: 400 
            }, { status: 400 });
        }

        const existingResult = await ResultModel.findById(id);
        if (!existingResult) {
            return NextResponse.json({ 
                message: "Result not found", 
                status: 404 
            }, { status: 404 });
        }

        let updateData = {};
        
        if (action === 'toggle') {
            // Toggle the current status
            updateData.isActive = !existingResult.isActive;
        } else if (action === 'activate') {
            updateData.isActive = true;
        } else if (action === 'deactivate') {
            updateData.isActive = false;
        } else {
            return NextResponse.json({ 
                message: "Invalid action. Use 'toggle', 'activate', or 'deactivate'", 
                status: 400 
            }, { status: 400 });
        }

        const updatedResult = await ResultModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return NextResponse.json({ 
            message: `Result ${updateData.isActive ? 'activated' : 'deactivated'} successfully`, 
            status: 200,
            result: updatedResult
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to update result status:", error);
        return NextResponse.json({ 
            message: "Failed to update result status", 
            status: 500,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        }, { status: 500 });
    }
}