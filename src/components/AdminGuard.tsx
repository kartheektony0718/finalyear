import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;

};

export default AdminGuard;