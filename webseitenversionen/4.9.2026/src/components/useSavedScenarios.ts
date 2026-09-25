import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CalculatorId = "rurup" | "sparerpauschbetrag" | "immobilien" | "depot";

export interface SavedScenario {
  id: string;
  calculator: CalculatorId;
  name: string;
  inputs: Record<string, unknown>;
  results: Record<string, unknown>;
  updated_at: string;
}

interface UseSavedScenariosState {
  scenarios: SavedScenario[];
  loading: boolean;
  error: string | null;
  save: (name: string, inputs: Record<string, unknown>, results: Record<string, unknown>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  rename: (id: string, name: string) => Promise<void>;
}

/**
 * Persistiert Rechner-Szenarien in `public.saved_scenarios` (Migration
 * 202609250003). Die RLS-Policies erlauben ausschließlich Zugriff auf die eigene
 * user_id, deshalb wird clientseitig keine user_id mitgeschickt.
 *
 * Ohne angemeldete Sitzung bleiben die Szenarien im Arbeitsspeicher: der
 * Rechner funktioniert laut Startseite komplett ohne Konto.
 */
export function useSavedScenarios(
  supabase: SupabaseClient | null,
  calculator: CalculatorId,
): UseSavedScenariosState {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from("saved_scenarios")
      .select("id, calculator, name, inputs, results, updated_at")
      .eq("calculator", calculator)
      .order("updated_at", { ascending: false })
      .limit(20);
    if (queryError) {
      setError(queryError.message);
      setScenarios([]);
    } else {
      setScenarios((data ?? []) as SavedScenario[]);
    }
    setLoading(false);
  }, [supabase, calculator]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(
    async (name: string, inputs: Record<string, unknown>, results: Record<string, unknown>) => {
      const trimmed = name.trim().slice(0, 60);
      if (!supabase || !trimmed) return;
      setError(null);
      const { error: insertError } = await supabase.from("saved_scenarios").insert({
        calculator,
        name: trimmed,
        inputs,
        results,
        updated_at: new Date().toISOString(),
      });
      if (insertError) {
        setError(insertError.message);
        return;
      }
      await load();
    },
    [supabase, calculator, load],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!supabase) return;
      setError(null);
      const { error: deleteError } = await supabase.from("saved_scenarios").delete().eq("id", id);
      if (deleteError) {
        setError(deleteError.message);
        return;
      }
      await load();
    },
    [supabase, load],
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      const trimmed = name.trim().slice(0, 60);
      if (!supabase || !trimmed) return;
      setError(null);
      const { error: updateError } = await supabase
        .from("saved_scenarios")
        .update({ name: trimmed, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      await load();
    },
    [supabase, load],
  );

  return { scenarios, loading, error, save, remove, rename };
}
