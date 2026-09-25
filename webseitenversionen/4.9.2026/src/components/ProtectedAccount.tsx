import RequireAuth from "./RequireAuth";
import Account from "../pages/Account";

export default function ProtectedAccount() {
  return <RequireAuth><Account /></RequireAuth>;
}
