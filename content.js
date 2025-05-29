(function() {
    // Get blacklist and disableAi option from storage
    function getSettings(cb) {
      if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
        browser.storage.local.get(['deshitifyBlacklist', 'disableAi']).then(res => {
          cb(
            res.deshitifyBlacklist || ["pinterest.*", "quora.*"],
            typeof res.disableAi === "undefined" ? true : res.disableAi
          );
        });
      } else if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['deshitifyBlacklist', 'disableAi'], res => {
          cb(
            res.deshitifyBlacklist || ["pinterest.*", "quora.*"],
            typeof res.disableAi === "undefined" ? true : res.disableAi
          );
        });
      } else {
        cb(["pinterest.*", "quora.*"], true);
      }
    }
  
    function deshitify(blacklist, disableAi) {
      // Build required search terms
      let mustHave = blacklist.map(site => `-site:${site}`);
      if (disableAi) {
        mustHave.unshift("-ai");
      }
      const url = new URL(window.location.href);
      const q = url.searchParams.get('q');
      if (!q) return;
  
      let newQ = q;
      let changed = false;
  
      mustHave.forEach(term => {
        if (!newQ.includes(term)) {
          newQ += " " + term;
          changed = true;
        }
      });
  
      if (changed) {
        url.searchParams.set('q', newQ.trim());
        if (window.location.href !== url.toString()) {
          window.location.replace(url.toString());
        }
      }
    }
  
    // Initial check
    getSettings((blacklist, disableAi) => deshitify(blacklist, disableAi));
  
    // SPA support
    let lastHref = location.href;
    setInterval(() => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        getSettings((blacklist, disableAi) => deshitify(blacklist, disableAi));
      }
    }, 1000);
  })();
  