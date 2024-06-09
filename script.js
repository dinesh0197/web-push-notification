function checkPermission() {
  if (!("serviceWorker" in navigator)) {
    alert("Service Worker is not supported in this browser.");
    return false;
  }

  if (!("Notification" in window)) {
    alert("Notification API is not supported in this browser.");
    return false;
  }

  if (!("PushManager" in window)) {
    alert("Push API is not supported in this browser.");
    return false;
  }

  return true;
}

async function registerSW() {
  try {
    const registration = await navigator.serviceWorker.register("sw.js");
    console.log("Service worker registered:", registration);
    return registration;
  } catch (error) {
    console.error("Service worker registration failed:", error);
  }
}

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permission denied");
      throw new Error("Notification permission not granted");
    } else {
      console.log("Permission granted");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
}

function main() {
  if (!checkPermission()) return;

  requestNotificationPermission()
    .then(() => {
      return registerSW();
    })
    .catch((error) => {
      console.error("Error in main execution:", error);
    });
}

window.onload = function () {
  document.querySelector("#enable-notification").addEventListener("click", main);
};
