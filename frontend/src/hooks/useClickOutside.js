import { useEffect, useRef } from 'react'

export function useClickOutside(handler) {
  const ref = useRef(null)

  useEffect(() => {
    function onPointerDown(event) {
      if (!ref.current) return
      if (!ref.current.contains(event.target)) {
        handler(event)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [handler])

  return ref
}
