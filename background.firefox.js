function getBlacklist(callback) {
  if (typeof browser !== "undefined") {
    browser.storage.local.get(['deshitifyBlacklist']).then(res => {
      callback(res.deshitifyBlacklist || ["pleno.news"]);
    });
  } else if (typeof chrome !== "undefined") {
    chrome.storage.local.get(['deshitifyBlacklist'], res => {
      callback(res.deshitifyBlacklist || ["pleno.news"]);
    });
  }
}

function shouldRedirect(url, blacklist) {
  const parsed = new URL(url);
  const q = parsed.searchParams.get('q');
  if (!q) return null;

  let newQ = q;
  let changed = false;

  blacklist.forEach(site => {
    const term = `-site:${site}`;
    if (!newQ.includes(term)) {
      newQ += " " + term;
      changed = true;
    }
  });

  if (parsed.searchParams.get('udm') !== '14') {
    parsed.searchParams.set('udm', '14');
    changed = true;
  }

  if (parsed.searchParams.has('tbm')) {
    parsed.searchParams.delete('tbm');
    changed = true;
  }

  if (changed) {
    parsed.searchParams.set('q', newQ.trim());
    return parsed.toString();
  }
  return null;
}

const googlePattern = [
  "*://www.google.com/search*",
  "*://www.google.*/*"
];

if (typeof browser !== "undefined") {
  browser.webRequest.onBeforeRequest.addListener(
    (details) => new Promise(resolve => {
      getBlacklist((blacklist) => {
        const redirectUrl = shouldRedirect(details.url, blacklist);
        if (redirectUrl) {
          resolve({ redirectUrl });
        } else {
          resolve({});
        }
      });
    }),
    { urls: googlePattern, types: ["main_frame"] },
    ["blocking"]
  );
} else if (typeof chrome !== "undefined") {
  chrome.webRequest.onBeforeRequest.addListener(
    (details, _, cb) => {
      getBlacklist((blacklist) => {
        const redirectUrl = shouldRedirect(details.url, blacklist);
        if (redirectUrl) {
          cb({ redirectUrl });
        } else {
          cb({});
        }
      });
      return true;
    },
    { urls: googlePattern, types: ["main_frame"] },
    ["blocking"]
  );
}
