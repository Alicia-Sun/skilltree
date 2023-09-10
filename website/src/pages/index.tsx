import { useLoginContext } from "@/context/LoginContext";
import { useEffect } from "react";

export default function Home() {
  const user = useLoginContext();

  useEffect(() => {
    if (user.isLoggedIn) {
      window.location.href = "/app";
    } else {
      window.location.href = "/login";
    }
  }, [user.isLoggedIn]);

  return null;
}
