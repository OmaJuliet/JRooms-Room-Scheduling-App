

import { EntryContentNodeTypeName, EntryContentNodeAttrs } from '@thebcms/types';

export interface BCMSEntryContentParsedItem {
    type: EntryContentNodeTypeName;
    widgetName?: string;
    attrs?: EntryContentNodeAttrs;
    value: string;
}

export interface BCMSEntryContentParsed {
    en?: BCMSEntryContentParsedItem[];
}
