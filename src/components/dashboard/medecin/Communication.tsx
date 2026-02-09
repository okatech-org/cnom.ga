import { useState, useRef, useEffect, useMemo } from "react";
import {
    MessageCircle, Users, Search, Plus, Send,
    ArrowLeft, Info, UserPlus, Settings, Hash,
    CircleDot, Clock, ChevronRight, X, Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Conversation, Message, Member, WorkGroup } from "@/types/communication";

// ─── Props ──────────────────────────────────────────────────────────────

interface CommunicationProps {
    conversations: Conversation[];
    messages: Record<string, Message[]>;
    workGroups: WorkGroup[];
    members: Member[];
    currentUserId: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
    en_ligne: "bg-emerald-500",
    absent: "bg-amber-500",
    hors_ligne: "bg-gray-400",
};

const statusLabels: Record<string, string> = {
    en_ligne: "En ligne",
    absent: "Absent",
    hors_ligne: "Hors ligne",
};

const groupTypeLabels: Record<string, string> = {
    travail: "Groupe de travail",
    reflexion: "Groupe de réflexion",
    commission: "Commission",
};

const groupTypeIcons: Record<string, string> = {
    travail: "⚙️",
    reflexion: "💡",
    commission: "🏛️",
};

function formatTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `${diffMin}min`;
    if (diffH < 24) return `${diffH}h`;
    if (diffD < 7) return `${diffD}j`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatFullTime(iso: string): string {
    return new Date(iso).toLocaleString("fr-FR", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

// ─── Sub-components ─────────────────────────────────────────────────────

function MemberAvatar({ member, size = "md" }: { member: Member; size?: "sm" | "md" | "lg" }) {
    const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
    const dotSizes = { sm: "w-2.5 h-2.5", md: "w-3 h-3", lg: "w-3.5 h-3.5" };
    return (
        <div className="relative flex-shrink-0">
            {member.photo_url ? (
                <img src={member.photo_url} alt="" className={cn("rounded-full object-cover", sizeClasses[size])} />
            ) : (
                <div className={cn("rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary", sizeClasses[size])}>
                    {getInitials(`${member.prenoms} ${member.nom}`)}
                </div>
            )}
            <span className={cn("absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-background", dotSizes[size], statusColors[member.status])} />
        </div>
    );
}

function GroupAvatar({ name, color, size = "md" }: { name: string; color?: string; size?: "sm" | "md" | "lg" }) {
    const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
    return (
        <div
            className={cn("rounded-full flex items-center justify-center font-bold text-white", sizeClasses[size])}
            style={{ backgroundColor: color || "#6366F1" }}
        >
            {getInitials(name)}
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────

type FilterType = "all" | "private" | "group";
type MobileView = "list" | "chat" | "info" | "new-group";

const Communication = ({
    conversations: initialConversations,
    messages: initialMessages,
    workGroups,
    members,
    currentUserId,
}: CommunicationProps) => {
    const [conversations, setConversations] = useState(initialConversations);
    const [allMessages, setAllMessages] = useState(initialMessages);
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [messageText, setMessageText] = useState("");
    const [mobileView, setMobileView] = useState<MobileView>("list");
    const [showNewGroup, setShowNewGroup] = useState(false);

    // New group form
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDesc, setNewGroupDesc] = useState("");
    const [newGroupType, setNewGroupType] = useState<"travail" | "reflexion" | "commission">("travail");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const activeConversation = conversations.find((c) => c.id === activeConvId);
    const activeMessages = activeConvId ? allMessages[activeConvId] || [] : [];
    const activeGroup = workGroups.find((g) => g.conversationId === activeConvId);

    // Filter & search
    const filteredConversations = useMemo(() => {
        let result = conversations;
        if (filter === "private") result = result.filter((c) => c.type === "private");
        if (filter === "group") result = result.filter((c) => c.type === "group");
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (c) => c.name?.toLowerCase().includes(q) || c.lastMessage?.content.toLowerCase().includes(q)
            );
        }
        return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [conversations, filter, searchQuery]);

    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

    // Auto-scroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages.length]);

    // Select conversation
    const openConversation = (convId: string) => {
        setActiveConvId(convId);
        setMobileView("chat");
        // Mark as read
        setConversations((prev) =>
            prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
        );
    };

    // Send message
    const sendMessage = () => {
        if (!messageText.trim() || !activeConvId) return;
        const sender = members.find((m) => m.id === currentUserId);
        if (!sender) return;

        const newMsg: Message = {
            id: `msg-${Date.now()}`,
            conversationId: activeConvId,
            senderId: currentUserId,
            senderName: `${sender.prenoms} ${sender.nom}`,
            senderPhoto: sender.photo_url,
            content: messageText.trim(),
            timestamp: new Date().toISOString(),
            status: "sent",
            readBy: [currentUserId],
        };

        setAllMessages((prev) => ({
            ...prev,
            [activeConvId]: [...(prev[activeConvId] || []), newMsg],
        }));
        setConversations((prev) =>
            prev.map((c) =>
                c.id === activeConvId
                    ? { ...c, lastMessage: newMsg, updatedAt: newMsg.timestamp }
                    : c
            )
        );
        setMessageText("");
    };

    // Create group
    const createGroup = () => {
        if (!newGroupName.trim() || selectedMembers.length === 0) {
            toast({ title: "Erreur", description: "Nom et au moins un membre requis.", variant: "destructive" });
            return;
        }

        const convId = `conv-grp-new-${Date.now()}`;
        const groupMembers = members.filter(
            (m) => selectedMembers.includes(m.id) || m.id === currentUserId
        );
        const colors = ["#8B5CF6", "#F59E0B", "#06B6D4", "#EC4899"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const systemMsg: Message = {
            id: `sys-${Date.now()}`,
            conversationId: convId,
            senderId: currentUserId,
            senderName: "Système",
            content: `Groupe "${newGroupName}" créé par Dr. ${members.find((m) => m.id === currentUserId)?.prenoms || ""} ${members.find((m) => m.id === currentUserId)?.nom || ""}`,
            timestamp: new Date().toISOString(),
            status: "read",
            readBy: [currentUserId],
            isSystem: true,
        };

        const newConv: Conversation = {
            id: convId,
            type: "group",
            name: newGroupName,
            participants: groupMembers,
            lastMessage: systemMsg,
            unreadCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            color,
        };

        setConversations((prev) => [newConv, ...prev]);
        setAllMessages((prev) => ({ ...prev, [convId]: [systemMsg] }));

        toast({ title: "Groupe créé", description: `"${newGroupName}" avec ${groupMembers.length} membres.` });

        // Reset form
        setNewGroupName("");
        setNewGroupDesc("");
        setNewGroupType("travail");
        setSelectedMembers([]);
        setShowNewGroup(false);
        setMobileView("list");

        // Open the new group
        openConversation(convId);
    };

    // ─── Conversation List (left panel) ──────────────────────────────────

    const renderConversationList = () => (
        <div className={cn(
            "flex flex-col h-full bg-background border-r border-border",
            "lg:w-[320px] lg:block",
            mobileView === "list" ? "w-full" : "hidden lg:flex"
        )}>
            {/* Header */}
            <div className="p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        <h2 className="font-bold text-lg">Messages</h2>
                        {totalUnread > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">{totalUnread}</Badge>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => { setShowNewGroup(true); setMobileView("new-group"); }}
                        title="Nouveau groupe"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-8 h-9 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1">
                    {(["all", "private", "group"] as FilterType[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                filter === f
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            {f === "all" ? "Tous" : f === "private" ? "Privés" : "Groupes"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversation items */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        Aucune conversation
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const isActive = activeConvId === conv.id;
                        const otherMember = conv.type === "private"
                            ? conv.participants.find((p) => p.id !== currentUserId)
                            : null;
                        return (
                            <button
                                key={conv.id}
                                onClick={() => openConversation(conv.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-border/50",
                                    isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/50"
                                )}
                            >
                                {conv.type === "private" && otherMember ? (
                                    <MemberAvatar member={otherMember} />
                                ) : (
                                    <GroupAvatar name={conv.name || "G"} color={conv.color} />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className={cn("text-sm font-medium truncate", conv.unreadCount > 0 && "font-bold")}>
                                            {conv.name}
                                        </p>
                                        <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                                            {conv.lastMessage && formatTime(conv.lastMessage.timestamp)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {conv.lastMessage?.isSystem ? (
                                                <em>{conv.lastMessage.content}</em>
                                            ) : conv.lastMessage ? (
                                                conv.lastMessage.senderId === currentUserId
                                                    ? `Vous: ${conv.lastMessage.content}`
                                                    : conv.lastMessage.content
                                            ) : (
                                                "Aucun message"
                                            )}
                                        </p>
                                        {conv.unreadCount > 0 && (
                                            <Badge className="bg-primary text-primary-foreground text-[10px] min-w-[18px] h-[18px] justify-center ml-2">
                                                {conv.unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                    {conv.type === "group" && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <Users className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-[10px] text-muted-foreground">{conv.participants.length} membres</span>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );

    // ─── Chat Area (center panel) ─────────────────────────────────────────

    const renderChatArea = () => {
        if (!activeConversation) {
            return (
                <div className={cn(
                    "flex-1 flex flex-col items-center justify-center bg-muted/20",
                    mobileView !== "list" ? "hidden lg:flex" : "hidden lg:flex"
                )}>
                    <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">Sélectionnez une conversation</h3>
                    <p className="text-sm text-muted-foreground/60 mt-1">Choisissez un message ou créez un nouveau groupe</p>
                </div>
            );
        }

        const otherMember = activeConversation.type === "private"
            ? activeConversation.participants.find((p) => p.id !== currentUserId)
            : null;

        return (
            <div className={cn(
                "flex-1 flex flex-col bg-background min-w-0",
                mobileView === "chat" ? "w-full" : "hidden lg:flex"
            )}>
                {/* Chat header */}
                <div className="h-14 px-4 flex items-center gap-3 border-b border-border flex-shrink-0 bg-background">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden h-8 w-8"
                        onClick={() => setMobileView("list")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>

                    {activeConversation.type === "private" && otherMember ? (
                        <MemberAvatar member={otherMember} size="sm" />
                    ) : (
                        <GroupAvatar name={activeConversation.name || "G"} color={activeConversation.color} size="sm" />
                    )}

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{activeConversation.name}</p>
                        {activeConversation.type === "private" && otherMember ? (
                            <p className="text-xs text-muted-foreground">{statusLabels[otherMember.status]} • {otherMember.specialite}</p>
                        ) : (
                            <p className="text-xs text-muted-foreground">{activeConversation.participants.length} membres</p>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setMobileView("info")}
                    >
                        <Info className="w-4 h-4" />
                    </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {activeMessages.map((msg) => {
                        const isMine = msg.senderId === currentUserId;

                        if (msg.isSystem) {
                            return (
                                <div key={msg.id} className="flex justify-center">
                                    <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full italic">
                                        {msg.content}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <div key={msg.id} className={cn("flex gap-2", isMine ? "justify-end" : "justify-start")}>
                                {!isMine && (
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary flex-shrink-0 mt-auto">
                                        {getInitials(msg.senderName)}
                                    </div>
                                )}
                                <div className={cn("max-w-[75%]", isMine ? "items-end" : "items-start")}>
                                    {!isMine && activeConversation.type === "group" && (
                                        <p className="text-[10px] text-muted-foreground mb-0.5 ml-1 font-medium">{msg.senderName.split(" ")[0]}</p>
                                    )}
                                    <div className={cn(
                                        "px-3 py-2 rounded-2xl text-sm leading-relaxed",
                                        isMine
                                            ? "bg-primary text-primary-foreground rounded-br-sm"
                                            : "bg-muted rounded-bl-sm"
                                    )}>
                                        {msg.content}
                                    </div>
                                    <div className={cn("flex items-center gap-1 mt-0.5 px-1", isMine && "justify-end")}>
                                        <span className="text-[10px] text-muted-foreground">{formatFullTime(msg.timestamp)}</span>
                                        {isMine && (
                                            <Check className={cn("w-3 h-3", msg.status === "read" ? "text-primary" : "text-muted-foreground")} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-3 border-t border-border flex-shrink-0 bg-background">
                    <div className="flex items-end gap-2">
                        <Textarea
                            placeholder="Écrire un message..."
                            className="resize-none min-h-[40px] max-h-[120px] text-sm"
                            rows={1}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <Button
                            size="icon"
                            className="h-10 w-10 flex-shrink-0"
                            onClick={sendMessage}
                            disabled={!messageText.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // ─── Info Panel / New Group ──────────────────────────────────────────

    const renderInfoPanel = () => {
        // New group form
        if (showNewGroup || mobileView === "new-group") {
            return (
                <div className={cn(
                    "flex flex-col bg-background border-l border-border",
                    "lg:w-[300px]",
                    mobileView === "new-group" ? "w-full" : "hidden lg:flex"
                )}>
                    <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
                        <h3 className="font-semibold text-sm">Nouveau groupe</h3>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setShowNewGroup(false); setMobileView("list"); }}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom du groupe *</label>
                            <Input
                                placeholder="Ex: Commission Éthique"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className="text-sm"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                            <Textarea
                                placeholder="Objectif du groupe..."
                                value={newGroupDesc}
                                onChange={(e) => setNewGroupDesc(e.target.value)}
                                className="text-sm resize-none"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type de groupe</label>
                            <div className="space-y-1.5">
                                {(["travail", "reflexion", "commission"] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setNewGroupType(t)}
                                        className={cn(
                                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                                            newGroupType === t ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 hover:bg-muted"
                                        )}
                                    >
                                        <span>{groupTypeIcons[t]}</span>
                                        <span>{groupTypeLabels[t]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                Membres ({selectedMembers.length} sélectionné{selectedMembers.length > 1 ? "s" : ""})
                            </label>
                            <div className="space-y-1.5">
                                {members.filter((m) => m.id !== currentUserId).map((m) => {
                                    const selected = selectedMembers.includes(m.id);
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() =>
                                                setSelectedMembers((prev) =>
                                                    selected ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                                                )
                                            }
                                            className={cn(
                                                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                                                selected ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted"
                                            )}
                                        >
                                            <MemberAvatar member={m} size="sm" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">Dr. {m.prenoms} {m.nom}</p>
                                                <p className="text-[10px] text-muted-foreground">{m.specialite}</p>
                                            </div>
                                            {selected && <Check className="w-4 h-4 text-primary" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-border flex-shrink-0">
                        <Button className="w-full gap-2" onClick={createGroup} disabled={!newGroupName.trim() || selectedMembers.length === 0}>
                            <UserPlus className="w-4 h-4" />
                            Créer le groupe
                        </Button>
                    </div>
                </div>
            );
        }

        // Info panel for active conversation
        if (!activeConversation) return null;

        const isGroup = activeConversation.type === "group";
        const otherMember = !isGroup
            ? activeConversation.participants.find((p) => p.id !== currentUserId)
            : null;

        return (
            <div className={cn(
                "flex flex-col bg-background border-l border-border",
                "lg:w-[300px]",
                mobileView === "info" ? "w-full" : "hidden lg:flex"
            )}>
                <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
                    <h3 className="font-semibold text-sm">Informations</h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={() => setMobileView("chat")}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {/* Avatar + name */}
                    <div className="flex flex-col items-center text-center mb-6">
                        {isGroup ? (
                            <GroupAvatar name={activeConversation.name || "G"} color={activeConversation.color} size="lg" />
                        ) : otherMember ? (
                            <MemberAvatar member={otherMember} size="lg" />
                        ) : null}
                        <h4 className="font-bold text-base mt-3">{activeConversation.name}</h4>
                        {isGroup && activeGroup && (
                            <span className="text-xs text-muted-foreground mt-1">
                                {groupTypeIcons[activeGroup.type]} {groupTypeLabels[activeGroup.type]}
                            </span>
                        )}
                        {!isGroup && otherMember && (
                            <>
                                <p className="text-sm text-muted-foreground mt-1">{otherMember.specialite}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className={cn("w-2 h-2 rounded-full", statusColors[otherMember.status])} />
                                    <span className="text-xs text-muted-foreground">{statusLabels[otherMember.status]}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Group description */}
                    {isGroup && activeGroup?.description && (
                        <div className="mb-6">
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</h5>
                            <p className="text-sm text-foreground/80 leading-relaxed">{activeGroup.description}</p>
                        </div>
                    )}

                    {/* Members list */}
                    <div>
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            {isGroup ? `Membres (${activeConversation.participants.length})` : "Profil"}
                        </h5>
                        <div className="space-y-2">
                            {activeConversation.participants.map((p) => (
                                <div key={p.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                    <MemberAvatar member={p} size="sm" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            Dr. {p.prenoms} {p.nom}
                                            {p.id === currentUserId && <span className="text-xs text-muted-foreground ml-1">(Vous)</span>}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">{p.specialite}</p>
                                    </div>
                                    <span className={cn("w-2 h-2 rounded-full flex-shrink-0", statusColors[p.status])} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ─── Render ──────────────────────────────────────────────────────────

    return (
        <div className="space-y-4">
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex h-[calc(100vh-200px)] min-h-[500px]">
                        {renderConversationList()}
                        {renderChatArea()}
                        {renderInfoPanel()}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Communication;
