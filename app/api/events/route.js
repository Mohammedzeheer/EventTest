import { NextResponse } from 'next/server';
import connectMongo from "../../../libs/mongoDB";
import EventModel from "../../../models/Event";
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectMongo();

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('image');
        const title = formData.get('title');
        const description = formData.get('description');
        const eventDate = formData.get('eventDate');
        const eventTime = formData.get('eventTime');
        const isActive = formData.get('isActive') === 'true';

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded', status: 400 });
        }

        if (!title || !eventDate || !eventTime) {
            return NextResponse.json({ message: 'Title, event date, and event time are required', status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'events',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        // Create event entry
        const eventItem = await EventModel.create({
            title,
            description,
            eventDate: new Date(eventDate),
            eventTime,
            imageUrl: uploadResult.secure_url,
            cloudinaryId: uploadResult.public_id,
            isActive,
            isDeleted: false
        });

        return NextResponse.json({ 
            message: 'Event created successfully', 
            event: eventItem,
            status: 202 
        });
    } catch (error) {
        console.log("Failed to create event", error);
        return NextResponse.json({ message: "Failed to create event", status: 210 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        let query = { isDeleted: false };

        // Add filtering options
        const isActive = searchParams.get('isActive');
        if (isActive !== null) {
            query.isActive = isActive === 'true';
        }

        const events = await EventModel.find(query)
            // .sort({ eventDate: 1, eventTime: 1 }) // Sort by upcoming events first
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await EventModel.countDocuments(query);

        return NextResponse.json({ 
            events,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log("Failed to fetch events", error);
        return NextResponse.json({ message: "Failed to fetch events", status: 210 });
    }
}

export async function PUT(req) {
    try {
        const { id, title, description, eventDate, eventTime, isActive } = await req.json();

        if (!title || !eventDate || !eventTime) {
            return NextResponse.json({ message: 'Title, event date, and event time are required', status: 400 });
        }

        const updatedEvent = await EventModel.findByIdAndUpdate(
            id,
            { 
                title, 
                description, 
                eventDate: new Date(eventDate),
                eventTime,
                isActive 
            },
            { new: true }
        );

        if (!updatedEvent) {
            return NextResponse.json({ message: "Event not found", status: 404 });
        }

        return NextResponse.json({ 
            message: 'Event updated successfully', 
            event: updatedEvent, 
            status: 200 
        });
    } catch (error) {
        console.log("Failed to update event", error);
        return NextResponse.json({ message: "Failed to update event", status: 210 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        const event = await EventModel.findById(id);
        if (!event) {
            return NextResponse.json({ message: "Event not found", status: 404 });
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(event.cloudinaryId);
        } catch (cloudinaryError) {
            console.log("Failed to delete from Cloudinary:", cloudinaryError);
        }

        // Soft delete from database
        await EventModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

        return NextResponse.json({ message: 'Event deleted successfully', status: 200 });
    } catch (error) {
        console.log("Failed to delete event", error);
        return NextResponse.json({ message: "Failed to delete event", status: 210 });
    }
}