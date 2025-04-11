interface Settings {
    temperature: number;
    brightness: number;
    reminderInterval: number;
  }
  
  class PopupController {
    private temperatureSlider: HTMLInputElement;
    private brightnessSlider: HTMLInputElement;
    private reminderInput: HTMLInputElement;
  
    constructor() {
      this.temperatureSlider = document.getElementById('temperature') as HTMLInputElement;
      this.brightnessSlider = document.getElementById('brightness') as HTMLInputElement;
      this.reminderInput = document.getElementById('reminder') as HTMLInputElement;
  
      this.initListeners();
      this.loadSettings();
    }
  
    private initListeners() {
      this.temperatureSlider.addEventListener('input', () => this.updateTemperature());
      this.brightnessSlider.addEventListener('input', () => this.updateBrightness());
      this.reminderInput.addEventListener('change', () => this.updateReminder());
    }
  
    private async loadSettings() {
      const settings = await chrome.storage.sync.get(['settings']) as { settings: Settings };
      if (settings.settings) {
        this.temperatureSlider.value = settings.settings.temperature.toString();
        this.brightnessSlider.value = settings.settings.brightness.toString();
        this.reminderInput.value = settings.settings.reminderInterval.toString();
        this.updateTemperature();
        this.updateBrightness();
      }
    }
  
    private updateTemperature() {
        const value = parseInt(this.temperatureSlider.value);
        console.log('Sending temperature:', value);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'temperature', value });
         }
         });
         this.saveSettings();
    }
  
    private updateBrightness() {
      const value = parseInt(this.brightnessSlider.value);
      console.log('Sending brightness:', value);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
         chrome.tabs.sendMessage(tabs[0].id, { type: 'brightness', value });
        }
     });
     this.saveSettings();
    }
  
    private updateReminder() {
      const value = parseInt(this.reminderInput.value);
      chrome.runtime.sendMessage({ type: 'setReminder', value });
      this.saveSettings();
    }
  
    private saveSettings() {
      const settings: Settings = {
        temperature: parseInt(this.temperatureSlider.value),
        brightness: parseInt(this.brightnessSlider.value),
        reminderInterval: parseInt(this.reminderInput.value)
      };
      chrome.storage.sync.set({ settings });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new PopupController());