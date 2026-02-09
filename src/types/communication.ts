// types/communication.ts — Types for the internal communication system

export type MemberStatus = 'en_ligne' | 'absent' | 'hors_ligne';
export type ConversationType = 'private' | 'group';
export type GroupType = 'travail' | 'reflexion' | 'commission';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Member {
    id: string;
    nom: string;
    prenoms: string;
    specialite: string;
    photo_url?: string;
    status: MemberStatus;
    numero_ordre: number;
    derniere_connexion: string;
}

export interface MessageAttachment {
    id: string;
    name: string;
    type: 'image' | 'document' | 'pdf';
    url: string;
    size: number; // bytes
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderPhoto?: string;
    content: string;
    timestamp: string;
    status: MessageStatus;
    readBy: string[];
    attachments?: MessageAttachment[];
    isSystem?: boolean; // system messages like "X joined the group"
}

export interface Conversation {
    id: string;
    type: ConversationType;
    name?: string; // group name or other member name for private
    participants: Member[];
    lastMessage?: Message;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
    avatar?: string; // group avatar URL
    color?: string; // group color tag
}

export interface WorkGroup {
    id: string;
    name: string;
    description: string;
    type: GroupType;
    members: Member[];
    admins: string[]; // member IDs
    conversationId: string;
    createdAt: string;
    avatar?: string;
    color: string;
    isArchived: boolean;
}
