import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDemo } from "@/contexts/DemoContext";

interface NotificationCounts {
  [key: string]: number;
}

interface UseRealtimeNotificationsOptions {
  role: string;
}

// Demo counts for demonstration mode
const DEMO_COUNTS: Record<string, NotificationCounts> = {
  admin: { inscriptions: 12, paiements: 8 },
  president: { validations: 5 },
  sg: { inscriptions: 8 },
  tresorier: { recouvrement: 23 },
  agent: { verification: 15, paiements: 7 },
  commission: { validation: 7 },
  regional: {},
  medecin: { paiements: 2 },
};

export const useRealtimeNotifications = ({ role }: UseRealtimeNotificationsOptions) => {
  const [counts, setCounts] = useState<NotificationCounts>({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isDemoMode } = useDemo();

  const fetchCounts = useCallback(async () => {
    if (isDemoMode) {
      setCounts(DEMO_COUNTS[role] || {});
      setUnreadCount(3); // Demo unread count
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch pending counts using the database function
      const { data, error } = await supabase.rpc("get_pending_counts", {
        user_role: role,
      });

      if (error) {
        console.error("Error fetching counts:", error);
        setCounts({});
      } else if (data && typeof data === "object" && !Array.isArray(data)) {
        // Cast the JSON response to our expected type
        const countsData = data as Record<string, number>;
        setCounts(countsData);
      } else {
        setCounts({});
      }

      // Fetch unread notifications count
      const { count, error: notifError } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      if (!notifError) {
        setUnreadCount(count || 0);
      }
    } catch (err) {
      console.error("Error in fetchCounts:", err);
    } finally {
      setLoading(false);
    }
  }, [user, role, isDemoMode]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Set up realtime subscription for applications changes
  useEffect(() => {
    if (isDemoMode || !user) return;

    const channel = supabase
      .channel("dashboard-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
        },
        () => {
          // Refetch counts when applications change
          fetchCounts();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
        },
        () => {
          // Refetch counts when payments change
          fetchCounts();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        () => {
          // Refetch unread count when new notification arrives
          fetchCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isDemoMode, fetchCounts]);

  const markAsRead = async (notificationId: string) => {
    if (isDemoMode) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (!error) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (isDemoMode) {
      setUnreadCount(0);
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    if (!error) {
      setUnreadCount(0);
    }
  };

  const refreshCounts = () => {
    fetchCounts();
  };

  return {
    counts,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshCounts,
  };
};

export default useRealtimeNotifications;
