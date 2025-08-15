import { NextResponse } from 'next/server';
import connectMongo from "../../../libs/mongoDB";
import ResultPoster from "../../../models/ResultPoster";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectMongo();

export async function GET(req) {
  try {
    const posterData = await ResultPoster.findOne() || new ResultPoster({
      poster1: { poster: "defaultPoster.jpg", color: "white", public_id: "default1" },
      poster2: { poster: "defaultPoster.jpg", color: "white", public_id: "default2" },
      poster3: { poster: "defaultPoster.jpg", color: "white", public_id: "default3" }
    });

    return NextResponse.json({
      success: true,
      data: posterData
    });
  } catch (error) {
    console.error("Failed to fetch poster backgrounds:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch poster backgrounds"
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    let posterData = await ResultPoster.findOne();
    if (!posterData) {
      posterData = new ResultPoster({
        poster1: { poster: "defaultPoster.jpg", color: "white", public_id: "default1" },
        poster2: { poster: "defaultPoster.jpg", color: "white", public_id: "default2" },
        poster3: { poster: "defaultPoster.jpg", color: "white", public_id: "default3" }
      });
    }

    for (let i = 1; i <= 3; i++) {
      const posterFile = formData.get(`poster${i}`);
      const color = formData.get(`color${i}`) || 'white';
      const posterKey = `poster${i}`;

      if (posterFile && posterFile.size > 0) {
        try {
          // Convert file to base64
          const arrayBuffer = await posterFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64String = `data:${posterFile.type};base64,${buffer.toString('base64')}`;

          // Delete old poster from Cloudinary if it exists and is not default
          if (posterData[posterKey].public_id && !posterData[posterKey].public_id.startsWith('default')) {
            try {
              await cloudinary.uploader.destroy(posterData[posterKey].public_id);
            } catch (deleteError) {
              console.warn(`Failed to delete old poster: ${deleteError.message}`);
            }
          }

          // Upload new poster background to Cloudinary with poster-specific transformations
          const uploadResult = await cloudinary.uploader.upload(base64String, {
            folder: 'result-poster-backgrounds',
            transformation: [
              { width: 1080, height: 1350, crop: 'fill' }, // Poster dimensions (4:5 ratio)
              { quality: 'auto', format: 'auto' },
              { flags: 'progressive' }
            ]
          });

          // Update poster data
          posterData[posterKey] = {
            poster: uploadResult.secure_url,
            color: color,
            public_id: uploadResult.public_id
          };

        } catch (uploadError) {
          console.error(`Failed to upload poster${i}:`, uploadError);
        }
      } else if (color) {
        posterData[posterKey].color = color;
      }
    }

    const savedData = await posterData.save();

    return NextResponse.json({
      success: true,
      message: 'Result poster backgrounds updated successfully',
      data: savedData
    });

  } catch (error) {
    console.error("Failed to update poster backgrounds:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to update poster backgrounds"
    }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const posterSlot = searchParams.get('slot'); 

    if (!posterSlot || !['poster1', 'poster2', 'poster3'].includes(posterSlot)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid poster slot'
      }, { status: 400 });
    }

    const posterData = await ResultPoster.findOne();
    if (!posterData) {
      return NextResponse.json({
        success: false,
        message: 'No poster data found'
      }, { status: 404 });
    }

    if (posterData[posterSlot].public_id && !posterData[posterSlot].public_id.startsWith('default')) {
      try {
        await cloudinary.uploader.destroy(posterData[posterSlot].public_id);
      } catch (deleteError) {
        console.warn(`Failed to delete from Cloudinary: ${deleteError.message}`);
      }
    }

    // Reset to default
    posterData[posterSlot] = {
      poster: "defaultPoster.jpg",
      color: "white",
      public_id: `default${posterSlot.slice(-1)}`
    };

    await posterData.save();

    return NextResponse.json({
      success: true,
      message: `${posterSlot} background deleted successfully`,
      data: posterData
    });

  } catch (error) {
    console.error("Failed to delete poster background:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete poster background"
    }, { status: 500 });
  }
}