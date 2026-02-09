// lib/demo-communication-data.ts — Demo data for internal communication system

import type { Member, Message, Conversation, WorkGroup } from "@/types/communication";

// ─── Membres fictifs (confrères) ─────────────────────────────────────────

export const DEMO_MEMBERS: Member[] = [
    {
        id: "m-current",
        nom: "DANSOU OGANDAGA",
        prenoms: "Jean Davy",
        specialite: "Médecine Générale",
        photo_url: undefined, // current user — uses actual photo
        status: "en_ligne",
        numero_ordre: 1547,
        derniere_connexion: new Date().toISOString(),
    },
    {
        id: "m-001",
        nom: "MOUSSAVOU",
        prenoms: "Éric",
        specialite: "Cardiologie",
        status: "en_ligne",
        numero_ordre: 892,
        derniere_connexion: new Date().toISOString(),
    },
    {
        id: "m-002",
        nom: "NZOGHE NGUEMA",
        prenoms: "Claire",
        specialite: "Pédiatrie",
        status: "absent",
        numero_ordre: 1203,
        derniere_connexion: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: "m-003",
        nom: "ONDO MBA",
        prenoms: "Patrick",
        specialite: "Chirurgie Générale",
        status: "en_ligne",
        numero_ordre: 654,
        derniere_connexion: new Date().toISOString(),
    },
    {
        id: "m-004",
        nom: "MINTSA MI OWONO",
        prenoms: "Stéphanie",
        specialite: "Gynécologie-Obstétrique",
        status: "hors_ligne",
        numero_ordre: 1089,
        derniere_connexion: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: "m-005",
        nom: "BIBANG BI OBAME",
        prenoms: "Théophile",
        specialite: "Anesthésie-Réanimation",
        status: "en_ligne",
        numero_ordre: 1456,
        derniere_connexion: new Date().toISOString(),
    },
];

const currentUser = DEMO_MEMBERS[0];

// Helper: create a message
const msg = (
    id: string,
    convId: string,
    senderId: string,
    content: string,
    minutesAgo: number,
    isSystem = false
): Message => {
    const sender = DEMO_MEMBERS.find((m) => m.id === senderId) || currentUser;
    return {
        id,
        conversationId: convId,
        senderId,
        senderName: `${sender.prenoms} ${sender.nom}`,
        senderPhoto: sender.photo_url,
        content,
        timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString(),
        status: senderId === "m-current" ? "read" : "delivered",
        readBy: senderId === "m-current" ? [senderId] : [senderId, "m-current"],
        isSystem,
    };
};

// ─── Conversations privées ───────────────────────────────────────────────

const privateMessages1: Message[] = [
    msg("pm1-1", "conv-priv-1", "m-001", "Bonjour Dr. Dansou, j'ai un patient avec une arythmie complexe. Pouvez-vous me recommander un protocole ?", 120),
    msg("pm1-2", "conv-priv-1", "m-current", "Bonjour Dr. Moussavou ! Bien sûr, envoyez-moi l'ECG et je vous donne mon avis.", 115),
    msg("pm1-3", "conv-priv-1", "m-001", "Merci beaucoup, je vous envoie les résultats cet après-midi.", 110),
    msg("pm1-4", "conv-priv-1", "m-current", "Parfait, je serai disponible à partir de 14h.", 105),
    msg("pm1-5", "conv-priv-1", "m-001", "J'ai envoyé l'ECG par email. Le patient présente une FA paroxystique. Qu'en pensez-vous ?", 45),
];

const privateMessages2: Message[] = [
    msg("pm2-1", "conv-priv-2", "m-002", "Dr. Dansou, nous avons un cas pédiatrique qui nécessite un avis pluridisciplinaire.", 360),
    msg("pm2-2", "conv-priv-2", "m-current", "Je suis disponible demain matin pour en discuter. Quel est le tableau clinique ?", 350),
    msg("pm2-3", "conv-priv-2", "m-002", "Un enfant de 8 ans avec fièvre persistante et hépatosplénomégalie. Bilan en cours.", 340),
];

const privateMessages3: Message[] = [
    msg("pm3-1", "conv-priv-3", "m-003", "Bonjour confrère, la réunion du comité d'éthique est reportée au 15 février.", 1440),
    msg("pm3-2", "conv-priv-3", "m-current", "Bien noté, merci pour l'information. Le nouveau créneau me convient.", 1430),
];

// ─── Messages de groupe ──────────────────────────────────────────────────

const groupMessages1: Message[] = [
    msg("gm1-0", "conv-grp-1", "m-003", "Le Dr. Dansou Ogandaga a rejoint le groupe", 4320, true),
    msg("gm1-1", "conv-grp-1", "m-003", "Chers confrères, je propose que nous abordions la question de la télémédecine lors de notre prochaine session.", 2880),
    msg("gm1-2", "conv-grp-1", "m-004", "Excellente idée. La télémédecine soulève des questions éthiques importantes, notamment sur le consentement éclairé à distance.", 2800),
    msg("gm1-3", "conv-grp-1", "m-current", "Je suis d'accord. Je peux préparer une présentation sur le cadre réglementaire actuel au Gabon.", 2750),
    msg("gm1-4", "conv-grp-1", "m-001", "Pensons aussi à inviter un juriste spécialisé en droit de la santé.", 2700),
    msg("gm1-5", "conv-grp-1", "m-003", "Très bonne suggestion. Je me charge de contacter Me. Obame du Barreau de Libreville.", 180),
];

const groupMessages2: Message[] = [
    msg("gm2-1", "conv-grp-2", "m-002", "Alerte : cas de réaction indésirable sévère avec le lot AB-2024-0547 signalé au CHU de Libreville.", 720),
    msg("gm2-2", "conv-grp-2", "m-005", "J'ai eu un cas similaire la semaine dernière. Je rédige le formulaire CRPV.", 700),
    msg("gm2-3", "conv-grp-2", "m-current", "Nous devrions compiler tous les signalements et transmettre un rapport consolidé à l'ABRP.", 680),
    msg("gm2-4", "conv-grp-2", "m-002", "D'accord. J'ai 3 signalements de mon service. Je les partage ici.", 30),
];

const groupMessages3: Message[] = [
    msg("gm3-1", "conv-grp-3", "m-current", "Bienvenue dans le Think Tank Santé Digitale ! L'objectif est de réfléchir à la transformation numérique du système de santé gabonais.", 10080),
    msg("gm3-2", "conv-grp-3", "m-005", "Merci pour l'initiative. Je propose qu'on commence par un état des lieux du dossier médical électronique.", 9900),
    msg("gm3-3", "conv-grp-3", "m-001", "Le DMP est un sujet crucial. Au CHU on utilise encore des dossiers papier pour 80% des patients.", 9800),
    msg("gm3-4", "conv-grp-3", "m-004", "Il faudrait aussi aborder l'interopérabilité entre les différents systèmes hospitaliers.", 5000),
    msg("gm3-5", "conv-grp-3", "m-current", "Excellente remarque. Je prépare un document de référence sur les standards HL7/FHIR adaptés au contexte africain.", 4900),
    msg("gm3-6", "conv-grp-3", "m-005", "J'ai trouvé un rapport de l'OMS sur la santé digitale en Afrique subsaharienne. Je le partage.", 60),
];

// ─── Conversations ─────────────────────────────────────────────────────

export const DEMO_CONVERSATIONS: Conversation[] = [
    {
        id: "conv-priv-1",
        type: "private",
        name: "Dr. Éric MOUSSAVOU",
        participants: [currentUser, DEMO_MEMBERS[1]],
        lastMessage: privateMessages1[privateMessages1.length - 1],
        unreadCount: 1,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: privateMessages1[privateMessages1.length - 1].timestamp,
    },
    {
        id: "conv-priv-2",
        type: "private",
        name: "Dr. Claire NZOGHE NGUEMA",
        participants: [currentUser, DEMO_MEMBERS[2]],
        lastMessage: privateMessages2[privateMessages2.length - 1],
        unreadCount: 0,
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        updatedAt: privateMessages2[privateMessages2.length - 1].timestamp,
    },
    {
        id: "conv-priv-3",
        type: "private",
        name: "Dr. Patrick ONDO MBA",
        participants: [currentUser, DEMO_MEMBERS[3]],
        lastMessage: privateMessages3[privateMessages3.length - 1],
        unreadCount: 0,
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: privateMessages3[privateMessages3.length - 1].timestamp,
    },
    {
        id: "conv-grp-1",
        type: "group",
        name: "Commission Éthique",
        participants: [currentUser, DEMO_MEMBERS[1], DEMO_MEMBERS[3], DEMO_MEMBERS[4]],
        lastMessage: groupMessages1[groupMessages1.length - 1],
        unreadCount: 2,
        createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
        updatedAt: groupMessages1[groupMessages1.length - 1].timestamp,
        color: "#3B82F6",
    },
    {
        id: "conv-grp-2",
        type: "group",
        name: "Pharmacovigilance",
        participants: [currentUser, DEMO_MEMBERS[2], DEMO_MEMBERS[5]],
        lastMessage: groupMessages2[groupMessages2.length - 1],
        unreadCount: 1,
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        updatedAt: groupMessages2[groupMessages2.length - 1].timestamp,
        color: "#EF4444",
    },
    {
        id: "conv-grp-3",
        type: "group",
        name: "Think Tank Santé Digitale",
        participants: [currentUser, DEMO_MEMBERS[1], DEMO_MEMBERS[4], DEMO_MEMBERS[5]],
        lastMessage: groupMessages3[groupMessages3.length - 1],
        unreadCount: 1,
        createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
        updatedAt: groupMessages3[groupMessages3.length - 1].timestamp,
        color: "#10B981",
    },
];

// ─── Messages indexed by conversation ─────────────────────────────────

export const DEMO_MESSAGES: Record<string, Message[]> = {
    "conv-priv-1": privateMessages1,
    "conv-priv-2": privateMessages2,
    "conv-priv-3": privateMessages3,
    "conv-grp-1": groupMessages1,
    "conv-grp-2": groupMessages2,
    "conv-grp-3": groupMessages3,
};

// ─── Groupes de travail ──────────────────────────────────────────────────

export const DEMO_WORK_GROUPS: WorkGroup[] = [
    {
        id: "wg-001",
        name: "Commission Éthique",
        description: "Commission chargée d'examiner les questions éthiques liées à la pratique médicale au Gabon, incluant la télémédecine, le consentement éclairé et la recherche clinique.",
        type: "commission",
        members: [currentUser, DEMO_MEMBERS[1], DEMO_MEMBERS[3], DEMO_MEMBERS[4]],
        admins: ["m-003"],
        conversationId: "conv-grp-1",
        createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
        color: "#3B82F6",
        isArchived: false,
    },
    {
        id: "wg-002",
        name: "Pharmacovigilance",
        description: "Groupe de travail dédié au suivi des effets indésirables médicamenteux et à la coordination des signalements auprès des autorités sanitaires.",
        type: "travail",
        members: [currentUser, DEMO_MEMBERS[2], DEMO_MEMBERS[5]],
        admins: ["m-002"],
        conversationId: "conv-grp-2",
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        color: "#EF4444",
        isArchived: false,
    },
    {
        id: "wg-003",
        name: "Think Tank Santé Digitale",
        description: "Groupe de réflexion sur la transformation numérique du système de santé gabonais : DMP, télémédecine, interopérabilité des systèmes, IA médicale.",
        type: "reflexion",
        members: [currentUser, DEMO_MEMBERS[1], DEMO_MEMBERS[4], DEMO_MEMBERS[5]],
        admins: ["m-current"],
        conversationId: "conv-grp-3",
        createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
        color: "#10B981",
        isArchived: false,
    },
];
