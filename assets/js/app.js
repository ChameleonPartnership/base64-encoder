/* ============================================
   Base64 Encoder/Decoder - Application Logic
   Production-Ready Implementation
   ============================================ */

'use strict';

class Base64App {
    constructor() {
        // DOM Elements
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.inputCharCount = document.getElementById('inputCharCount');
        this.outputCharCount = document.getElementById('outputCharCount');
        
        // Buttons
        this.clearInputBtn = document.getElementById('clearInputBtn');
        this.uploadFileBtn = document.getElementById('uploadFileBtn');
        this.copyOutputBtn = document.getElementById('copyOutputBtn');
        this.downloadOutputBtn = document.getElementById('downloadOutputBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.jwtDecoderBtn = document.getElementById('jwtDecoderBtn');
        this.imageDataUriBtn = document.getElementById('imageDataUriBtn');
        this.bulkProcessBtn = document.getElementById('bulkProcessBtn');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        
        // File inputs
        this.fileInput = document.getElementById('fileInput');
        this.imageInput = document.getElementById('imageInput');
        
        // Mode buttons
        this.modeBtns = document.querySelectorAll('.mode-btn');
        
        // Other elements
        this.historyList = document.getElementById('historyList');
        this.urlSafeToggle = document.getElementById('urlSafeToggle');
        this.jwtOutput = document.getElementById('jwtOutput');
        this.jwtPreview = document.getElementById('jwtPreview');
        
        // State
        this.currentMode = 'encode';
        this.history = this.loadHistory();
        this.currentTheme = this.loadTheme();
        
        // Constants
        this.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        this.MAX_HISTORY_ITEMS = 20;
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.attachEventListeners();
        this.renderHistory();
    }

    /**
     * ============================================
     * Event Listeners
     * ============================================
     */

    attachEventListeners() {
        // Input/Output
        this.inputText.addEventListener('input', () => this.handleInputChange());
        this.inputText.addEventListener('paste', (e) => this.handlePaste(e));
        
        // Buttons
        this.clearInputBtn.addEventListener('click', () => this.clearInput());
        this.uploadFileBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.copyOutputBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadOutputBtn.addEventListener('click', () => this.downloadOutput());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Tools
        this.jwtDecoderBtn.addEventListener('click', () => this.decodeJWT());
        this.imageDataUriBtn.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.bulkProcessBtn.addEventListener('click', () => this.bulkProcess());
        
        // Mode selection
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.closest('.mode-btn').dataset.mode));
        });
        
        // Dark mode toggle
        this.darkModeToggle.addEventListener('click', () => this.toggleTheme());
        
        // URL-safe toggle
        this.urlSafeToggle.addEventListener('change', () => this.handleInputChange());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    /**
     * ============================================
     * Encoding/Decoding Core Logic
     * ============================================
     */

    async handleInputChange() {
        const input = this.inputText.value;
        this.updateCharCount(this.inputCharCount, input);
        
        if (!input) {
            this.outputText.value = '';
            this.updateCharCount(this.outputCharCount, '');
            return;
        }

        try {
            let output;
            if (this.currentMode === 'encode') {
                output = this.encodeBase64(input);
            } else {
                output = this.decodeBase64(input);
            }
            this.outputText.value = output;
            this.updateCharCount(this.outputCharCount, output);
        } catch (error) {
            this.outputText.value = `Error: ${error.message}`;
            this.showToast(`Error: ${error.message}`, 'error');
        }
    }

    encodeBase64(text) {
        try {
            let encoded = btoa(unescape(encodeURIComponent(text)));
            
            // URL-safe Base64 (RFC 4648)
            if (this.urlSafeToggle.checked) {
                encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            }
            
            return encoded;
        } catch (error) {
            throw new Error('Failed to encode: ' + error.message);
        }
    }

    decodeBase64(text) {
        try {
            let input = text.trim();
            
            // URL-safe to standard Base64
            if (this.urlSafeToggle.checked || /[-_]/.test(input)) {
                input = input.replace(/-/g, '+').replace(/_/g, '/');
                // Add padding if needed
                const padding = input.length % 4;
                if (padding) {
                    input += '='.repeat(4 - padding);
                }
            }
            
            const decoded = decodeURIComponent(escape(atob(input)));
            return decoded;
        } catch (error) {
            throw new Error('Invalid Base64 input. Check format and padding.');
        }
    }

    /**
     * ============================================
     * File Handling
     * ============================================
     */

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > this.MAX_FILE_SIZE) {
            this.showToast(`File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024 / 1024}MB.`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const base64String = content.split(',')[1] || content;
            this.inputText.value = base64String;
            this.handleInputChange();
            this.showToast('File uploaded successfully!');
            
            // Clear input
            event.target.value = '';
        };
        reader.onerror = () => {
            this.showToast('Error reading file.', 'error');
        };
        reader.readAsDataURL(file);
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUri = e.target.result;
            this.outputText.value = dataUri;
            this.updateCharCount(this.outputCharCount, dataUri);
            this.showToast('Image converted to data-URI!');
            this.addToHistory('Image to Data-URI', dataUri);
            
            // Clear input
            event.target.value = '';
        };
        reader.readAsDataURL(file);
    }

    /**
     * ============================================
     * Clipboard Operations
     * ============================================
     */

    async copyToClipboard() {
        const text = this.outputText.value;
        if (!text) {
            this.showToast('Nothing to copy.', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
            
            // Change button text temporarily
            const originalText = this.copyOutputBtn.textContent;
            this.copyOutputBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyOutputBtn.textContent = originalText;
            }, 2000);
        } catch (error) {
            this.showToast('Failed to copy to clipboard.', 'error');
        }
    }

    /**
     * ============================================
     * Download Operations
     * ============================================
     */

    downloadOutput() {
        const text = this.outputText.value;
        if (!text) {
            this.showToast('Nothing to download.', 'error');
            return;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', `base64-${Date.now()}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        this.showToast('Downloaded!');
    }

    /**
     * ============================================
     * JWT Token Decoding
     * ============================================
     */

    decodeJWT() {
        const input = this.inputText.value.trim();
        
        if (!input) {
            this.showToast('Please paste a JWT token in the input.', 'error');
            return;
        }

        try {
            const parts = input.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
            }

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            
            const decoded = {
                header,
                payload,
                signature: parts[2]
            };

            this.jwtPreview.textContent = JSON.stringify(decoded, null, 2);
            this.jwtOutput.classList.remove('hidden');
            this.showToast('JWT decoded successfully!');
        } catch (error) {
            this.showToast(`JWT decode error: ${error.message}`, 'error');
        }
    }

    /**
     * ============================================
     * Bulk Processing
     * ============================================
     */

    bulkProcess() {
        const input = this.inputText.value.trim();
        if (!input) {
            this.showToast('Please enter data to process.', 'error');
            return;
        }

        const lines = input.split('\n').filter(line => line.trim());
        let results = [];

        try {
            if (this.currentMode === 'encode') {
                results = lines.map(line => this.encodeBase64(line.trim()));
            } else {
                results = lines.map(line => this.decodeBase64(line.trim()));
            }

            this.outputText.value = results.join('\n');
            this.updateCharCount(this.outputCharCount, this.outputText.value);
            this.showToast(`Processed ${lines.length} line(s)!`);
        } catch (error) {
            this.showToast(`Bulk process error: ${error.message}`, 'error');
        }
    }

    /**
     * ============================================
     * Mode Switching
     * ============================================
     */

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update UI
        this.modeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });

        // Update placeholder text
        const modeLabel = mode === 'encode' ? 'encode' : 'decode';
        this.inputText.placeholder = `Enter text to ${modeLabel}, or paste Base64 to ${modeLabel === 'encode' ? 'decode' : 'encode'}...`;

        // Re-process if input exists
        if (this.inputText.value) {
            this.handleInputChange();
        }
    }

    /**
     * ============================================
     * History Management
     * ============================================
     */

    addToHistory(label, content) {
        const item = {
            id: Date.now(),
            label,
            content: content.substring(0, 100),
            fullContent: content,
            timestamp: new Date().toLocaleTimeString()
        };

        this.history.unshift(item);
        if (this.history.length > this.MAX_HISTORY_ITEMS) {
            this.history.pop();
        }

        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p class="empty-message">No history yet. Start encoding or decoding!</p>';
            return;
        }

        this.historyList.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-item-content">
                    <div class="history-item-label">${item.label} · ${item.timestamp}</div>
                    <div class="history-item-text" title="${item.fullContent}">${item.content}${item.fullContent.length > 100 ? '...' : ''}</div>
                </div>
                <div class="history-item-actions">
                    <button class="history-copy-btn" data-id="${item.id}" aria-label="Copy to input">Copy</button>
                    <button class="history-delete-btn" data-id="${item.id}" aria-label="Delete from history">Delete</button>
                </div>
            </div>
        `).join('');

        // Attach event listeners to history items
        this.historyList.querySelectorAll('.history-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const item = this.history.find(h => h.id === id);
                if (item) {
                    this.inputText.value = item.fullContent;
                    this.handleInputChange();
                    this.showToast('Restored from history!');
                }
            });
        });

        this.historyList.querySelectorAll('.history-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.history = this.history.filter(h => h.id !== id);
                this.saveHistory();
                this.renderHistory();
                this.showToast('Deleted from history.');
            });
        });
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
            this.showToast('History cleared.');
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('base64-history', JSON.stringify(this.history));
        } catch (error) {
            console.warn('Failed to save history:', error);
        }
    }

    loadHistory() {
        try {
            const data = localStorage.getItem('base64-history');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.warn('Failed to load history:', error);
            return [];
        }
    }

    /**
     * ============================================
     * Theme Management
     * ============================================
     */

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.currentTheme = newTheme;
        this.applyTheme();
        this.saveTheme();
        this.showToast(`Switched to ${newTheme} mode.`);
    }

    applyTheme() {
        const htmlElement = document.documentElement;
        htmlElement.setAttribute('data-theme', this.currentTheme);
        
        // Update toggle icon
        const icon = this.darkModeToggle.querySelector('.toggle-icon');
        icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }

    saveTheme() {
        try {
            localStorage.setItem('base64-theme', this.currentTheme);
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    }

    loadTheme() {
        try {
            const saved = localStorage.getItem('base64-theme');
            if (saved) return saved;
            
            // Detect system preference
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch (error) {
            return 'light';
        }
    }

    /**
     * ============================================
     * UI Utilities
     * ============================================
     */

    clearInput() {
        if (this.inputText.value && !confirm('Clear all input?')) {
            return;
        }
        this.inputText.value = '';
        this.outputText.value = '';
        this.updateCharCount(this.inputCharCount, '');
        this.updateCharCount(this.outputCharCount, '');
        this.jwtOutput.classList.add('hidden');
    }

    updateCharCount(element, text) {
        const count = text.length;
        const size = count > 1024 
            ? (count / 1024).toFixed(2) + ' KB'
            : count + ' characters';
        element.textContent = size;
    }

    handlePaste(event) {
        // Allow default paste behavior
        setTimeout(() => this.handleInputChange(), 0);
    }

    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + C: Copy output
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'c') {
            event.preventDefault();
            this.copyToClipboard();
        }
        
        // Ctrl/Cmd + D: Download output
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'd') {
            event.preventDefault();
            this.downloadOutput();
        }
        
        // Ctrl/Cmd + L: Clear input
        if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
            event.preventDefault();
            this.clearInput();
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-in reverse';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

/**
 * ============================================
 * Initialization
 * ============================================
 */

document.addEventListener('DOMContentLoaded', () => {
    new Base64App();
});
