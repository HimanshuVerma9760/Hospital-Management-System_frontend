import { redirect } from "react-router-dom";
import useAuth from "../useAuth";

export async function RouteAuthLoader() {
  const verifiedUser = await useAuth();
  if (!verifiedUser.response) {
    console.log("Unauthorized Access - Logging out");
    localStorage.removeItem("token");
    return redirect("/");
  }
  return {
    user: verifiedUser,
  };
}
