import SubscriptionApi from "@/api/subscription.api";

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array(rawData.split('').map((char) => char.charCodeAt(0)));
}

const subscribe = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // Lấy Service Worker đã đăng ký
      const registration = await navigator.serviceWorker.ready;

      // Lấy subscription hiện tại
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Nếu chưa có subscription, tiến hành đăng ký mới
        const publicKey = process.env.VAPID_PUBLIC_KEY
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        console.log('User subscribed:', newSubscription);

        await SubscriptionApi.subscribe(JSON.parse(JSON.stringify(newSubscription)));
      } else {
        console.log('User is already subscribed:', subscription)
      }
    } catch (error) {
      console.error('Failed to subscribe user:', error);
    }
  } else {
    console.warn('Push notifications are not supported in this browser.');
  }
}

const subscribeWithUser = async () => {
  // Kiểm tra nếu Service Worker và Push Manager hỗ trợ
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // Lấy Service Worker đã đăng ký
      const registration = await navigator.serviceWorker.ready;

      // Lấy subscription hiện tại
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await SubscriptionApi.subscribe(JSON.parse(JSON.stringify(subscription)));

        console.log('Subscription linked to user successfully.');
      } else {
        console.warn('No subscription found. User might not be subscribed.');
      }
    } catch (error) {
      console.error('Error updating subscription with user:', error);
    }
  } else {
    console.warn('Push notifications are not supported in this browser.');
  }
}

export {
  subscribe,
  subscribeWithUser,
}