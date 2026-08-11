'use strict';

(function () {
    var storageKey = 'base64-cookie-consent';

    function getStoredChoice() {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return 'unavailable';
        }
    }

    function storeChoice(value) {
        try {
            localStorage.setItem(storageKey, value);
        } catch (error) {
            // Consent disclosure remains visible if storage is unavailable.
        }
    }

    function closeBanner(banner, value) {
        storeChoice(value);
        banner.setAttribute('hidden', '');
    }

    if (getStoredChoice()) {
        return;
    }

    window.addEventListener('DOMContentLoaded', function () {
        var banner = document.createElement('section');
        banner.className = 'cookie-consent';
        banner.setAttribute('aria-label', 'Cookie and advertising notice');
        banner.innerHTML = [
            '<div class="cookie-consent__text">',
            '<strong>Cookie notice</strong>',
            '<span>We use local browser storage for preferences and Google AdSense may use cookies or similar technologies for ads. Read our <a href="/privacy.html">Privacy Policy</a>.</span>',
            '</div>',
            '<div class="cookie-consent__actions">',
            '<button type="button" class="cookie-consent__secondary" data-cookie-choice="dismissed">Dismiss</button>',
            '<button type="button" class="cookie-consent__primary" data-cookie-choice="accepted">Accept</button>',
            '</div>'
        ].join('');

        banner.addEventListener('click', function (event) {
            var button = event.target.closest('[data-cookie-choice]');
            if (button) {
                closeBanner(banner, button.getAttribute('data-cookie-choice'));
            }
        });

        document.body.appendChild(banner);
    });
}());
