// src/components/Shared/ScrollToNow.tsx
import React from 'react'

export default function ScrollToNowButton({ onClick } : { onClick: ()=>void }) {
  return (
    <button className="btn primary" onClick={onClick} style={{ position:'fixed', right:18, bottom:18 }}>
      Scroll to now
    </button>
  )
}
