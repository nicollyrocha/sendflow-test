import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";
import type { SvgIconComponent } from "@mui/icons-material";

export interface ConnectionOption {
  value: string;
  label: string;
  iconComponent?: SvgIconComponent;
  iconClassName?: string;
  color?: string;
  description?: string;
}

export const CONNECTION_TYPES = {
  whatsapp: {
    value: "whatsapp",
    label: "WhatsApp",
    iconComponent: WhatsAppIcon,
    iconClassName: "text-green-500",
    color: "#25D366",
    description: "Conecte via WhatsApp Business API",
  },
  telegram: {
    value: "telegram",
    label: "Telegram",
    iconComponent: TelegramIcon,
    iconClassName: "text-blue-500",
    color: "#0088cc",
    description: "Conecte via Telegram Bot API",
  },
  email: {
    value: "email",
    label: "E-mail",
    iconComponent: EmailIcon,
    iconClassName: "text-[#475569]",
    color: "#475569",
    description: "Conecte via SMTP/IMAP",
  },
  sms: {
    value: "sms",
    label: "SMS",
    iconComponent: SmsIcon,
    iconClassName: "text-[#4F46E5]",
    color: "#4F46E5",
    description: "Conecte via provedor de SMS",
  },
} as const;

export type ConnectionType = keyof typeof CONNECTION_TYPES;

/**
 * Retorna a configuração de uma conexão específica
 */
export const getConnection = (type: string): ConnectionOption | undefined => {
  return CONNECTION_TYPES[type as ConnectionType];
};

/**
 * Retorna todas as opções de conexão como array
 */
export const getConnectionOptions = (): ConnectionOption[] => {
  return Object.values(CONNECTION_TYPES);
};
