"use client"

import React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {
    useAccount,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
} from "wagmi"
import abi from "./abi.json"
import Altar from "./components/Altar"
import NFTDisplay from "./components/NFTDisplay"

export default function Home() {
    const { isConnected } = useAccount()

    // initialize state
    const [sacrificeAsked, setSacrificeAsked] = React.useState(false)
    const [nftToSacrify, setNftToSacrify] = React.useState(null)
    const [refreshAfterBurn, setRefreshAfterBurn] = React.useState(false)

    // load smart contract function hook
    const CONTRACT_ADDRESS = "0xBaDdBDc73Ec4F44F5D2Fd455e5BdD2DF357A56ea"
    const { config: configMint } = usePrepareContractWrite({
        address: CONTRACT_ADDRESS,
        abi: abi,
        functionName: "safeMint",
        // sepolia
        chainId: 11155111,
    })
    const { data: dataMint, isLoading, write: writeMint } = useContractWrite(configMint)
    const { isLoading: isLoadingMint, isSuccess: isSuccessMint } = useWaitForTransaction({
        hash: dataMint?.hash,
    })

    // functions
    // only send NFT if altar is empty
    function handleSelect(nft) {
        if (!sacrificeAsked) {
            setNftToSacrify(nft)
        }
    }

    // toggle Burn buttons
    function toggleSacrify() {
        setSacrificeAsked(!sacrificeAsked)
    }

    function mintNft() {
        try {
            // call the mint from the smart contract
            writeMint?.()
        } catch (error) {
            console.log(error)
        }
    }

    function refreshListAfterBurn() {
        // trigger getNfts() from useEffect in NFTDisplay
        setRefreshAfterBurn(!refreshAfterBurn)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-around p-8">
            {/* menu bar with rainbow kit connect button */}
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-3 pt-3 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Sacrifice an NFT to mint a unique Pug!
                </p>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <ConnectButton />
                </div>
            </div>
            {isConnected ? (
                <div className="contents">
                    <div className="grid m-4">
                        {/* mint button */}
                        <button
                            id="mintBtn"
                            className="mt-10 flex items-center justify-center gap-x-6 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-mono text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                            disabled={!writeMint || isLoading || isLoadingMint}
                            onClick={() => mintNft()}
                        >
                            {isLoading || isLoadingMint ? "Minting..." : "Mint a test NFT"}
                        </button>
                        {isSuccessMint && (
                            <div className="m-auto">
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    <a
                                        className="underline"
                                        href={`https://etherscan.io/tx/${dataMint?.hash}`}
                                    >
                                        Successfully minted your NFT!
                                    </a>
                                </span>
                            </div>
                        )}
                    </div>
                    {/* display altar (chosen NFT to sacrify) */}
                    <Altar
                        nftToSacrify={nftToSacrify}
                        setNftToSacrify={setNftToSacrify}
                        sacrificeAsked={sacrificeAsked}
                        toggleSacrify={toggleSacrify}
                        refreshListAfterBurn={refreshListAfterBurn}
                    />
                    {/* display NFTs available to sacrify */}
                    <NFTDisplay
                        handleSelect={handleSelect}
                        refreshAfterMint={isSuccessMint}
                        refreshAfterBurn={refreshAfterBurn}
                    />
                </div>
            ) : (
                // if not connected, display app title
                <h1 className="text-6xl font-bold">Sacri.fi</h1>
            )}
        </main>
    )
}
