"use client"

import React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"
import abi from "./abi.json"
import Altar from "./components/Altar"
import NFTDisplay from "./components/NFTDisplay"

export default function Home() {
    const { isConnected } = useAccount()

    // load smart contract
    const { config } = usePrepareContractWrite({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: abi,
        functionName: "safeMint",
        chainId: 1337,
    })
    const { data, isLoading, isSuccess, write } = useContractWrite(config)

    const [nftToSacrify, setNftToSacrify] = React.useState(null)
    const [sacrificeAsked, setSacrificeAsked] = React.useState(false)

    // only send NFT if altar is empty
    function handleSelect(nft) {
        if (!sacrificeAsked) {
            setNftToSacrify(nft)
        }
    }

    function toggleSacrify() {
        setSacrificeAsked(!sacrificeAsked)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Sacrifice an NFT to mint a unique Rug!
                </p>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <ConnectButton />
                </div>
            </div>
            <div>
                <button
                    className="p-4 rounded bg-violet-600"
                    disabled={!write}
                    //@ TODO: disable while confirming in MM
                    onClick={() => write?.()}
                >
                    Mint
                </button>
                {isLoading && <div>Confirming...</div>}
                {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
            </div>
            {isConnected ? (
                <Altar
                    nftToSacrify={nftToSacrify}
                    sacrificeAsked={sacrificeAsked}
                    toggleSacrify={toggleSacrify}
                />
            ) : (
                <h1 className="text-6xl font-bold">Sacri.fi</h1>
            )}
            {isConnected && <NFTDisplay handleSelect={handleSelect} />}
        </main>
    )
}
