export const useNotifyWithSound = () => {
  const notify = (title: string, message: string) => {
    // Play sound
    const audio = new Audio(
      "/sounds/elevator-chimenotification-ding-recreation-287560.mp3"
    );
    audio.play().catch((e) => console.error("Audio error:", e));

    // Show browser notification
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  };

  return { notify };
};
