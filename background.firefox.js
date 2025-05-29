function getBlacklistAndAi(callback) {
    if (typeof browser !== "undefined") {
      browser.storage.local.get(['deshitifyBlacklist', 'disableAi']).then(res => {
        callback(
          res.deshitifyBlacklist || ["pinterest.*", "pleno.news"],
          typeof res.disableAi === "undefined" ? true : res.disableAi
        );
      });
    } else if (typeof chrome !== "undefined") {
      chrome.storage.local.get(['deshitifyBlacklist', 'disableAi'], res => {
        callback(
          res.deshitifyBlacklist || ["pinterest.*", "pleno.news"],
          typeof res.disableAi === "undefined" ? true : res.disableAi
        );
      });
    }
  }
  
  function shouldRedirect(url, blacklist, disableAi) {
    const parsed = new URL(url);
    const q = parsed.searchParams.get('q');
    if (!q) return null;
  
    let mustHave = blacklist.map(site => `-site:${site}`);
    if (disableAi) mustHave.unshift("-ai");
  
    let newQ = q;
    let changed = false;
    mustHave.forEach(term => {
      if (!newQ.includes(term)) {
        newQ += " " + term;
        changed = true;
      }
    });
    if (changed) {
      parsed.searchParams.set('q', newQ.trim());
      if (url !== parsed.toString()) {
        return parsed.toString();
      }
    }
    return null;
  }
  
  const googlePattern = [
    "*://www.google.com/*",
    "*://www.google.*/*"
    // Adicione todos os domínios regionais do Google aqui, igual ao matches
  ];
  
  // Listener for navigation
  if (typeof browser !== "undefined") {
    browser.webRequest.onBeforeRequest.addListener(
      (details) => {
        return new Promise(resolve => {
          getBlacklistAndAi((blacklist, disableAi) => {
            const redirectUrl = shouldRedirect(details.url, blacklist, disableAi);
            if (redirectUrl) {
              resolve({ redirectUrl });
            } else {
              resolve({});
            }
          });
        });
      },
      { urls: googlePattern, types: ["main_frame"] },
      ["blocking"]
    );
  } else if (typeof chrome !== "undefined") {
    chrome.webRequest.onBeforeRequest.addListener(
      (details, _, cb) => {
        getBlacklistAndAi((blacklist, disableAi) => {
          const redirectUrl = shouldRedirect(details.url, blacklist, disableAi);
          if (redirectUrl) {
            cb({ redirectUrl });
          } else {
            cb({});
          }
        });
        // Required to return true for async callback
        return true;
      },
      { urls: googlePattern, types: ["main_frame"] },
      ["blocking"]
    );
  }
  