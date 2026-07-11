export const NoCloseLocation = () => {
  const retryLocation = () => {
    window.location.reload()
  }

  return (
    <main className="no-close-location" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#fff',
      color: '#111',
    }}>
      <div style={{
        maxWidth: 520,
        width: '100%',
        textAlign: 'center',
        padding: '32px',
        borderRadius: '18px',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
      }}>
        <h1 style={{ marginBottom: '16px', fontSize: '2rem' }}>Location Needed</h1>
        <p style={{ marginBottom: '24px', lineHeight: 1.7, color: '#4b5563' }}>
          We couldn't find a location near you using your shared location, or location access
          may not have been granted. Please allow location access and try again.
        </p>
        <button
          type="button"
          onClick={retryLocation}
          style={{
            padding: '14px 24px',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: '#111827',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </main>
  )
}
