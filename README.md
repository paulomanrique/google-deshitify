# Google Deshitify

**Google Deshitify** is a browser extension for Firefox and Chromium-based browsers that automatically removes the AI Overview (the annoying “Google AI answer” at the top of your search) and blocks results from sites you never want to see again.

- ⚡️ Instantly rewrites Google search URLs before the page loads (on Firefox).
- 🧹 Default filter removes **pleno.news** and lets you easily block other spammy/irrelevant sites (like Pinterest, Quora, etc).
- 🖱 Add any site to your blocklist with one click (“Add current website”).
- 🛡 Optionally disables only the AI Overview or runs with custom rules.
- 🖤 100% client-side, private, open source, and zero analytics.

---

## Features

- **Blocks Google AI Overview** with a simple toggle (default: on).
- **Persistent blacklist**: Add or remove any site, via table or one-click from the popup.
- **Works instantly**: Redirection happens before Google can even show the AI box or blocked sites (on Firefox).
- **No bloat, no trackers, no ads**.

---

## Installation

### 🔥 Easiest Way (Recommended)

**Download the ready-to-use package for your browser from the [latest release page](https://github.com/paulomanrique/google-deshitify/releases/latest):**

- [google-deshitify-firefox.zip](https://github.com/paulomanrique/google-deshitify/releases/latest)
- [google-deshitify-chrome.zip](https://github.com/paulomanrique/google-deshitify/releases/latest)

**Then:**

#### **For Firefox**
1. Unzip `google-deshitify-firefox.zip` to any folder.
2. Open `about:debugging#/runtime/this-firefox` in Firefox.
3. Click “Load Temporary Add-on…”
4. Select the `manifest.json` inside your unzipped folder.
5. That’s it! You’ll see the Deshitify icon; click it to access your settings.

#### **For Chrome/Chromium (Chrome, Opera, Edge, Brave, etc)**
1. Unzip `google-deshitify-chrome.zip` to any folder.
2. Go to `chrome://extensions` in your browser.
3. Enable “Developer mode” (top-right).
4. Click “Load unpacked” and select the unzipped folder with `manifest.json` inside.
5. **Important:**  
   After loading, click “Details” for Google Deshitify and enable  
   **“Allow access to search page results”**  
   (without this, the extension can't run on Google Search results pages!)
6. Extension is ready! Click the Deshitify icon to customize.

---

### 💻 Manual Build (for contributors/advanced users)

1. Clone the repo:
    ```sh
    git clone https://github.com/paulomanrique/google-deshitify.git
    cd google-deshitify
    ```
2. For **Firefox**:
    - Copy/rename `manifest_firefox.json` to `manifest.json`
    - Copy/rename `background_firefox.js` to `background.js`
3. For **Chrome/Chromium**:
    - Copy/rename `manifest_chrome.json` to `manifest.json`
    - Copy/rename `background_chrome.js` to `background.js`
4. Load as above.

---

## ⚠️ Chromium Browsers: Enable Search Page Access!

> **NOTE:**  
> On Chrome, Opera, Edge, Brave, and other Chromium-based browsers,  
> after loading the extension, click “Details” and enable  
> **“Allow access to search page results”**.  
> Otherwise, the extension cannot work on Google Search!

---

## Screenshots

![Screenshot of Google Deshitify extension](docs/screenshot.png)

---

## Advanced

- Add any site with "Add current website".
- You can block any domain, wildcard or not (e.g. `example.com`, `pinterest.*`, `subdomain.domain.com`).
- All options are saved locally and can be changed anytime from the popup.

---

## Browser compatibility

- **Firefox:** Instant redirect, no flicker, dynamic blacklist, full features.
- **Chrome/Chromium:** Dynamic blacklist and popup work perfectly.  
  URL filtering applies after page load, so a brief “flicker” may occur due to Manifest V3 restrictions.  
  **You must enable “Allow access to search page results” in extension details!**

---

## License

**Do what the fuck you want with this extension.**  
Really.  
If you want an official name, let's call it the MIT License:  
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following condition:  
>
> **Do not sue me if your Google stops working.**

---

## Credits

Developed by [Paulo Manrique](https://github.com/paulomanrique) and ChatGPT.  

---

**Enjoy your cleaner Google. Power to the searchers!**
