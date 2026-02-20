"use client";

import { useEffect, useState } from "react";

const useDeviceDetect = () => {
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(userAgent);

    if (isMobile) {
      setDeviceType("mobile");
    } else if (isTablet) {
      setDeviceType("tablet");
    } else {
      setDeviceType("desktop");
    }
  }, []);

  return deviceType;
};

export default useDeviceDetect;