"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const loggedInUser = localStorage.getItem("loggedInUser");
      console.log({loggedInUser});
      if (!loggedInUser) {
        router.push("/auth/login");
      }
    }
  }, [isClient, router]);

  if (!isClient) {
    return null; // Hoặc một spinner loading
  }

  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    return null; // Đang trong quá trình chuyển hướng
  }

  return <>{children}</>;
};

export default PrivateRoute;