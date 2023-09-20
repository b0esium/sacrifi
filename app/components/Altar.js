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
    // initialize state
    const [isLoading, setIsLoading] = React.useState(false)
    const [tx, setTx] = React.useState("")
    const [showTx, setShowTx] = React.useState(false)
    const [showError, setShowError] = React.useState(false)

    // remove previous tx info or error message when selecting a new NFT to burn
    React.useEffect(() => {
        setShowTx(false)
        if (showError == "notShownYet") {
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
                    setShowTx(true)
                    refreshUIAfterBurn()
                })
            } catch (error) {
                setShowError("notShownYet")
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
            {/* confirm or cancel buttons */}
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
            {/* main burn button */}
            {nftToSacrify && !sacrificeAsked && (
                <button onClick={() => toggleSacrify()} className="p-4 bg-red-500 rounded">
                    Sacrify
                </button>
            )}
            {/* display transaction info */}
            {showTx && (
                <div className="bg-green-200">
                    Successfully burned your NFT!
                    <div>
                        <a className="underline" href={`https://etherscan.io/tx/${tx}`}>
                            Etherscan link
                        </a>
                    </div>
                </div>
            )}
            {/* display error message */}
            {showError && (
                <div className="bg-red-200">Can't burn NFT from another collection!</div>
            )}
        </div>
    )
}
