export const Loading = ({ active }: { active: boolean }) => {
    return (
        <div className={`loading-screen ${active ? 'active' : ''}`}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #ccc', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
    )
}