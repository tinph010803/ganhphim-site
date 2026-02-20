"use client"

import {forwardRef} from "react";

const LoadingElement = forwardRef(({height = null}, ref) => {
  const styles = {}
  if (height) styles.height = `${height}px`

  return (
    <div ref={ref} className="v-loader-area" style={styles}>
      <div className="v-loader"></div>
    </div>
  )
})

export default LoadingElement