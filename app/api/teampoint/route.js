import { NextResponse } from 'next/server';
import connectMongo from "../../../libs/mongoDB";
import TeamPoint from "../../../models/TeamPoint";
import Team from "../../../models/Team";
import mongoose from 'mongoose';

connectMongo();

export async function POST(req) {
  try {
    const { formData, afterCount } = await req.json();

    // Input validation
    if (!formData || !Array.isArray(formData)) {
      return NextResponse.json({ 
        message: 'Invalid form data provided', 
        success: false
      }, { status: 400 });
    }

    if (!afterCount || isNaN(Number(afterCount))) {
      return NextResponse.json({ 
        message: 'Invalid after count provided', 
        success: false
      }, { status: 400 });
    }

    console.log('After count:', afterCount);

    // Find existing team point data or create new
    let teamData = await TeamPoint.findOne();

    if (!teamData) {
      teamData = new TeamPoint({ results: [], afterCount: Number(afterCount) });
    }

    // Process each team's points
    for (const { team, point } of formData) {
      // Validate team object
      if (!team || !team._id) {
        console.warn('Skipping invalid team:', team);
        continue;
      }

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(team._id)) {
        console.warn('Invalid ObjectId for team:', team._id);
        continue;
      }

      const teamObjectId = new mongoose.Types.ObjectId(team._id);
      const existingTeam = teamData.results.find((result) =>
        result.team.equals(teamObjectId)
      );
      
      if (existingTeam) {
        existingTeam.point = Number(point) || 0;
      } else {
        teamData.results.push({
          team: teamObjectId,
          point: Number(point) || 0,
        });
      }
    }

    teamData.afterCount = Number(afterCount);
    const savedData = await teamData.save();

    return NextResponse.json({ 
      message: 'Team points saved successfully', 
      success: true,
      data: savedData
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to save team points:", error);
    console.error("Error stack:", error.stack); 
    
    return NextResponse.json({ 
      message: error.message || "Failed to save team points", 
      success: false
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const data = await TeamPoint.findOne().populate("results.team");

    if (data && data?.results?.length > 0) {
      // Sort the results array by the point value
      const sortedResults = data.results.sort(
        (a, b) => parseInt(b.point) - parseInt(a.point)
      );
      const afterCount = data.afterCount;

      return NextResponse.json({ 
        success: true, 
        data: { sortedResults, afterCount },
        status: 200
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "No data Available",
        status: 200
      });
    }
  } catch (error) {
    console.error("Failed to fetch team points", error);
    return NextResponse.json({ 
      message: "Server error", 
      success: false,
      status: 500 
    });
  }
}

export async function PUT(req) {
  try {
    const { formData, afterCount } = await req.json();

    const teamData = await TeamPoint.findOne();

    if (!teamData) {
      return NextResponse.json({ 
        message: "Team points data not found", 
        success: false,
        status: 404 
      });
    }

    // Update existing team points
    for (const { team, point } of formData) {
      const teamObjectId = new mongoose.Types.ObjectId(team._id);
      const existingTeam = teamData.results.find((result) =>
        result.team.equals(teamObjectId)
      );
      
      if (existingTeam) {
        existingTeam.point = Number(point);
      } else {
        teamData.results.push({
          team: teamObjectId,
          point: Number(point),
        });
      }
    }

    teamData.afterCount = afterCount;
    const updatedData = await teamData.save();

    return NextResponse.json({
      message: 'Team points updated successfully',
      success: true,
      data: updatedData,
      status: 200
    });
  } catch (error) {
    console.error("Failed to update team points", error);
    return NextResponse.json({ 
      message: error.message || "Failed to update team points", 
      success: false,
      status: 500 
    });
  }
}

export async function DELETE(req) {
  try {
    const { teamId } = await req.json();

    const teamData = await TeamPoint.findOne();

    if (!teamData) {
      return NextResponse.json({ 
        message: "Team points data not found", 
        success: false,
        status: 404 
      });
    }

    // Remove specific team from results
    if (teamId) {
      const teamObjectId = new mongoose.Types.ObjectId(teamId);
      teamData.results = teamData.results.filter(
        (result) => !result.team.equals(teamObjectId)
      );
      
      const updatedData = await teamData.save();
      
      return NextResponse.json({ 
        message: 'Team removed from points successfully', 
        success: true,
        data: updatedData,
        status: 200 
      });
    } else {
      // Clear all team points
      teamData.results = [];
      teamData.afterCount = 0;
      
      const updatedData = await teamData.save();
      
      return NextResponse.json({ 
        message: 'All team points cleared successfully', 
        success: true,
        status: 200 
      });
    }
  } catch (error) {
    console.error("Failed to delete team points", error);
    return NextResponse.json({ 
      message: error.message || "Failed to delete team points", 
      success: false,
      status: 500 
    });
  }
}