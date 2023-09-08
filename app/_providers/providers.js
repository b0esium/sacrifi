"use client"

import * as React from "react"
require("dotenv").config()
import {
    RainbowKitProvider,
    getDefaultWallets,
    connectorsForWallets,
} from "@rainbow-me/rainbowkit"
import { argentWallet, trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { mainnet, sepolia, localhost } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { alchemyProvider } from "wagmi/providers/alchemy"

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_SEPOLIA

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, sepolia, localhost],
    [alchemyProvider({ apiKey: alchemyApiKey }), publicProvider()]
)

const projectId = process.env.NEXT_PUBLIC_W3C_PID

const { wallets } = getDefaultWallets({
    appName: "Sacrifi",
    projectId,
    chains,
})

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: "Other",
        wallets: [
            argentWallet({ projectId, chains }),
            trustWallet({ projectId, chains }),
            ledgerWallet({ projectId, chains }),
        ],
    },
])

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
})

const appInfo = {
    appName: "Sacrifi",
}

export function Providers({ children }) {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} appInfo={appInfo}>
                {mounted && children}
            </RainbowKitProvider>
        </WagmiConfig>
    )
}
