export interface Message {
  id: string;
  connection: {
    id: string;
    name: string;
  };
  contacts: {
    id: string;
    name: string;
  }[];
  content: string;
  scheduleDate: Date | null;
  status: "scheduled" | "sent";
  createdAt: Date;
}
