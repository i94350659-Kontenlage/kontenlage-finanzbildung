-- Kontolage · P2-01 · Umbenennen gespeicherter Szenarien
--
-- Zweck: Der Client darf ein gespeichertes Szenario umbenennen (useSavedScenarios
-- .rename). RLS allein erlaubt bei einem update aber jedes Feld, auch user_id,
-- calculator oder inputs. Deshalb wird das Tabellen-Update-Recht entzogen und
-- nur auf die zwei veränderlichen Spalten wieder erteilt.
--
-- Effekt: Ein manipulierter Client kann zwar noch die Zeile eines fremden
-- Nutzers ansteuern, scheitert aber an der USING-Policy; die eigene Zeile lässt
-- sich nur in name/updated_at ändern. Upserts (insert) bleiben unberührt.

-- Volles Update für authenticated entziehen, danach gezielt wieder erlauben.
revoke update on public.saved_scenarios from authenticated;
grant update (name, updated_at) on public.saved_scenarios to authenticated;

-- Für den Service-Role-Pfad (Admin/Edge Functions) bleibt alles möglich.
grant update on public.saved_scenarios to service_role;
