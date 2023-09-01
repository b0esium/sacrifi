import Image from "next/image"
import { useAccount } from "wagmi"
import { Network, Alchemy } from "alchemy-sdk"
import { useState } from "react"

export default function NFTDisplay() {
    const { address } = useAccount()
    const settings = {
        apiKey: process.env.ALCHEMY_API_KEY,
        network: Network.ETH_MAINNET,
    }
    const alchemy = new Alchemy(settings)

    const [nfts, setNfts] = useState([])
    const [titles, setTitles] = useState([])

    async function getNfts() {
        const nftsForOwner = await alchemy.nft.getNftsForOwner(address)
        console.log("number of NFTs found:", nftsForOwner.totalCount)
        setNfts([...nftsForOwner.ownedNfts])
        const titles = nfts.map((nft) => nft.title)
        setTitles([...titles])
        // for (const nft of nftsForOwner.ownedNfts) {
        //     console.log(nft.title)
        //     // if (nft.media[0].gateway) {
        //     //     console.log(nft.media[0].gateway)
        //     // }
        // }
    }

    return (
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
            <button className="rounded" onClick={getNfts}>
                Get NFTs
            </button>

            <ul>
                {titles.map((title, index) => (
                    <li key={index}>{title}</li>
                ))}
            </ul>

            {/* <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                <h2 className={`mb-3 text-2xl font-semibold`}>
                    NFT 1{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                        -&gt;
                    </span>
                </h2>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{address}</p>
            </div>             */}
        </div>
    )
}
