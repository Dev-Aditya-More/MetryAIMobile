export interface BusinessHoursSegment {
    startTime: string;
    endTime: string;
}

export interface BusinessHours {
    monday: BusinessHoursSegment[];
    tuesday: BusinessHoursSegment[];
    wednesday: BusinessHoursSegment[];
    thursday: BusinessHoursSegment[];
    friday: BusinessHoursSegment[];
    saturday: BusinessHoursSegment[];
    sunday: BusinessHoursSegment[];
}

export interface Business {
    id: string;
    merchantId?: string;
    name: string;
    logoUrl?: string;
    website?: string;
    location?: string;
    rooms?: number;
    chairs?: number;
    description?: string;
    businessHours?: BusinessHours;
    deleted?: boolean;
    updateTime?: number;
    createTime?: number | null;
}

export interface BusinessListResponse {
    list: Business[];
    total: number;
}
