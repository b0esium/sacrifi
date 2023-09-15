import Image from "next/image"
import { useAccount } from "wagmi"
import { Network, Alchemy } from "alchemy-sdk"
import { useState, useEffect } from "react"

export default function NFTDisplay({ handleSelect, updateNeeded }) {
    const { address } = useAccount()
    const settings = {
        apiKey: process.env.ALCHEMY_API_KEY_SEPOLIA,
        network: Network.ETH_SEPOLIA,
    }
    const alchemy = new Alchemy(settings)

    const [nfts, setNfts] = useState([])
    // load NFT data when this component is mounted
    useEffect(() => {
        getNfts()
    }, [updateNeeded])

    async function getNfts() {
        // exclude spam NFTs known by the Alchemy API
        const excludeFilters = "SPAM"
        const nftsForOwner = await alchemy.nft.getNftsForOwner(address, excludeFilters)

        console.log("number of NFTs found:", nftsForOwner.totalCount)

        // exclude NFTs with no title (usually spam)
        let filteredNfts = nftsForOwner.ownedNfts.filter((nft) => {
            return nft.title !== ""
        })
        // exclude NFTs with no images cached by Alchemy API (usually spam)
        filteredNfts = filteredNfts.filter((nft) => {
            return (
                nft.media[0].gateway.includes("nft-cdn.alchemy.com") ||
                nft.media[0].gateway.includes("ipfs.io")
            )
        })

        console.log("number of NFTs found after filtering:", filteredNfts.length)

        setNfts([...filteredNfts])
    }

    return (
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-center">
            {nfts.map((nft, index) => (
                <div
                    key={index}
                    onClick={() => {
                        handleSelect(nft)
                    }}
                    className="group justify-self-start rounded-lg border px-5 py-4 cursor-pointer transition-colors hover:border-red-500 hover:bg-red-300 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                >
                    <h4 className={`mb-3 text-l font-semibold`}>{nft.title}</h4>
                    <Image src={nft.media[0].gateway} width={200} height={200} alt={nft.title} />
                </div>
            ))}
        </div>
    )
}
