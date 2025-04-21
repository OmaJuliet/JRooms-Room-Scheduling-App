// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { bcms } from "@/lib/bcms";
import { BookingsEntry } from "../../../bcms/types/ts";

export async function GET() {
  try {
    // Fetch all bookings from BCMS
    const bookings = (await bcms.entry.getAll("bookings")) as BookingsEntry[];
    
    // Return the bookings array
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}