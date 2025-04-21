import { AppSidebar } from "@/components/app-sidebar";
import { bcms } from "@/lib/bcms";
import { RoomsEntry } from "../../../bcms/types/ts";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { BookingsEntry } from "../../../bcms/types/ts";
import { BookedRoomCard } from "@/components/booked-room-card";

export default async function Page() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const rooms = (await bcms.entry.getAll("rooms")) as RoomsEntry[];
  const bookings = (await bcms.entry.getAll("bookings")) as BookingsEntry[];

  // Filter bookings to only those belonging to the current user
  const userBookings = bookings.filter(booking => 
    booking.meta?.en?.userid === clerkUser.id
  );

  // Create a map of room IDs to their corresponding room data for quick lookup
  const roomMap = new Map<string, RoomsEntry>();
  rooms.forEach(room => roomMap.set(room._id, room));

  // Create a map of room IDs to their corresponding user bookings
  const bookingsByRoomId = new Map<string, BookingsEntry[]>();
  userBookings.forEach(booking => {
    const roomId = booking.meta?.en?.rooms?._id; // Changed to entryId to match your schema
    if (roomId) {
      if (!bookingsByRoomId.has(roomId)) {
        bookingsByRoomId.set(roomId, []);
      }
      bookingsByRoomId.get(roomId)?.push(booking);
    }
  });

  // Filter rooms to only include those that are booked by this user
  const bookedRooms = rooms.filter(room => bookingsByRoomId.has(room._id));

  // Process each booked room to calculate expiration and total price
  const bookedRoomsWithDetails = bookedRooms.map(room => {
    const roomBookings = bookingsByRoomId.get(room._id) || [];
    const latestBooking = roomBookings[0]; // Assuming the first one is the most recent
    
    // Get room price (default to 0 if not available)
    const roomPrice = room.meta?.en?.price || 0;
    
    // Calculate booking details
    const createdAt = latestBooking.createdAt ? new Date(latestBooking.createdAt) : new Date();
    const durationHours = latestBooking.meta?.en?.duration || 1;
    const expiresAt = new Date(createdAt.getTime() + durationHours * 60 * 60 * 1000);
    const totalPrice = roomPrice * durationHours;

    return {
      room,
      bookingDetails: {
        createdAt,
        expiresAt,
        totalPrice,
        duration: durationHours,
        bookingId: latestBooking._id // Added booking ID for reference
      }
    };
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 bg-white border-b shrink-0 items-center justify-between px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6 flex flex-col gap-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="gap-y-2">
              <h1 className="text-3xl font-bold">My Booked Rooms</h1>
              <p className="text-muted-foreground">Your upcoming room bookings</p>
            </div>
          </div>
          {bookedRoomsWithDetails.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookedRoomsWithDetails.map(({ room, bookingDetails }) => (
                <BookedRoomCard 
                  key={bookingDetails.bookingId} 
                  room={room}
                  createdAt={bookingDetails.createdAt}
                  expiresAt={bookingDetails.expiresAt}
                  totalPrice={bookingDetails.totalPrice}
                  duration={bookingDetails.duration}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">You haven&#39;t booked any rooms yet</p>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}