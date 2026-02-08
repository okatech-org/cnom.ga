import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDemo } from "@/contexts/DemoContext";
import type { Database } from "@/integrations/supabase/types";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

export interface DashboardProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  province: string;
  ville: string;
  numero_ordre: string | null;
  secteur: string;
}

export interface DashboardApplication {
  id: string;
  profile_id: string;
  numero_dossier: string | null;
  status: ApplicationStatus;
  submission_date: string | null;
  validation_date: string | null;
  rejection_reason: string | null;
  created_at: string;
  profile?: DashboardProfile;
}

export interface DashboardPayment {
  id: string;
  profile_id: string;
  amount: number;
  payment_type: string;
  payment_status: PaymentStatus;
  created_at: string;
  paid_at: string | null;
  profile?: DashboardProfile;
}

interface DashboardStats {
  totalProfiles: number;
  activeProfiles: number;
  suspendedProfiles: number;
  pendingApplications: number;
  validatedApplications: number;
  rejectedApplications: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
}

// Mock data for demo mode
const MOCK_PROFILES: DashboardProfile[] = [
  { id: "1", nom: "NZOGHE", prenom: "Jean-Pierre", email: "nzoghe@mail.com", specialite: "Médecine Générale", province: "Estuaire", ville: "Libreville", numero_ordre: "1842", secteur: "prive" },
  { id: "2", nom: "MBOUMBA", prenom: "Marie", email: "mboumba@mail.com", specialite: "Cardiologie", province: "Estuaire", ville: "Libreville", numero_ordre: "1843", secteur: "public" },
  { id: "3", nom: "OBAME", prenom: "Paul", email: "obame@mail.com", specialite: "Pédiatrie", province: "Ogooué-Maritime", ville: "Port-Gentil", numero_ordre: "1844", secteur: "mixte" },
  { id: "4", nom: "NDONG", prenom: "Georgette", email: "ndong@mail.com", specialite: "Gynécologie", province: "Estuaire", ville: "Libreville", numero_ordre: "1845", secteur: "public" },
  { id: "5", nom: "ELLA", prenom: "François", email: "ella@mail.com", specialite: "Chirurgie", province: "Haut-Ogooué", ville: "Franceville", numero_ordre: null, secteur: "prive" },
];

const MOCK_APPLICATIONS: DashboardApplication[] = [
  { id: "a1", profile_id: "1", numero_dossier: "INS-2026-00045", status: "validated", submission_date: "2026-01-15", validation_date: "2026-02-01", rejection_reason: null, created_at: "2026-01-10" },
  { id: "a2", profile_id: "2", numero_dossier: "INS-2026-00046", status: "under_review", submission_date: "2026-02-05", validation_date: null, rejection_reason: null, created_at: "2026-02-03" },
  { id: "a3", profile_id: "3", numero_dossier: "INS-2026-00047", status: "submitted", submission_date: "2026-02-06", validation_date: null, rejection_reason: null, created_at: "2026-02-04" },
  { id: "a4", profile_id: "4", numero_dossier: "INS-2026-00048", status: "validated", submission_date: "2026-01-20", validation_date: "2026-02-05", rejection_reason: null, created_at: "2026-01-18" },
  { id: "a5", profile_id: "5", numero_dossier: "INS-2026-00049", status: "rejected", submission_date: "2026-01-25", validation_date: "2026-02-02", rejection_reason: "Documents incomplets", created_at: "2026-01-22" },
];

const MOCK_PAYMENTS: DashboardPayment[] = [
  { id: "p1", profile_id: "1", amount: 150000, payment_type: "inscription", payment_status: "completed", created_at: "2026-01-15", paid_at: "2026-01-15" },
  { id: "p2", profile_id: "2", amount: 150000, payment_type: "inscription", payment_status: "pending", created_at: "2026-02-05", paid_at: null },
  { id: "p3", profile_id: "1", amount: 75000, payment_type: "cotisation_semestrielle", payment_status: "completed", created_at: "2026-02-01", paid_at: "2026-02-01" },
  { id: "p4", profile_id: "4", amount: 150000, payment_type: "inscription", payment_status: "completed", created_at: "2026-01-20", paid_at: "2026-01-20" },
  { id: "p5", profile_id: "3", amount: 150000, payment_type: "inscription", payment_status: "pending", created_at: "2026-02-06", paid_at: null },
];

export const useDashboardData = () => {
  const { isDemoMode } = useDemo();
  const [profiles, setProfiles] = useState<DashboardProfile[]>([]);
  const [applications, setApplications] = useState<DashboardApplication[]>([]);
  const [payments, setPayments] = useState<DashboardPayment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProfiles: 0,
    activeProfiles: 0,
    suspendedProfiles: 0,
    pendingApplications: 0,
    validatedApplications: 0,
    rejectedApplications: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    if (isDemoMode) {
      // Use mock data in demo mode
      const enrichedApplications = MOCK_APPLICATIONS.map(app => ({
        ...app,
        profile: MOCK_PROFILES.find(p => p.id === app.profile_id),
      }));

      const enrichedPayments = MOCK_PAYMENTS.map(pay => ({
        ...pay,
        profile: MOCK_PROFILES.find(p => p.id === pay.profile_id),
      }));

      setProfiles(MOCK_PROFILES);
      setApplications(enrichedApplications);
      setPayments(enrichedPayments);

      // Calculate stats from mock data
      setStats({
        totalProfiles: MOCK_PROFILES.length,
        activeProfiles: MOCK_PROFILES.filter(p => p.numero_ordre).length,
        suspendedProfiles: 0,
        pendingApplications: MOCK_APPLICATIONS.filter(a => ["submitted", "under_review"].includes(a.status)).length,
        validatedApplications: MOCK_APPLICATIONS.filter(a => a.status === "validated").length,
        rejectedApplications: MOCK_APPLICATIONS.filter(a => a.status === "rejected").length,
        totalPayments: MOCK_PAYMENTS.length,
        completedPayments: MOCK_PAYMENTS.filter(p => p.payment_status === "completed").length,
        pendingPayments: MOCK_PAYMENTS.filter(p => p.payment_status === "pending").length,
        totalRevenue: MOCK_PAYMENTS.filter(p => p.payment_status === "completed").reduce((sum, p) => sum + p.amount, 0),
      });

      setLoading(false);
      return;
    }

    try {
      // Fetch real data from Supabase
      const [profilesRes, applicationsRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("id, nom, prenom, email, specialite, province, ville, numero_ordre, secteur"),
        supabase.from("applications").select("*"),
        supabase.from("payments").select("*"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (applicationsRes.error) throw applicationsRes.error;
      if (paymentsRes.error) throw paymentsRes.error;

      const fetchedProfiles = (profilesRes.data || []) as DashboardProfile[];
      const fetchedApplications = (applicationsRes.data || []) as DashboardApplication[];
      const fetchedPayments = (paymentsRes.data || []) as DashboardPayment[];

      // Enrich applications with profile data
      const enrichedApps = fetchedApplications.map(app => ({
        ...app,
        profile: fetchedProfiles.find(p => p.id === app.profile_id),
      }));

      // Enrich payments with profile data
      const enrichedPays = fetchedPayments.map(pay => ({
        ...pay,
        profile: fetchedProfiles.find(p => p.id === pay.profile_id),
      }));

      setProfiles(fetchedProfiles);
      setApplications(enrichedApps);
      setPayments(enrichedPays);

      // Calculate stats
      setStats({
        totalProfiles: fetchedProfiles.length,
        activeProfiles: fetchedProfiles.filter(p => p.numero_ordre).length,
        suspendedProfiles: 0,
        pendingApplications: fetchedApplications.filter(a => ["submitted", "under_review"].includes(a.status)).length,
        validatedApplications: fetchedApplications.filter(a => a.status === "validated").length,
        rejectedApplications: fetchedApplications.filter(a => a.status === "rejected").length,
        totalPayments: fetchedPayments.length,
        completedPayments: fetchedPayments.filter(p => p.payment_status === "completed").length,
        pendingPayments: fetchedPayments.filter(p => p.payment_status === "pending").length,
        totalRevenue: fetchedPayments.filter(p => p.payment_status === "completed").reduce((sum, p) => sum + Number(p.amount), 0),
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Erreur lors du chargement des données");
      // Fallback to mock data on error
      setProfiles(MOCK_PROFILES);
      setApplications(MOCK_APPLICATIONS);
      setPayments(MOCK_PAYMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isDemoMode]);

  return {
    profiles,
    applications,
    payments,
    stats,
    loading,
    error,
    refetch: fetchData,
  };
};

export const useApplicationActions = () => {
  const { isDemoMode } = useDemo();

  const validateApplication = async (applicationId: string, orderNumber: string) => {
    if (isDemoMode) {
      // Simulate success in demo mode
      return { success: true, message: "Dossier validé avec succès (mode démo)" };
    }

    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: "validated" as ApplicationStatus,
          validation_date: new Date().toISOString(),
        })
        .eq("id", applicationId);

      if (error) throw error;

      return { success: true, message: "Dossier validé avec succès" };
    } catch (err) {
      console.error("Validation error:", err);
      return { success: false, message: "Erreur lors de la validation" };
    }
  };

  const rejectApplication = async (applicationId: string, reason: string) => {
    if (isDemoMode) {
      return { success: true, message: "Dossier rejeté (mode démo)" };
    }

    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: "rejected" as ApplicationStatus,
          validation_date: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq("id", applicationId);

      if (error) throw error;

      return { success: true, message: "Dossier rejeté" };
    } catch (err) {
      console.error("Rejection error:", err);
      return { success: false, message: "Erreur lors du rejet" };
    }
  };

  const startReview = async (applicationId: string) => {
    if (isDemoMode) {
      return { success: true, message: "Examen démarré (mode démo)" };
    }

    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: "under_review" as ApplicationStatus })
        .eq("id", applicationId);

      if (error) throw error;

      return { success: true, message: "Examen démarré" };
    } catch (err) {
      console.error("Start review error:", err);
      return { success: false, message: "Erreur" };
    }
  };

  return { validateApplication, rejectApplication, startReview };
};
