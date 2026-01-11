
export enum AttachmentType {
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO'
}

export interface Attachment {
  type: AttachmentType;
  url: string;
  name: string;
}

export interface Stamp {
  id: string;
  design: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation: number;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  location: string;
  distanceKm: number; // Simulated distance for delivery calculation
}

export enum LetterStatus {
  ARRIVING = 'ARRIVING',
  RECEIVED = 'RECEIVED',
  SENT = 'SENT'
}

export interface Letter {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  font: string;
  paperType: string;
  attachments: Attachment[];
  stamps: Stamp[];
  sentAt: number;
  estimatedDeliveryAt: number;
  status: LetterStatus;
  distance: number;
}
