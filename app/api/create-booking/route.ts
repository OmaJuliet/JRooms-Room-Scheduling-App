import { NextResponse } from "next/server";
import { bcms } from "@/lib/bcms";
import { auth } from '@clerk/nextjs/server'


export async function POST(request: Request) {
    const { userId } = await auth()
    try {
        // Parse the request body
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.slug || !body.paymentid || !body.email || !body.phone || !body.time || !body.duration || !body.rooms?.entryId || !body.rooms?.templateId) {
            return NextResponse.json(
                { success: false, error: "Missing required fields in request body" },
                { status: 400 }
            );
        }

        // Convert duration to number
        const duration = Number(body.duration);
        if (isNaN(duration)) {
            return NextResponse.json(
                { success: false, error: "Duration must be a valid number" },
                { status: 400 }
            );
        }

        // Create the booking
        const newBooking = await bcms.entry.create("bookings", {
            content: [],
            statuses: [],
            meta: [
                {
                    lng: "en",
                    data: {
                        title: body.title,
                        slug: body.slug,
                        userid: userId || "null",
                        paymentid: body.paymentid,
                        email: body.email,
                        phone: body.phone,
                        time: body.time,
                        duration: duration, // Use the converted number
                        rooms: {
                            entryId: body.rooms.entryId,
                            templateId: body.rooms.templateId,
                        },
                    },
                },
            ],
        });

        return NextResponse.json({ success: true, data: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create booking" },
            { status: 500 }
        );
    }
}