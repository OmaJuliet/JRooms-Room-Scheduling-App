import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { bcms } from "@/lib/bcms";
import { BCMSEntryContentParsedItem, RoomsEntry, RoomsEntryMetaItem  } from "../../../../bcms/types/ts";
import { BCMSImage } from "@thebcms/components-react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { formatCategory } from "@/lib/utils";
import { BookingModal } from "@/components/booking-modal"

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const rooms = (await bcms.entry.getAll("rooms")) as RoomsEntry[];

  return rooms.map((room) => {
      const meta = room.meta.en as RoomsEntryMetaItem;
      return {
          slug: meta.slug,
      };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = (await bcms.entry.getBySlug(
    slug, "rooms"
  )) as RoomsEntry;

  if (!room) {
      return notFound();
  }

  const roomEntryMeta = room.meta.en as RoomsEntryMetaItem;
  const pageTitle = `${roomEntryMeta?.title} - Great Room`;

  return {
      title: pageTitle,
      openGraph: {
          title: pageTitle,
      },
      twitter: {
          title: pageTitle,
      },
  };
}

const RoomDetailPage = async ({ params }: Props) => {
  
  // Fetch all blogs
  const rooms = (await bcms.entry.getAll("rooms")) as RoomsEntry[];
  console.log("Rooooooommmsss:", rooms)
  const { slug } = await params;
  console.log("Slug:", slug)
  // Find the current blog
  const room = rooms.find((e) => e.meta.en?.slug === slug);

  if (!room) {
      return notFound();
  }

  // Prepare blog data
  const data = {
      meta: room.meta.en as RoomsEntryMetaItem,
      content: room.content.en as BCMSEntryContentParsedItem[],
  };

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
        <div className="container mx-auto p-6">
          <div className="mb-6 flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <Link href="/">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold md:text-3xl">{data?.meta?.title}</h1>
            <Badge className="ml-auto">{formatCategory(data?.meta?.category)}</Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
              {data?.meta?.image && (
                <BCMSImage
                  media={data?.meta?.image}
                  clientConfig={bcms.getConfig()}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              )}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold">Description</h2>
                <div className="mt-2 whitespace-pre-line text-muted-foreground">{data?.meta?.description}</div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold">Features</h2>
                <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {data?.meta?.amenities  && data?.meta?.amenities.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>{formatCategory(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="rounded-lg border p-4">
                <h2 className="text-xl font-semibold">Booking Information</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>Capacity</span>
                    </div>
                    <span className="font-medium">{data?.meta?.capacity} people</span>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>Available for</span>
                    </div>
                    <span className="font-medium">Up to {data?.meta?.duration} hours</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Price per hour</span>
                    <span className="font-medium">${data?.meta?.price}</span>
                  </div>

                  <div className="pt-4">
                    <BookingModal 
                      roomId={room?._id} 
                      roomTitle={data?.meta?.title} 
                      maxHours={data?.meta?.duration}
                      roomTemplateId={room?.templateId}
                      roomPrice={data?.meta?.price}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default RoomDetailPage;