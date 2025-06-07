'use client'

export default function CopyPageButton() {
  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href)
  }
  return (
    <button onClick={handleClick} className="text-sm underline ml-2">
      Copy page
    </button>
  )
}
