import { useEffect, useState } from 'react'

const ART_URL = '/ascii-art%20(1).txt'

export function HeroArt() {
  const [art, setArt] = useState<string | null>(null)

  useEffect(() => {
    fetch(ART_URL)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then(setArt)
      .catch(() => setArt(null))
  }, [])

  if (!art) return null

  return (
    <pre
      className="shrink-0 font-mono text-[0.32rem] leading-[1.05] whitespace-pre text-destructive opacity-90 select-none max-[900px]:hidden sm:text-[0.38rem]"
      aria-hidden="true"
    >
      {art}
    </pre>
  )
}
