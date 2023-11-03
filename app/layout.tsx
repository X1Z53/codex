"use client"
import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react"
import { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ColorModeScript initialColorMode={"dark"} />
        <CacheProvider>
          <ChakraProvider
            theme={extendTheme({
              styles: {
                global: {
                  body: { backgroundColor: "#1e1e1e", color: "#d4d4d4" },
                },
              },
              config: {
                initialColorMode: "dark",
                useSystemColorMode: false,
              },
            })}
          >
            {children}
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
