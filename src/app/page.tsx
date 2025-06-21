"use client";
// to redirect to cameras page
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cameras");  
  }, [router]);

  return null;
}
