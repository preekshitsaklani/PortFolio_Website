import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Preekshit Saklani | The Titan',
    description: 'Portfolio of Preekshit Saklani',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body
                className="font-sans text-white min-h-screen"
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    )
}
