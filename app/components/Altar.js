import React from "react"
import Image from "next/image"
import { ethers } from "ethers"
import abi from "../abi.json"

export default function Altar({
    nftToSacrify,
    setNftToSacrify,
    sacrificeAsked,
    toggleSacrify,
    refreshListAfterBurn,
}) {
    // initialize state
    const [isLoading, setIsLoading] = React.useState(false)
    const [tx, setTx] = React.useState("")
    const [showTx, setShowTx] = React.useState(false)
    const [showError, setShowError] = React.useState(false)

    // remove previous tx info or error message when selecting a new NFT to burn
    React.useEffect(() => {
        if (showTx == "willBeShown") {
            setShowTx(true)
        } else {
            setShowTx(false)
        }
        if (showError == "willBeShown") {
            setShowError(true)
        } else {
            setShowError(false)
        }
    }, [nftToSacrify])

    async function burnNft(tokenId) {
        if (window.ethereum !== undefined) {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const CONTRACT_ADDRESS = "0xBaDdBDc73Ec4F44F5D2Fd455e5BdD2DF357A56ea"
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
            setIsLoading(true)
            try {
                // call the burn from the smart contract
                const transactionResponse = await contract.burn(tokenId)
                await transactionResponse.wait()
                // display tx info once it has been mined
                provider.once(transactionResponse.hash, () => {
                    setTx(transactionResponse.hash.toString())
                    setShowTx("willBeShown")
                    refreshListAfterBurn()
                })
            } catch (error) {
                setShowError("willBeShown")
                console.log(error)
            } finally {
                // cleanup
                setIsLoading(false)
                toggleSacrify()
                setNftToSacrify(null)
            }
        }
    }

    return (
        <div className="grid mt-8 mb-12">
            <div className="flex items-center justify-center p-8 aspect-square rounded-lg border-neutral-700 bg-neutral-800 bg-opacity-30">
                {nftToSacrify !== null ? (
                    <div className="group justify-self-start rounded-lg px-5 py-4 transition-colors">
                        <h4 className={`mb-3 text-l font-semibold`}>{nftToSacrify.title}</h4>
                        <Image
                            src={nftToSacrify.media[0].gateway}
                            width={300}
                            height={300}
                            alt={nftToSacrify.title}
                        />
                    </div>
                ) : (
                    <p className="font-mono">NFT to be sacrificed</p>
                )}
            </div>
            {/* confirm or cancel buttons */}
            {sacrificeAsked && (
                <div className="grid">
                    <button
                        className="mt-4 flex items-center justify-center gap-x-6 rounded-md bg-red-900 px-3.5 py-2.5 text-sm font-mono text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                        disabled={isLoading}
                        onClick={() => burnNft(parseInt(nftToSacrify.tokenId))}
                    >
                        {isLoading ? "Burning..." : "Burn"}
                    </button>
                    {!isLoading && (
                        <button
                            className="mt-4 flex items-center justify-center gap-x-6 rounded-md bg-gray-500 px-3.5 py-2.5 text-sm font-mono text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                            disabled={isLoading}
                            onClick={() => toggleSacrify()}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}
            {/* main burn button */}
            {nftToSacrify && !sacrificeAsked && (
                <button
                    onClick={() => toggleSacrify()}
                    className="mt-4 flex items-center justify-center gap-x-6 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-mono text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                    Sacrify
                </button>
            )}
            {/* display transaction info */}
            {showTx && (
                <div className="m-auto">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        <a className="underline" href={`https://etherscan.io/tx/${tx}`}>
                            Successfully burned your NFT!
                        </a>
                    </span>
                </div>
            )}
            {/* display error message */}
            {showError && (
                <div className="m-auto">
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Can't burn NFT from another collection!
                    </span>
                </div>
            )}
        </div>
    )
}
