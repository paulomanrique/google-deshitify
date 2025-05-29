(function() {
  function getSettings(cb) {
    if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
      browser.storage.local.get(['deshitifyBlacklist']).then(res => {
        cb(res.deshitifyBlacklist || ["pleno.news"]);
      });
    } else if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['deshitifyBlacklist'], res => {
        cb(res.deshitifyBlacklist || ["pleno.news"]);
      });
    } else {
      cb(["pleno.news"]);
    }
  }

  function deshitify(blacklist) {
    const url = new URL(window.location.href);
    const q = url.searchParams.get('q');
    if (!q) return;

    let newQ = q;
    let changed = false;

    // Adiciona blacklist de sites excluídos na query
    blacklist.forEach(site => {
      const term = `-site:${site}`;
      if (!newQ.includes(term)) {
        newQ += " " + term;
        changed = true;
      }
    });

    // Força parâmetro udm=14 para versão limpa (sem IA, anúncios)
    if (url.searchParams.get('udm') !== '14') {
      url.searchParams.set('udm', '14');
      changed = true;
    }

    // Remove tbm se existir para evitar conflito com udm
    if (url.searchParams.has('tbm')) {
      url.searchParams.delete('tbm');
      changed = true;
    }

    if (changed) {
      url.searchParams.set('q', newQ.trim());
      if (window.location.href !== url.toString()) {
        window.location.replace(url.toString());
      }
    }
  }

  // Executa na inicialização e monitora mudanças de URL SPA
  getSettings(blacklist => deshitify(blacklist));

  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      getSettings(blacklist => deshitify(blacklist));
    }
  }, 1000);
})();
