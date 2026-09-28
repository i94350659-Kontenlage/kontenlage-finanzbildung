import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export type SubscriptionPlan = "basis" | "starter" | "pro" | "executive";
export type SubscriptionStatus = "active" | "trialing" | "canceling" | "past_due" | "canceled" | "inactive";

export type SubscriptionData = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_end: string | null;
};

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }
    try {
      const { data: sub, error } = await supabase
        .from("subscriptions")
        .select("plan, status, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && sub) {
        setData({
          plan: (sub.plan as SubscriptionPlan) || "basis",
          status: (sub.status as SubscriptionStatus) || "inactive",
          current_period_end: sub.current_period_end || null,
        });
      } else {
        setData({
          plan: "basis",
          status: "inactive",
          current_period_end: null,
        });
      }
    } catch {
      setData({
        plan: "basis",
        status: "inactive",
        current_period_end: null,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      void fetchSubscription();
    }
  }, [authLoading, fetchSubscription]);

  const isActive = !!data && ["active", "trialing", "canceling"].includes(data.status);
  const plan: SubscriptionPlan = isActive ? data.plan : "basis";
  const isStarter = isActive && ["starter", "pro", "executive"].includes(plan);
  const isPro = isActive && ["pro", "executive"].includes(plan);
  const isExecutive = isActive && plan === "executive";

  return {
    subscription: data,
    plan,
    status: data?.status || null,
    isActive,
    isStarter,
    isPro,
    isExecutive,
    loading: authLoading || loading,
    refresh: fetchSubscription,
  };
}
