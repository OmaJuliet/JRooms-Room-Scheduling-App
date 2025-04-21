import { bcms } from "@/lib/bcms"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Users } from "lucide-react"
import { RoomsEntry } from "../../bcms/types/ts"
import { BCMSImage } from "@thebcms/components-react"
import { formatCategory } from "@/lib/utils"
import { formatDistanceToNow, format, isAfter } from "date-fns"

interface BookedRoomCardProps {
  room: RoomsEntry;
  createdAt: Date;
  expiresAt: Date;
  totalPrice: number;
  duration: number;
}

export function BookedRoomCard({ 
  room, 
  createdAt, 
  expiresAt, 
  totalPrice,
  duration 
}: BookedRoomCardProps) {
  // Check if booking has expired
  const isExpired = isAfter(new Date(), expiresAt);
  
  // Format dates
  const formattedCreatedAt = format(createdAt, "MMM d, yyyy 'at' h:mm a");
  const formattedExpiresAt = format(expiresAt, "MMM d, yyyy 'at' h:mm a");
  const expiresIn = isExpired 
    ? "Expired" 
    : formatDistanceToNow(expiresAt, { addSuffix: true });

  return (
    <Link href={`#`} prefetch={true}>
      <Card className="h-full overflow-hidden border-2 p-1 transition-all hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Badge className="absolute right-2 top-2 z-10">
            {formatCategory(room?.meta?.en?.category)}
          </Badge>
          {room?.meta?.en?.image && (
            <BCMSImage
              media={room.meta.en.image}
              clientConfig={bcms.getConfig()}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          )}
        </div>
        <CardContent className="px-4">
          <h3 className="text-xl font-semibold">{room?.meta?.en?.title}</h3>
          <div className="mt-1 text-sm text-muted-foreground">
            Booked on: {formattedCreatedAt}
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {room?.meta?.en?.description}
          </p>
          <div className="mt-2">
            <div className="text-sm text-primary hover:underline">
              See more
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-between gap-y-2 items-start border-t p-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Capacity: {room?.meta?.en?.capacity} people</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Duration:</span>
            <span>{duration} hour{duration !== 1 ? 's' : ''}</span>
          </div>
          <div className="font-medium">
            Total Amount Paid: ${totalPrice.toFixed(2)}
          </div>
          <div className={`${isExpired ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
            {isExpired ? (
              <span>Expired</span>
            ) : (
              <span>Expires {expiresIn} ({formattedExpiresAt})</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}