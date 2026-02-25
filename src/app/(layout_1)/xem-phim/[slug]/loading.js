const shimmer = `
@keyframes shimmer {
  0%   { background-position: -800px 0; }
  100% { background-position: 800px 0; }
}
.rp-skeleton {
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 0.5rem;
}
`

const Skeleton = ({width = '100%', height = '20px', radius = '0.5rem', style = {}}) => (
    <div
        className="rp-skeleton"
        style={{width, height, borderRadius: radius, flexShrink: 0, ...style}}
    />
)

const MovieWatchLoading = () => {
    return (
        <>
            <style dangerouslySetInnerHTML={{__html: shimmer}}/>
            <div id="wrapper" className="makeup wrapper-watch">
                {/* Breadcrumb */}
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 16px'}}>
                    <Skeleton width="40px" height="40px" radius="999px"/>
                    <Skeleton width="240px" height="24px"/>
                </div>

                {/* Player skeleton — 16:9 aspect ratio */}
                <div style={{
                    width: '100%',
                    maxWidth: '1200px',
                    margin: '0 auto 24px',
                    paddingTop: 'min(56.25%, 70vh)',
                    position: 'relative',
                }}>
                    <Skeleton
                        radius="0.75rem"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </div>

                {/* Action bar */}
                <div style={{display: 'flex', gap: '12px', padding: '0 16px', marginBottom: '24px'}}>
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} width="48px" height="48px" radius="999px"/>
                    ))}
                </div>

                {/* Episode list */}
                <div style={{padding: '0 16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <Skeleton height="20px" width="180px"/>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                        {[...Array(24)].map((_, i) => (
                            <Skeleton key={i} width="52px" height="36px" radius="0.4rem"/>
                        ))}
                    </div>
                </div>

                {/* Server list */}
                <div style={{padding: '0 16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <Skeleton height="20px" width="160px"/>
                    <div style={{display: 'flex', gap: '8px'}}>
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} width="100px" height="36px" radius="0.4rem"/>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MovieWatchLoading
