import { AppSidebar } from "@/components/app-sidebar";
import { bcms } from "@/lib/bcms";
import { RoomsEntry } from "../../bcms/types/ts";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { RoomCard } from "@/components/room-card"

export default async function Page() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const rooms = (await bcms.entry.getAll("rooms")) as RoomsEntry[];

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
            <div>
              <h1 className="text-3xl font-bold">Available Rooms</h1>
              <p className="text-muted-foreground">Browse and book our selection of rooms</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room: RoomsEntry) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}