"use client";

import {useEffect} from "react";

const RegisterServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const version = "0.8"
      navigator.serviceWorker
        .register(`/sw.js?v=${version}`)
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);

          // Kiểm tra và buộc cập nhật nếu có phiên bản mới
          if (registration.waiting) {
            console.log("New Service Worker waiting, skipping to activate...");
            registration.waiting.postMessage({type: "SKIP_WAITING"});
          } else if (registration.installing) {
            console.log("Service Worker installing...");
            registration.installing.onstatechange = () => {
              if (registration.waiting) {
                registration.waiting.postMessage({type: "SKIP_WAITING"});
              }
            };
          }

          // Lắng nghe sự kiện cập nhật
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("New content available; please refresh.");
                  // Có thể hiển thị thông báo cho người dùng để reload
                } else {
                  console.log("Content cached for offline use.");
                }
              }
            };
          };

          // Kiểm tra controller hiện tại (Service Worker active)
          if (navigator.serviceWorker.controller) {
            console.log("An active Service Worker is controlling this page.");
          } else {
            console.log("No active Service Worker, loading fresh.");
          }
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
          if (err.name === "SecurityError") {
            console.error("Service Worker requires HTTPS (except localhost)");
          } else if (err.name === "NetworkError") {
            console.error("Network error when registering Service Worker");
          } else if (err.name === "NotFoundError") {
            console.error("Service Worker file (sw.js) not found");
          }
        });
    } else {
      console.warn("Service Worker is not supported in this browser.");
    }
  }, []);

  return null;
};

export default RegisterServiceWorker;