import type { BCMSEntryContentParsed } from '../content';
import type { BCMSEntryStatuses } from '../status';
import type { RoomsEntryMetaItemCategory } from '../enum/RoomsEntryMetaItemCategory';
import type { PropMediaDataParsed, PropValueDateData } from '@thebcms/types';
import type { RoomsEntryMetaItemAmenities } from '../enum/RoomsEntryMetaItemAmenities';

export interface RoomsEntryMetaItem {
    title: string;
    slug: string;
    capacity?: number;
    description?: string;
    category?: RoomsEntryMetaItemCategory;
    price?: number;
    image?: PropMediaDataParsed;
    location?: string;
    bookingtime?: PropValueDateData;
    duration?: number;
    amenities?: RoomsEntryMetaItemAmenities[];
}

export interface RoomsEntryMeta {
    en?: RoomsEntryMetaItem;
}

export interface RoomsEntry {
    _id: string;
    createdAt: number;
    updatedAt: number;
    instanceId: string;
    templateId: string;
    userId: string;
    statuses: BCMSEntryStatuses;
    meta: RoomsEntryMeta;
    content: BCMSEntryContentParsed;
}