import 'ldrs/helix'

export default function Loader() {
  return (
    <div
      aria-live="polite"
      aria-busy={true}
      style={{
        position: 'fixed',
        inset: '0px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <l-helix></l-helix>
    </div>
  )
}
