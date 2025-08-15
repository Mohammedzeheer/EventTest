import { NextResponse } from 'next/server';
import connectMongo from "../../../libs/mongoDB";
import ResultModel from "../../../models/Result";

connectMongo();

export async function POST(req) {
    try {
        const { 
            resultNumber, 
            category, 
            item, 
            firstPrize, 
            firstTeam, 
            secondPrize, 
            secondTeam, 
            thirdPrize, 
            thirdTeam,
            isActive = true
        } = await req.json();

        // Validate required fields
        if (!category || !item || !firstPrize || !firstTeam || !secondPrize || !secondTeam || !thirdPrize || !thirdTeam) {
            return NextResponse.json({ 
                message: "All fields are required", 
                status: 400 
            }, { status: 400 });
        }

        // Check for duplicate category and item combination
        const existingResult = await ResultModel.findOne({
            category: category,
            item: item
        });

        if (existingResult) {
            return NextResponse.json({ 
                message: "Results for this category and item already exist", 
                status: 409,
                duplicate: true,
                existingResult: {
                    category: existingResult.category,
                    item: existingResult.item,
                    isActive: existingResult.isActive,
                    createdAt: existingResult.createdAt
                }
            }, { status: 409 });
        }

        // Create new result
        const newResult = await ResultModel.create({
            category: category.trim(),
            item: item.trim(),
            firstPrize: firstPrize.trim(),
            firstTeam: firstTeam.trim(),
            secondPrize: secondPrize.trim(),
            secondTeam: secondTeam.trim(),
            thirdPrize: thirdPrize.trim(),
            thirdTeam: thirdTeam.trim(),
            isActive: isActive
        });

        return NextResponse.json({ 
            message: 'Result uploaded successfully', 
            status: 201,
            result: newResult
        }, { status: 201 });

    } catch (error) {
        console.error("Failed to upload result:", error);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return NextResponse.json({ 
                message: "Results for this category and item already exist", 
                status: 409,
                duplicate: true
            }, { status: 409 });
        }

        return NextResponse.json({ 
            message: "Failed to upload result", 
            status: 500,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const item = searchParams.get('item');
        const isActive = searchParams.get('isActive');
        const limit = parseInt(searchParams.get('limit')) || 150;
        const skip = parseInt(searchParams.get('skip')) || 0;

        // Build query based on parameters
        let query = {};
        if (category) query.category = new RegExp(category, 'i');
        if (item) query.item = new RegExp(item, 'i');
        
        // Filter by active/inactive status
        if (isActive !== null && isActive !== undefined) {
            if (isActive === 'true') {
                query.isActive = true;
            } else if (isActive === 'false') {
                query.isActive = false;
            }
            // If isActive is 'all' or any other value, don't filter by status
        }

        // Fetch results with pagination
        const results = await ResultModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        // Get total count for pagination
        const totalCount = await ResultModel.countDocuments(query);

        // Get counts for active/inactive
        const activeCount = await ResultModel.countDocuments({ ...query, isActive: true });
        const inactiveCount = await ResultModel.countDocuments({ ...query, isActive: false });

        return NextResponse.json({ 
            results,
            totalCount,
            activeCount,
            inactiveCount,
            currentPage: Math.floor(skip / limit) + 1,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: skip + limit < totalCount
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch results:", error);
        return NextResponse.json({ 
            message: "Failed to fetch results", 
            status: 500,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        }, { status: 500 });
    }
}

// Update method with active/inactive support
export async function PUT(req) {
    try {
        const { 
            id,
            category, 
            item, 
            firstPrize, 
            firstTeam, 
            secondPrize, 
            secondTeam, 
            thirdPrize, 
            thirdTeam,
            isActive
        } = await req.json();

        if (!id) {
            return NextResponse.json({ 
                message: "Result ID is required", 
                status: 400 
            }, { status: 400 });
        }

        // Check if result exists
        const existingResult = await ResultModel.findById(id);
        if (!existingResult) {
            return NextResponse.json({ 
                message: "Result not found", 
                status: 404 
            }, { status: 404 });
        }

        // Check for duplicate if category/item is being changed
        if (category !== existingResult.category || item !== existingResult.item) {
            const duplicateResult = await ResultModel.findOne({
                category: category,
                item: item,
                _id: { $ne: id }
            });

            if (duplicateResult) {
                return NextResponse.json({ 
                    message: "Results for this category and item already exist", 
                    status: 409 
                }, { status: 409 });
            }
        }

        // Update result
        const updateData = {
            category: category.trim(),
            item: item.trim(),
            firstPrize: firstPrize.trim(),
            firstTeam: firstTeam.trim(),
            secondPrize: secondPrize.trim(),
            secondTeam: secondTeam.trim(),
            thirdPrize: thirdPrize.trim(),
            thirdTeam: thirdTeam.trim()
        };

        // Only update isActive if it's provided
        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }

        const updatedResult = await ResultModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return NextResponse.json({ 
            message: 'Result updated successfully', 
            status: 200,
            result: updatedResult
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to update result:", error);
        return NextResponse.json({ 
            message: "Failed to update result", 
            status: 500,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        }, { status: 500 });
    }
}

// Toggle active/inactive status
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

// Delete method (unchanged)
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ 
                message: "Result ID is required", 
                status: 400 
            }, { status: 400 });
        }

        const deletedResult = await ResultModel.findByIdAndDelete(id);

        if (!deletedResult) {
            return NextResponse.json({ 
                message: "Result not found", 
                status: 404 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Result deleted successfully', 
            status: 200,
            deletedResult
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to delete result:", error);
        return NextResponse.json({ 
            message: "Failed to delete result", 
            status: 500,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        }, { status: 500 });
    }
}




// import { NextResponse } from 'next/server';
// import connectMongo from "../../../libs/mongoDB";
// import ResultModel from "../../../models/Result";

// connectMongo();

// export async function POST(req) {
//     try {
//         const { 
//             resultNumber, 
//             category, 
//             item, 
//             firstPrize, 
//             firstTeam, 
//             secondPrize, 
//             secondTeam, 
//             thirdPrize, 
//             thirdTeam 
//         } = await req.json();

//         // Validate required fields
//         if (!category || !item || !firstPrize || !firstTeam || !secondPrize || !secondTeam || !thirdPrize || !thirdTeam) {
//             return NextResponse.json({ 
//                 message: "All fields are required", 
//                 status: 400 
//             }, { status: 400 });
//         }

//         // Check for duplicate category and item combination
//         const existingResult = await ResultModel.findOne({
//             category: category,
//             item: item
//         });

//         if (existingResult) {
//             return NextResponse.json({ 
//                 message: "Results for this category and item already exist", 
//                 status: 409,
//                 duplicate: true,
//                 existingResult: {
//                     category: existingResult.category,
//                     item: existingResult.item,
//                     createdAt: existingResult.createdAt
//                 }
//             }, { status: 409 });
//         }

//         // Create new result
//         const newResult = await ResultModel.create({
//             category: category.trim(),
//             item: item.trim(),
//             firstPrize: firstPrize.trim(),
//             firstTeam: firstTeam.trim(),
//             secondPrize: secondPrize.trim(),
//             secondTeam: secondTeam.trim(),
//             thirdPrize: thirdPrize.trim(),
//             thirdTeam: thirdTeam.trim(),
//             createdAt: new Date(),
//             updatedAt: new Date()
//         });

//         return NextResponse.json({ 
//             message: 'Result uploaded successfully', 
//             status: 201,
//             result: newResult
//         }, { status: 201 });

//     } catch (error) {
//         console.error("Failed to upload result:", error);
        
//         // Handle MongoDB duplicate key error
//         if (error.code === 11000) {
//             return NextResponse.json({ 
//                 message: "Results for this category and item already exist", 
//                 status: 409,
//                 duplicate: true
//             }, { status: 409 });
//         }

//         return NextResponse.json({ 
//             message: "Failed to upload result", 
//             status: 500,
//             error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//         }, { status: 500 });
//     }
// }

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const category = searchParams.get('category');
//         const item = searchParams.get('item');
//         const limit = parseInt(searchParams.get('limit')) || 150;
//         const skip = parseInt(searchParams.get('skip')) || 0;

//         // Build query based on parameters
//         let query = {};
//         if (category) query.category = new RegExp(category, 'i');
//         if (item) query.item = new RegExp(item, 'i');

//         // Fetch results with pagination
//         const results = await ResultModel.find(query)
//             .sort({ createdAt: -1 })
//             .limit(limit)
//             .skip(skip);

//         // Get total count for pagination
//         const totalCount = await ResultModel.countDocuments(query);

//         return NextResponse.json({ 
//             results,
//             totalCount,
//             currentPage: Math.floor(skip / limit) + 1,
//             totalPages: Math.ceil(totalCount / limit),
//             hasMore: skip + limit < totalCount
//         }, { status: 200 });

//     } catch (error) {
//         console.error("Failed to fetch results:", error);
//         return NextResponse.json({ 
//             message: "Failed to fetch results", 
//             status: 500,
//             error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//         }, { status: 500 });
//     }
// }

// // Optional: Add PUT method for updating results
// export async function PUT(req) {
//     try {
//         const { 
//             id,
//             category, 
//             item, 
//             firstPrize, 
//             firstTeam, 
//             secondPrize, 
//             secondTeam, 
//             thirdPrize, 
//             thirdTeam 
//         } = await req.json();

//         if (!id) {
//             return NextResponse.json({ 
//                 message: "Result ID is required", 
//                 status: 400 
//             }, { status: 400 });
//         }

//         // Check if result exists
//         const existingResult = await ResultModel.findById(id);
//         if (!existingResult) {
//             return NextResponse.json({ 
//                 message: "Result not found", 
//                 status: 404 
//             }, { status: 404 });
//         }

//         // Check for duplicate if category/item is being changed
//         if (category !== existingResult.category || item !== existingResult.item) {
//             const duplicateResult = await ResultModel.findOne({
//                 category: category,
//                 item: item,
//                 _id: { $ne: id }
//             });

//             if (duplicateResult) {
//                 return NextResponse.json({ 
//                     message: "Results for this category and item already exist", 
//                     status: 409 
//                 }, { status: 409 });
//             }
//         }

//         // Update result
//         const updatedResult = await ResultModel.findByIdAndUpdate(
//             id,
//             {
//                 category: category.trim(),
//                 item: item.trim(),
//                 firstPrize: firstPrize.trim(),
//                 firstTeam: firstTeam.trim(),
//                 secondPrize: secondPrize.trim(),
//                 secondTeam: secondTeam.trim(),
//                 thirdPrize: thirdPrize.trim(),
//                 thirdTeam: thirdTeam.trim(),
//                 updatedAt: new Date()
//             },
//             { new: true }
//         );

//         return NextResponse.json({ 
//             message: 'Result updated successfully', 
//             status: 200,
//             result: updatedResult
//         }, { status: 200 });

//     } catch (error) {
//         console.error("Failed to update result:", error);
//         return NextResponse.json({ 
//             message: "Failed to update result", 
//             status: 500,
//             error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//         }, { status: 500 });
//     }
// }

// // Optional: Add DELETE method for removing results
// export async function DELETE(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const id = searchParams.get('id');

//         if (!id) {
//             return NextResponse.json({ 
//                 message: "Result ID is required", 
//                 status: 400 
//             }, { status: 400 });
//         }

//         const deletedResult = await ResultModel.findByIdAndDelete(id);

//         if (!deletedResult) {
//             return NextResponse.json({ 
//                 message: "Result not found", 
//                 status: 404 
//             }, { status: 404 });
//         }

//         return NextResponse.json({ 
//             message: 'Result deleted successfully', 
//             status: 200,
//             deletedResult
//         }, { status: 200 });

//     } catch (error) {
//         console.error("Failed to delete result:", error);
//         return NextResponse.json({ 
//             message: "Failed to delete result", 
//             status: 500,
//             error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//         }, { status: 500 });
//     }
// }
