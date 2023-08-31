import "./globals.css"
import { Inter } from "next/font/google"
import "@rainbow-me/rainbowkit/styles.css"
import { Providers } from "./_providers/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Sacri.fi",
    description: "Sacrifice an NFT to mint a unique Rug",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
