"use client";
import Head from "next/head";
import CameraList from "../components/CameraList";

export default function Home() {
  return (
    <>
      <Head>
        <title>Camera Dashboard</title>
        <meta
          name="description"
          content="Modern Camera Dashboard with analytics, search, and real-time updates."
        />
        <meta property="og:title" content="Camera Dashboard" />
        <meta
          property="og:description"
          content="Modern Camera Dashboard with analytics, search, and real-time updates."
        />
        <meta property="og:type" content="website" />
      </Head>
      <CameraList />
    </>
  );
}
