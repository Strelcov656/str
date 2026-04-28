// src/hooks/useIsMobile.ts
import { useState, useEffect } from "react"

const MOBILE_MAX_WIDTH = 767

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH)
    }
    mql.addEventListener("change", handleResize)
    setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH)
    return () => mql.removeEventListener("change", handleResize)
  }, [])

  return !!isMobile
}
