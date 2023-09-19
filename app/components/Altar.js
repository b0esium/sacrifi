import React from "react"
import Image from "next/image"
import { ethers } from "ethers"
import abi from "../abi.json"

export default function Altar({
    nftToSacrify,
    setNftToSacrify,
    sacrificeAsked,
    toggleSacrify,
    refreshUIAfterBurn,
}) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [tx, setTx] = React.useState("")
    const [showTx, setShowTx] = React.useState(false)

    React.useEffect(() => {
        setShowTx(false)
    }, [nftToSacrify])

    async function burnNft(tokenId) {
        if (typeof window.ethereum !== undefined) {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(
                "0xBaDdBDc73Ec4F44F5D2Fd455e5BdD2DF357A56ea",
                abi,
                signer
            )
            setIsLoading(true)
            try {
                const transactionResponse = await contract.burn(tokenId)
                await transactionResponse.wait()
                provider.once(transactionResponse.hash, () => {
                    setTx(transactionResponse.hash.toString())
                    setShowTx(true)
                })
            } catch (error) {
                console.log(error)
            } finally {
                // cleanup
                setIsLoading(false)
                toggleSacrify()
                setNftToSacrify(null)
                refreshUIAfterBurn()
            }
        }
    }

    return (
        <div className="grid m-8">
            <div className="flex items-center justify-center p-8 aspect-square rounded-lg border-neutral-700 bg-neutral-800 bg-opacity-30">
                {nftToSacrify !== null ? (
                    <div className="group justify-self-start rounded-lg border px-5 py-4 transition-colors">
                        <h4 className={`mb-3 text-l font-semibold`}>{nftToSacrify.title}</h4>
                        <Image
                            src={nftToSacrify.media[0].gateway}
                            width={300}
                            height={300}
                            alt={nftToSacrify.title}
                        />
                    </div>
                ) : (
                    <p>NFT to be sacrificed</p>
                )}
            </div>
            {sacrificeAsked && (
                <div className="grid">
                    <button
                        className="p-4 bg-red-800 rounded"
                        disabled={isLoading}
                        onClick={() => burnNft(parseInt(nftToSacrify.tokenId))}
                    >
                        {isLoading ? "Burning..." : "Burn"}
                    </button>
                    <button
                        className="p-4 bg-gray-400 rounded"
                        disabled={isLoading}
                        onClick={() => toggleSacrify()}
                    >
                        Cancel
                    </button>
                </div>
            )}
            {nftToSacrify && !sacrificeAsked && (
                <button onClick={() => toggleSacrify()} className="p-4 bg-red-500 rounded">
                    Sacrify
                </button>
            )}
            {showTx && (
                <div>
                    Successfully burned your NFT!
                    <div>
                        <a className="underline" href={`https://etherscan.io/tx/${tx}`}>
                            Etherscan link
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
