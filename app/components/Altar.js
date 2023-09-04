import Image from "next/image"

export default function Altar(nftToSacrify) {
    function msg() {
        alert(`Are you sure you want to sacrifice ${nftToSacrify.nftToSacrify}?`)
        const nft = JSON.stringify(nftToSacrify)
        console.log("nftToSacrify: " + nft)
    }
    return (
        <div className="grid m-8">
            <div className="flex items-center justify-center p-8 aspect-square rounded-lg border-neutral-700 bg-neutral-800 bg-opacity-30">
                {nftToSacrify.nftToSacrify !== null ? (
                    <p>{nftToSacrify.nftToSacrify}</p>
                ) : (
                    <p>NFT to be sacrificed</p>
                )}
            </div>
            <button onClick={() => msg()} className="p-4 bg-red-500 rounded">
                Sacrify
            </button>
        </div>
    )
}
