export default function Altar() {
    function msg() {
        alert("bloup")
    }
    return (
        <div className="grid">
            <div className="flex items-center justify-center p-8 aspect-square rounded-lg border-neutral-700 bg-neutral-800 bg-opacity-30">
                NFT to be sacrificed
            </div>
            <button onClick={() => msg()} className="p-4 bg-red-500 rounded">
                Sacrify
            </button>
        </div>
    )
}
