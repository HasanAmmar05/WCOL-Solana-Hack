"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clpispdty00ycl80fpueukbhl"}
      config={{
        loginMethods: ["email"],
        appearance: {
          theme: "dark",
          accentColor: "#14F195",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/FIFA_World_Cup_2026_logo.svg/1200px-FIFA_World_Cup_2026_logo.svg.png",
        },
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
