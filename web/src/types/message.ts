export interface Message {
  id: string;
  connectionId: string;
  contactIds: string[];
  content: string;
  scheduledAt: Date | null;
  status: "scheduled" | "sent";
  createdAt: Date;
}
