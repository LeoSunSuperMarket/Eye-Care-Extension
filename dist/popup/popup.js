"use strict";
class PopupController {
    constructor() {
        this.temperatureSlider = document.getElementById('temperature');
        this.brightnessSlider = document.getElementById('brightness');
        this.reminderInput = document.getElementById('reminder');
        this.initListeners();
        this.loadSettings();
    }
    initListeners() {
        this.temperatureSlider.addEventListener('input', () => this.updateTemperature());
        this.brightnessSlider.addEventListener('input', () => this.updateBrightness());
        this.reminderInput.addEventListener('change', () => this.updateReminder());
    }
    async loadSettings() {
        const settings = await chrome.storage.sync.get(['settings']);
        if (settings.settings) {
            this.temperatureSlider.value = settings.settings.temperature.toString();
            this.brightnessSlider.value = settings.settings.brightness.toString();
            this.reminderInput.value = settings.settings.reminderInterval.toString();
            this.updateTemperature();
            this.updateBrightness();
        }
    }
    updateTemperature() {
        const value = parseInt(this.temperatureSlider.value);
        console.log('Sending temperature:', value);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'temperature', value });
            }
        });
        this.saveSettings();
    }
    updateBrightness() {
        const value = parseInt(this.brightnessSlider.value);
        console.log('Sending brightness:', value);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'brightness', value });
            }
        });
        this.saveSettings();
    }
    updateReminder() {
        const value = parseInt(this.reminderInput.value);
        chrome.runtime.sendMessage({ type: 'setReminder', value });
        this.saveSettings();
    }
    saveSettings() {
        const settings = {
            temperature: parseInt(this.temperatureSlider.value),
            brightness: parseInt(this.brightnessSlider.value),
            reminderInterval: parseInt(this.reminderInput.value)
        };
        chrome.storage.sync.set({ settings });
    }
}
document.addEventListener('DOMContentLoaded', () => new PopupController());
