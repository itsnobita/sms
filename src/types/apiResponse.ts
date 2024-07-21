import { Message } from "@/models/User";

export interface apiResponse{
    success: boolean;
    message: string;
    is_accepting_message?: boolean;
    name?: string;
    short_url?: string;
    messages?: Array<Message>;
    suggestionId?: number;
    suggestions?:  Array<string>;

}