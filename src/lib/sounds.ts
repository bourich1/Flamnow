export const playSound = (type: 'sent' | 'notification') => {
  try {
    const urls = {
      // Sent sound: A clean pop/whoosh success sound
      sent: 'https://assets.mixkit.co/active_storage/sfx/237/237-preview.mp3',
      // Notification sound: A modern ping/chime for new messages
      notification: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
    }
    
    const audio = new Audio(urls[type]);
    audio.volume = 0.5; // Don't make it too loud
    audio.play().catch(err => {
      // Browsers may block autoplay if user hasn't interacted
      console.warn('Could not play sound:', err);
    });
  } catch (e) {
    console.warn('Audio not supported:', e);
  }
}
