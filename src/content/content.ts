class EyeCareFilter {
  private overlay: HTMLDivElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.overlay);
    console.log('EyeCareFilter initialized');
  }

  setTemperature(value: number) {
    const warmth = value / 100;
    this.overlay.style.backgroundColor = `rgba(255, 147, 0, ${warmth * 0.4})`;
    console.log('Temperature set to:', value);
  }

  setBrightness(value: number) {
    const brightness = value / 100;
    this.overlay.style.opacity = `${1 - brightness * 0.5}`;
    console.log('Brightness set to:', value);
  }
}

const filter = new EyeCareFilter();

chrome.runtime.onMessage.addListener(
  (message: { type: string; value: number }, sender, sendResponse) => {
    console.log('Message received:', message);
    if (message.type === 'temperature') {
      filter.setTemperature(message.value);
    } else if (message.type === 'brightness') {
      filter.setBrightness(message.value);
    }
    sendResponse({ success: true });
  }
);