import { bcms } from "@/lib/bcms"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Users } from "lucide-react"
import { RoomsEntry } from "../../bcms/types/ts"
import { BCMSImage } from "@thebcms/components-react"
import { formatCategory } from "@/lib/utils"

interface RoomCardProps {
  room: RoomsEntry;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.meta.en?.slug}`} prefetch={true}>
      <Card className="h-full overflow-hidden border-2 p-1 transition-all hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Badge className="absolute right-2 top-2 z-10">{formatCategory(room?.meta?.en?.category)}</Badge>
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
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{room?.meta?.en?.description}</p>
          <div className="mt-2">
            <div className="text-sm text-primary hover:underline">
              See more
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room?.meta?.en?.capacity} people</span>
          </div>
          <div className="font-medium">${room?.meta?.en?.price}/hr</div>
          <div className="text-muted-foreground">Up to {room?.meta?.en?.duration} hours</div>
        </CardFooter>
      </Card>
    </Link>
  )
}