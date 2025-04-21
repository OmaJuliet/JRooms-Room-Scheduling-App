import type { BCMSEntryContentParsed } from '../content';
import type { BCMSEntryStatuses } from '../status';
import type { RoomsEntry } from '../entry/rooms';

export interface BookingsEntryMetaItem {
    title: string;
    slug: string;
    userid?: string;
    paymentid?: string;
    phone?: string;
    email?: string;
    duration?: number;
    time?: string;
    rooms?: RoomsEntry;
}

export interface BookingsEntryMeta {
    en?: BookingsEntryMetaItem;
}

export interface BookingsEntry {
    _id: string;
    createdAt: number;
    updatedAt: number;
    instanceId: string;
    templateId: string;
    userId: string;
    statuses: BCMSEntryStatuses;
    meta: BookingsEntryMeta;
    content: BCMSEntryContentParsed;
}