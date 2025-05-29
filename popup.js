function getFromStorage(keys, callback) {
  if (typeof browser !== "undefined") {
    browser.storage.local.get(keys).then(callback);
  } else if (typeof chrome !== "undefined") {
    chrome.storage.local.get(keys, callback);
  }
}

function saveToStorage(data, callback) {
  if (typeof browser !== "undefined") {
    browser.storage.local.set(data).then(callback);
  } else if (typeof chrome !== "undefined") {
    chrome.storage.local.set(data, callback);
  }
}

function getCurrentTabHostname(callback) {
  const query = { active: true, currentWindow: true };
  if (typeof browser !== "undefined") {
    browser.tabs.query(query).then(tabs => {
      let url = tabs[0]?.url || "";
      try {
        let host = new URL(url).hostname;
        callback(host);
      } catch {
        callback(null);
      }
    });
  } else if (typeof chrome !== "undefined") {
    chrome.tabs.query(query, tabs => {
      let url = tabs[0]?.url || "";
      try {
        let host = new URL(url).hostname;
        callback(host);
      } catch {
        callback(null);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const blacklistBody = document.getElementById('blacklistBody');
  const addForm = document.getElementById('addForm');
  const addSite = document.getElementById('addSite');
  const saveBtn = document.getElementById('save');
  const msg = document.getElementById('msg');
  const disableAiCheckbox = document.getElementById('disableAi');
  const addCurrentSiteBtn = document.getElementById('addCurrentSite');

  let blacklist = [];

  // Save blacklist and disableAi immediately
  function persistSettings() {
    let disableAi = disableAiCheckbox.checked;
    saveToStorage({ deshitifyBlacklist: blacklist, disableAi });
  }

  // Render the blacklist table
  function renderTable() {
    blacklistBody.innerHTML = '';
    blacklist.forEach((site, idx) => {
      const row = document.createElement('tr');
      const tdSite = document.createElement('td');
      tdSite.textContent = site;
      const tdRemove = document.createElement('td');
      tdRemove.style.textAlign = 'right';
      const btn = document.createElement('button');
      btn.textContent = '❌';
      btn.title = 'Remove';
      btn.style.border = 'none';
      btn.style.background = 'transparent';
      btn.style.cursor = 'pointer';
      btn.onclick = () => {
        blacklist.splice(idx, 1);
        persistSettings();
        renderTable();
      };
      tdRemove.appendChild(btn);
      row.appendChild(tdSite);
      row.appendChild(tdRemove);
      blacklistBody.appendChild(row);
    });
  }

  // Load settings from storage
  getFromStorage(['deshitifyBlacklist', 'disableAi'], res => {
    blacklist = (res.deshitifyBlacklist || ["pleno.news"]);
    disableAiCheckbox.checked = typeof res.disableAi === 'undefined' ? true : res.disableAi;
    renderTable();
  });

  // Add site form
  addForm.onsubmit = function (e) {
    e.preventDefault();
    const site = addSite.value.trim();
    if (site && !blacklist.includes(site)) {
      blacklist.push(site);
      persistSettings();
      renderTable();
      addSite.value = '';
    }
  };

  // Add current website button
  addCurrentSiteBtn.onclick = function () {
    getCurrentTabHostname(host => {
      if (!host) {
        msg.innerText = "Could not get current website.";
        setTimeout(() => msg.innerText = '', 1500);
        return;
      }
      host = host.replace(/^www\./, "");
      if (!blacklist.includes(host)) {
        blacklist.push(host);
        persistSettings();
        renderTable();
        msg.innerText = `Added: ${host}`;
        setTimeout(() => msg.innerText = '', 1500);
      } else {
        msg.innerText = `Already in the list: ${host}`;
        setTimeout(() => msg.innerText = '', 1500);
      }
    });
  };

  // Save settings (button)
  saveBtn.onclick = function () {
    let disableAi = disableAiCheckbox.checked;
    saveToStorage({ deshitifyBlacklist: blacklist, disableAi }, () => {
      msg.innerText = 'Settings saved!';
      setTimeout(() => msg.innerText = '', 1500);
    });
  };

  // Save disableAi when toggled
  disableAiCheckbox.onchange = function () {
    persistSettings();
  };
});
