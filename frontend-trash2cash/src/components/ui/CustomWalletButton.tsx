import { ConnectButton } from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";

const Icons = dynamic(() => import("@/components/ui/Icons"), {
  ssr: false,
  loading: () => <span className="w-4 h-4"></span>,
});

export default function CustomWalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="py-2 px-4 bg-gradient-to-r from-emerald-600 via-sky-500 to-cyan-500 hover:from-emerald-700 hover:via-sky-600 hover:to-cyan-600 text-white rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                  >
                    <Icons name="FaWallet" className="text-white" />
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all"
                  >
                    <Icons name="FaTimes" className="text-white" />
                    <span>Wrong Network</span>
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="py-2 px-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg flex items-center gap-2 transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="py-2 px-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-650"
                  >
                    <span>{account.displayName}</span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
