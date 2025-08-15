import { NextResponse } from 'next/server';
import connectMongo from "../../../libs/mongoDB";
import TeamModel from "../../../models/Team";
connectMongo();

export async function POST(req) {
  try {
    const { teamName, isActive, isDeleted } = await req.json();

    await TeamModel.create({
      teamName,
      isActive,
      isDeleted
    });

    return NextResponse.json({ message: 'Team created successfully', status: 202 });
  } catch (error) {
    console.log("Failed to create team", error);
    return NextResponse.json({ message: "Failed to create team", status: 210 });
  }
}

export async function GET(req, res) {
  try {
    const teams = await TeamModel.find({ isDeleted: false });
    return NextResponse.json({ teams });
  } catch (error) {
    console.log("Failed to fetch teams", error);
    return NextResponse.json({ message: "Failed to fetch teams", status: 210 });
  }
}

export async function PUT(req) {
  try {
    const { id, teamName, isActive, isDeleted } = await req.json();

    const updatedTeam = await TeamModel.findByIdAndUpdate(
      id,
      { teamName, isActive, isDeleted },
      { new: true }
    );

    if (!updatedTeam) {
      return NextResponse.json({ message: "Team not found", status: 404 });
    }

    return NextResponse.json({
      message: 'Team updated successfully',
      team: updatedTeam,
      status: 200
    });
  } catch (error) {
    console.log("Failed to update team", error);
    return NextResponse.json({ message: "Failed to update team", status: 210 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    const deletedTeam = await TeamModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedTeam) {
      return NextResponse.json({ message: "Team not found", status: 404 });
    }

    return NextResponse.json({ message: 'Team deleted successfully', status: 200 });
  } catch (error) {
    console.log("Failed to delete team", error);
    return NextResponse.json({ message: "Failed to delete team", status: 210 });
  }
}