"use client";

import { DefaultView } from "@/components/v2/default-view";
import { useThreadsSWR } from "@/hooks/useThreadsSWR";
import { GitHubAppProvider, useGitHubAppProvider } from "@/providers/GitHubApp";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, useEffect } from "react";
import { MANAGER_GRAPH_ID } from "@open-swe/shared/constants";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function ChatPageComponent() {
  const { currentInstallation, checkInstallation } = useGitHubAppProvider();
  const { threads, isLoading: threadsLoading } = useThreadsSWR({
    assistantId: MANAGER_GRAPH_ID,
    currentInstallation,
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if we're returning from GitHub App installation
    if (searchParams.get("installation_completed")) {
      // Refresh installation status
      checkInstallation();
      
      // Clean up the URL by removing the query parameter
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, checkInstallation, router]);

  if (!threads) {
    return <div>No threads</div>;
  }

  return (
    <div className="bg-background h-screen">
      <Suspense>
        <Toaster />
        <DefaultView
          threads={threads}
          threadsLoading={threadsLoading}
        />
      </Suspense>
    </div>
  );
}

export default function ChatPage() {
  return (
    <GitHubAppProvider>
      <Suspense>
        <ChatPageComponent />
      </Suspense>
    </GitHubAppProvider>
  );
}
