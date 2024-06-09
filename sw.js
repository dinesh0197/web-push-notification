const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (c) => c.charCodeAt(0));
};

const saveSubscription = async (subscription) => {
  const response = await fetch("http://localhost:3000/save-subscription", {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(subscription),
  });

  return response.json();
};

self.addEventListener("activate", async (e) => {
  try {
    const subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BMY228xAMqDDc1JJKDbj1mwa-gse1dRCmQTpwwnAH1udHX5vVYqfiS5VFVF8eLSooYfDVkrXFaez2S0d9w3_qdA"
      ),
    });

    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (error) {
    console.log({ error });
  }
});

self.addEventListener("push", (e) => {
  self.registration.showNotification("Wohoo!!", { body: e.data.text() });
});
