import type { Timestamp } from "firebase/firestore";

type DateLike = Timestamp | Date | string | number | null | undefined;

export const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");

  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const formatDateTime = (
  timestamp: Timestamp | Date | string | number,
): string => {
  const date =
    timestamp && typeof timestamp === "object" && "toDate" in timestamp
      ? timestamp.toDate()
      : new Date(timestamp);

  const dateStr = date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} ${timeStr}`;
};

const toDate = (value: DateLike): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && "toDate" in value) return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const isScheduledDatePast = (scheduleDate: DateLike): boolean => {
  const date = toDate(scheduleDate);
  if (!date) return false;
  return date.getTime() <= Date.now();
};

const getDateTimestamp = (value: DateLike): number => {
  const date = toDate(value);
  return date ? date.getTime() : 0;
};

export const sortByScheduleDateDesc = <
  T extends { scheduleDate: DateLike; createdAt: DateLike },
>(
  messages: T[],
): T[] => {
  return [...messages].sort(
    (a, b) =>
      getDateTimestamp(b.scheduleDate) - getDateTimestamp(a.scheduleDate) ||
      getDateTimestamp(b.createdAt) - getDateTimestamp(a.createdAt),
  );
};

export const sortByCreatedAtDesc = <T extends { createdAt: DateLike }>(
  messages: T[],
): T[] => {
  return [...messages].sort(
    (a, b) => getDateTimestamp(b.createdAt) - getDateTimestamp(a.createdAt),
  );
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
