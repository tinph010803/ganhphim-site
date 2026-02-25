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

const MovieDetailLoading = () => {
    return (
        <>
            <style dangerouslySetInnerHTML={{__html: shimmer}}/>

            {/* Backdrop placeholder */}
            <div
                className="top-detail-wrap"
                style={{background: 'var(--top-bg-default, #191b24)'}}
            />

            <div id="wrapper" className="wrapper-w-slide">
                <div className="detail-container">

                    {/* Left sidebar skeleton */}
                    <div className="dc-side" style={{gap: '20px', display: 'flex', flexDirection: 'column'}}>
                        {/* Poster */}
                        <Skeleton height="380px" radius="1rem"/>
                        {/* Title */}
                        <Skeleton height="28px" width="80%"/>
                        <Skeleton height="20px" width="60%"/>
                        {/* Tags row */}
                        <div style={{display: 'flex', gap: '8px'}}>
                            <Skeleton width="70px" height="26px" radius="999px"/>
                            <Skeleton width="80px" height="26px" radius="999px"/>
                            <Skeleton width="60px" height="26px" radius="999px"/>
                        </div>
                        {/* Info lines */}
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} height="16px" width={i % 2 === 0 ? '90%' : '70%'}/>
                        ))}
                        <Skeleton height="100px" radius="1rem" style={{marginTop: '8px'}}/>
                    </div>

                    {/* Main content skeleton */}
                    <div
                        className="dc-main"
                        style={{padding: '30px 40px', display: 'flex', flexDirection: 'column', gap: '18px'}}
                    >
                        {/* Action buttons row */}
                        <div style={{display: 'flex', gap: '12px', marginBottom: '6px'}}>
                            <Skeleton width="160px" height="48px" radius="999px"/>
                            <Skeleton width="48px" height="48px" radius="999px"/>
                            <Skeleton width="48px" height="48px" radius="999px"/>
                            <Skeleton width="48px" height="48px" radius="999px"/>
                        </div>
                        {/* Episode list */}
                        <Skeleton height="24px" width="40%"/>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                            {[...Array(24)].map((_, i) => (
                                <Skeleton key={i} width="52px" height="36px" radius="0.4rem"/>
                            ))}
                        </div>
                        {/* Description */}
                        <Skeleton height="20px" width="100%"/>
                        <Skeleton height="20px" width="95%"/>
                        <Skeleton height="20px" width="88%"/>
                        <Skeleton height="20px" width="75%"/>
                        {/* Related section */}
                        <Skeleton height="24px" width="35%" style={{marginTop: '16px'}}/>
                        <div style={{display: 'flex', gap: '12px', overflowX: 'hidden'}}>
                            {[...Array(5)].map((_, i) => (
                                <div key={i}
                                     style={{flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                    <Skeleton width="140px" height="210px" radius="0.75rem"/>
                                    <Skeleton width="120px" height="16px"/>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default MovieDetailLoading
