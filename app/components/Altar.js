import React from "react"
import Image from "next/image"

export default function Altar({ nftToSacrify, sacrificeAsked, toggleSacrify }) {
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
                    <button className="p-4 bg-red-800 rounded">Confirm</button>
                    <button className="p-4 bg-gray-400 rounded" onClick={() => toggleSacrify()}>
                        Cancel
                    </button>
                </div>
            )}
            {nftToSacrify && !sacrificeAsked && (
                <button onClick={() => toggleSacrify()} className="p-4 bg-red-500 rounded">
                    Sacrify
                </button>
            )}
        </div>
    )
}
