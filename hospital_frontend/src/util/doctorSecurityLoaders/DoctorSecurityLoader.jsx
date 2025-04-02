import { redirect } from "react-router-dom";
import useAuth from "../useAuth";

export async function DoctorSecurityLoader() {
  const verifiedUser = await useAuth();
  if (
    !(
      verifiedUser.response &&
      (verifiedUser.role === "Super-Admin" || verifiedUser.role === "Admin")
    )
  ) {
    console.log("Unauthorized Access - Redirecting");
    return redirect("/users/dashboard");
  }

  return null;
}
