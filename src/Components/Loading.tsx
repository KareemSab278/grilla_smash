export const Loading = ({ active }: { active: boolean }) => {
    return (
        <div
            className={`loading-screen ${active ? 'active' : ''}`}
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid rgba(255, 255, 255, 0.4)',
                    borderTop: '4px solid #F7931E',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }}
            />
        </div>
    )
}