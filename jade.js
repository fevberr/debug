javascript:(function() {
    if (!window._dbg) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
        document.head.appendChild(link);
        
        let overlay = document.createElement("div");
        overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;backdrop-filter:blur(6px);background:rgba(0,0,0,.3);z-index:999999;display:flex;align-items:center;justify-content:center;opacity:0;transition:.2s";
        document.body.appendChild(overlay);
        window._dbg = overlay;
        setTimeout(() => overlay.style.opacity = "1", 10);
    }
    
    let modal = document.createElement("div");
    modal.style = "width:95%;max-width:1400px;height:90%;background:#0a1f0a;color:#b8e4b8;border:2px solid #2d8c2d;border-radius:12px;display:flex;flex-direction:column;font-family:'Segoe UI',Consolas,monospace;overflow:hidden;box-shadow:0 0 35px rgba(45,140,45,.3);transform:scale(.9);opacity:0;transition:.2s";
    
    let header = document.createElement("div");
    header.style = "display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid #2d8c2d;background:#0a2a0a;flex-shrink:0";
    
    let title = document.createElement("div");
    title.innerHTML = '<i class="fa-solid fa-bug"></i> Jade Debug';
    title.style = "font-weight:bold;font-size:15px";
    
    let closeBtn = document.createElement("i");
    closeBtn.className = "fa-solid fa-xmark";
    closeBtn.style = "cursor:pointer;font-size:18px;color:#b8e4b8;transition:.2s";
    closeBtn.onmouseover = () => closeBtn.style.color = "#ff6b6b";
    closeBtn.onmouseout = () => closeBtn.style.color = "#b8e4b8";
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    let body = document.createElement("div");
    body.style = "flex:1;display:flex;overflow:hidden;min-height:0";
    
    let sidebar = document.createElement("div");
    sidebar.style = "width:260px;background:#0a2a0a;border-right:1px solid #1a4a1a;display:flex;flex-direction:column;overflow:hidden;flex-shrink:0";
    
    let tabsContainer = document.createElement("div");
    tabsContainer.style = "flex:1;overflow-y:auto;overflow-x:hidden";
    sidebar.appendChild(tabsContainer);
    
    let contentArea = document.createElement("div");
    contentArea.style = "flex:1;display:flex;flex-direction:column;padding:15px;overflow:hidden;min-width:0";
    
    let searchBox = document.createElement("input");
    searchBox.placeholder = "🔍 Filter content...";
    searchBox.style = "width:100%;padding:10px;background:#0a2a0a;border:1px solid #2d8c2d;border-radius:5px;color:#b8e4b8;margin-bottom:12px;font-size:12px;box-sizing:border-box";
    searchBox.setAttribute("autocomplete", "off");
    
    let controlsBar = document.createElement("div");
    controlsBar.style = "display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;flex-shrink:0";
    
    let copyBtn = document.createElement("button");
    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
    copyBtn.style = "padding:8px 14px;background:#1a5a1a;border:none;border-radius:4px;color:#b8e4b8;cursor:pointer;font-size:12px;transition:.1s";
    copyBtn.onmouseover = () => copyBtn.style.background = "#2a7a2a";
    copyBtn.onmouseout = () => copyBtn.style.background = "#1a5a1a";
    
    let copyRawBtn = document.createElement("button");
    copyRawBtn.innerHTML = '<i class="fa-regular fa-file"></i> Copy Raw';
    copyRawBtn.style = "padding:8px 14px;background:#1a4a1a;border:none;border-radius:4px;color:#b8e4b8;cursor:pointer;font-size:12px;transition:.1s";
    
    let saveBtn = document.createElement("button");
    saveBtn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Save';
    saveBtn.style = "padding:8px 14px;background:#1a6a1a;border:none;border-radius:4px;color:#b8e4b8;cursor:pointer;font-size:12px;transition:.1s";
    
    let clearBtn = document.createElement("button");
    clearBtn.innerHTML = '<i class="fa-regular fa-trash-alt"></i> Clear';
    clearBtn.style = "padding:8px 14px;background:#4a1a1a;border:none;border-radius:4px;color:#b8e4b8;cursor:pointer;font-size:12px;transition:.1s";
    
    let wordWrapBtn = document.createElement("button");
    wordWrapBtn.innerHTML = '<i class="fa-solid fa-wrap"></i> Wrap';
    wordWrapBtn.style = "padding:8px 14px;background:#1a5a1a;border:none;border-radius:4px;color:#b8e4b8;cursor:pointer;font-size:12px;transition:.1s";
    
    let refreshBtn = document.createElement("button");
    refreshBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refresh';
    refreshBtn.style = "padding:8px 14px;background:#4a2a1a;border:none;border-radius:4px;color:#b8e4b8;cursor:pointer;font-size:12px;transition:.1s";
    
    controlsBar.appendChild(copyBtn);
    controlsBar.appendChild(copyRawBtn);
    controlsBar.appendChild(saveBtn);
    controlsBar.appendChild(clearBtn);
    controlsBar.appendChild(wordWrapBtn);
    controlsBar.appendChild(refreshBtn);
    
    let output = document.createElement("div");
    output.style = "flex:1;overflow:auto;background:#0a1f0a;border-radius:6px;padding:15px;font-family:'Consolas','Monaco',monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;user-select:text;cursor:text;border:1px solid #1a4a1a;min-height:0";
    output.setAttribute("contenteditable", "false");
    output.style.userSelect = "text";
    
    let currentData = "";
    let currentRawData = "";
    let wordWrapEnabled = true;
    
    wordWrapBtn.onclick = () => {
        wordWrapEnabled = !wordWrapEnabled;
        output.style.whiteSpace = wordWrapEnabled ? "pre-wrap" : "pre";
        output.style.wordWrap = wordWrapEnabled ? "break-word" : "normal";
        wordWrapBtn.style.background = wordWrapEnabled ? "#1a5a1a" : "#1a4a1a";
    };
    
    let tabs = [
        { name: "Window Properties", icon: "fa-window-maximize", group: "General" },
        { name: "Global Variables", icon: "fa-database", group: "General" },
        { name: "All Functions", icon: "fa-code", group: "General" },
        { name: "DOM Elements", icon: "fa-tag", group: "DOM" },
        { name: "DOM Attributes", icon: "fa-list", group: "DOM" },
        { name: "Event Listeners", icon: "fa-bolt", group: "Events" },
        { name: "Network Resources", icon: "fa-network-wired", group: "Network" },
        { name: "Cookies", icon: "fa-cookie-bite", group: "Storage" },
        { name: "Local Storage", icon: "fa-database", group: "Storage" },
        { name: "Session Storage", icon: "fa-database", group: "Storage" },
        { name: "All Images", icon: "fa-image", group: "Media" },
        { name: "All Links", icon: "fa-link", group: "DOM" },
        { name: "All Scripts", icon: "fa-code", group: "DOM" },
        { name: "All Styles", icon: "fa-paintbrush", group: "DOM" },
        { name: "All Forms", icon: "fa-form", group: "DOM" },
        { name: "All Inputs", icon: "fa-keyboard", group: "DOM" },
        { name: "Meta Tags", icon: "fa-tags", group: "DOM" },
        { name: "Page Information", icon: "fa-info-circle", group: "General" },
        { name: "Performance", icon: "fa-gauge-high", group: "System" },
        { name: "Memory Usage", icon: "fa-microchip", group: "System" },
        { name: "Browser Info", icon: "fa-browser", group: "System" },
        { name: "Plugins", icon: "fa-puzzle-piece", group: "System" },
        { name: "Console Methods", icon: "fa-terminal", group: "Debug" },
        { name: "All Selectors", icon: "fa-magnifying-glass", group: "DOM" },
        { name: "Unique IDs", icon: "fa-id-card", group: "DOM" },
        { name: "Unique Classes", icon: "fa-class", group: "DOM" },
        { name: "Data Attributes", icon: "fa-database", group: "DOM" },
        { name: "z-index Values", icon: "fa-layer-group", group: "CSS" },
        { name: "Hidden Elements", icon: "fa-eye-slash", group: "CSS" },
        { name: "Colors Used", icon: "fa-palette", group: "CSS" }
    ];
    
    let tabGroups = {};
    tabs.forEach(tab => {
        if (!tabGroups[tab.group]) tabGroups[tab.group] = [];
        tabGroups[tab.group].push(tab);
    });
    
    let currentTabIndex = 0;
    let scrollPositions = {};
    let tabElements = [];
    
    function getTabContent(tab) {
        try {
            switch (tab.name) {
                case "Window Properties":
                    return Object.keys(window).sort().slice(0, 500).join("\n");
                    
                case "Global Variables":
                    let vars = {};
                    for (let key in window) {
                        try {
                            if (window[key] && typeof window[key] == 'object' && key != '_dbg') {
                                vars[key] = typeof window[key];
                            }
                        } catch(e) {}
                    }
                    return JSON.stringify(vars, null, 2).slice(0, 15000);
                    
                case "All Functions":
                    return Object.keys(window)
                        .filter(key => typeof window[key] == 'function')
                        .sort()
                        .slice(0, 300)
                        .join("\n");
                        
                case "DOM Elements":
                    let elements = [...document.all].slice(0, 300);
                    return `Total Elements: ${document.all.length}\n\n` + 
                        elements.map((el, i) => {
                            return `${i+1}. <${el.tagName.toLowerCase()}${el.id ? ' #' + el.id : ''}${el.className ? ' .' + el.className.split(' ')[0] : ''}>`;
                        }).join("\n");
                        
                case "DOM Attributes":
                    let attributes = new Set();
                    document.querySelectorAll("*").forEach(el => {
                        [...el.attributes].forEach(attr => attributes.add(attr.name));
                    });
                    return [...attributes].sort().join("\n");
                    
                case "Event Listeners":
                    return "Run getEventListeners(element) in Chrome Console";
                    
                case "Network Resources":
                    return performance.getEntriesByType("resource")
                        .slice(0, 200)
                        .map(r => `${r.name.split('/').pop()} (${(r.duration || 0).toFixed(0)}ms, ${((r.transferSize || 0) / 1024).toFixed(0)}KB)`)
                        .join("\n");
                        
                case "Cookies":
                    return document.cookie.split("; ").map(c => c.split("=")[0]).join("\n") + 
                        "\n\n--- Full Values ---\n" + document.cookie.replace(/;/g, ";\n");
                        
                case "Local Storage":
                    let localStorageItems = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        let key = localStorage.key(i);
                        localStorageItems.push(`${key}: ${localStorage.getItem(key).substring(0, 150)}`);
                    }
                    return localStorageItems.join("\n\n") || "(empty)";
                    
                case "Session Storage":
                    let sessionStorageItems = [];
                    for (let i = 0; i < sessionStorage.length; i++) {
                        let key = sessionStorage.key(i);
                        sessionStorageItems.push(`${key}: ${sessionStorage.getItem(key).substring(0, 150)}`);
                    }
                    return sessionStorageItems.join("\n\n") || "(empty)";
                    
                case "All Images":
                    return [...document.images].map((img, i) => 
                        `${i+1}. ${img.src || 'no src'} (${img.width}x${img.height})`
                    ).join("\n") || "(no images)";
                    
                case "All Links":
                    return [...document.links].slice(0, 200).map((link, i) => 
                        `${i+1}. ${link.href.substring(0, 100)}`
                    ).join("\n") || "(no links)";
                    
                case "All Scripts":
                    return [...document.scripts].map((script, i) => 
                        `${i+1}. ${script.src || 'inline script'}`
                    ).join("\n") || "(no scripts)";
                    
                case "All Styles":
                    return [...document.styleSheets].map((sheet, i) => 
                        `${i+1}. ${sheet.href || 'inline/style tag'} (${sheet.cssRules?.length || 0} rules)`
                    ).join("\n") || "(no styles)";
                    
                case "All Forms":
                    return [...document.forms].map((form, i) => 
                        `${i+1}. ${form.name || 'unnamed'} (${form.elements.length} fields)`
                    ).join("\n") || "(no forms)";
                    
                case "All Inputs":
                    return [...document.querySelectorAll("input,textarea,select,button")].slice(0, 200).map(el => 
                        `<${el.tagName.toLowerCase()}> ${el.name || el.id || 'unnamed'}`
                    ).join("\n");
                    
                case "Meta Tags":
                    return [...document.querySelectorAll("meta")].map(meta => 
                        `${meta.getAttribute("name") || meta.getAttribute("property") || 'meta'}: ${(meta.getAttribute("content") || '').substring(0, 100)}`
                    ).join("\n");
                    
                case "Page Information":
                    return `URL: ${location.href}
Title: ${document.title}
Elements: ${document.all.length}
Viewport: ${innerWidth}x${innerHeight}
Scroll: ${scrollX},${scrollY}
Device Pixel Ratio: ${devicePixelRatio}
Color Scheme: ${matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}`;
                    
                case "Performance":
                    let perf = performance.timing;
                    return `Page Load: ${perf.loadEventEnd - perf.navigationStart}ms
DOM Ready: ${perf.domContentLoadedEventEnd - perf.navigationStart}ms
Response: ${perf.responseEnd - perf.requestStart}ms
DNS: ${perf.domainLookupEnd - perf.domainLookupStart}ms
TCP: ${perf.connectEnd - perf.connectStart}ms`;
                    
                case "Memory Usage":
                    if (performance.memory) {
                        return `Used: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB
Total: ${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)}MB
Limit: ${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`;
                    }
                    return "Not available (use Chrome)";
                    
                case "Browser Info":
                    return `User Agent: ${navigator.userAgent}
Platform: ${navigator.platform}
Language: ${navigator.language}
Cookies: ${navigator.cookieEnabled}
Online: ${navigator.onLine}`;
                    
                case "Plugins":
                    return [...navigator.plugins].slice(0, 50).map(p => p.name).join("\n") || "(no plugins)";
                    
                case "Console Methods":
                    return Object.keys(console)
                        .filter(k => typeof console[k] == 'function')
                        .sort()
                        .join("\n");
                        
                case "All Selectors":
                    let selectorCounts = {};
                    document.querySelectorAll("*").forEach(el => {
                        let sel = el.tagName.toLowerCase();
                        if (el.id) {
                            sel += `#${el.id}`;
                        } else if (el.className && typeof el.className == "string") {
                            sel += `.${el.className.split(" ")[0]}`;
                        }
                        selectorCounts[sel] = (selectorCounts[sel] || 0) + 1;
                    });
                    return Object.entries(selectorCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 80)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join("\n");
                        
                case "Unique IDs":
                    return [...document.querySelectorAll("[id]")]
                        .map(el => el.id)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .sort()
                        .slice(0, 200)
                        .join("\n");
                        
                case "Unique Classes":
                    let classes = new Set();
                    document.querySelectorAll("[class]").forEach(el => {
                        el.className.split(" ").forEach(c => c && classes.add(c));
                    });
                    return [...classes].sort().slice(0, 200).join("\n");
                    
                case "Data Attributes":
                    return [...document.querySelectorAll("[data-*]")].slice(0, 200)
                        .map(el => [...el.attributes]
                            .filter(attr => attr.name.startsWith("data-"))
                            .map(attr => `${attr.name}="${attr.value.substring(0, 50)}"`))
                        .flat()
                        .join("\n");
                        
                case "z-index Values":
                    let zIndices = [];
                    document.querySelectorAll("*").forEach(el => {
                        let z = getComputedStyle(el).zIndex;
                        if (z !== 'auto' && z !== '0') {
                            zIndices.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}: ${z}`);
                        }
                    });
                    return zIndices.slice(0, 100).join("\n");
                    
                case "Hidden Elements":
                    return [...document.querySelectorAll("[hidden], [style*='display:none'], [style*='visibility:hidden']")].slice(0, 100)
                        .map(el => `<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}>`)
                        .join("\n");
                        
                case "Colors Used":
                    let colors = new Set();
                    [...document.querySelectorAll("*")].slice(0, 500).forEach(el => {
                        let computed = getComputedStyle(el);
                        colors.add(computed.color);
                        colors.add(computed.backgroundColor);
                    });
                    return [...colors].slice(0, 50).join("\n");
                    
                default:
                    return "Loading...";
            }
        } catch(e) {
            return `Error: ${e.message}`;
        }
    }
    
    for (let groupName in tabGroups) {
        let groupHeader = document.createElement("div");
        groupHeader.innerHTML = `<i class="fa-solid fa-folder"></i> <span style="font-weight:bold;font-size:11px;text-transform:uppercase;opacity:0.7">${groupName}</span>`;
        groupHeader.style = "padding:12px 15px 5px 15px;color:#2d8c2d;font-size:11px;border-bottom:1px solid #1a4a1a;margin-top:5px";
        tabsContainer.appendChild(groupHeader);
        
        tabGroups[groupName].forEach((tab, index) => {
            let tabButton = document.createElement("div");
            tabButton.innerHTML = `<i class="fa-solid ${tab.icon}" style="width:20px;display:inline-block"></i> <span style="margin-left:5px;font-size:12px">${tab.name}</span>`;
            tabButton.style = "padding:8px 15px;cursor:pointer;transition:.1s;font-size:12px;border-left:2px solid transparent;color:#b8e4b8";
            
            tabButton.onmouseover = () => {
                if (tabButton.style.background != "#1a5a1a") {
                    tabButton.style.background = "#1a3a1a";
                }
            };
            tabButton.onmouseout = () => {
                if (tabButton.style.background != "#1a5a1a") {
                    tabButton.style.background = "";
                }
            };
            
            tabButton.onclick = () => {
                if (currentTabIndex !== undefined && tabElements[currentTabIndex]) {
                    scrollPositions[currentTabIndex] = output.scrollTop;
                    tabElements[currentTabIndex].style.background = "";
                    tabElements[currentTabIndex].style.borderLeftColor = "transparent";
                }
                
                tabButton.style.background = "#1a5a1a";
                tabButton.style.borderLeftColor = "#2d8c2d";
                currentTabIndex = tabElements.indexOf(tabButton);
                
                try {
                    let result = getTabContent(tab);
                    currentRawData = result;
                    currentData = result;
                    output.innerText = result;
                    searchBox.value = "";
                    
                    if (scrollPositions[currentTabIndex]) {
                        output.scrollTop = scrollPositions[currentTabIndex];
                    } else {
                        output.scrollTop = 0;
                    }
                } catch(e) {
                    currentData = `Error: ${e.message}`;
                    output.innerText = currentData;
                }
            };
            
            tabsContainer.appendChild(tabButton);
            tabElements.push(tabButton);
        });
    }
    
    if (tabElements.length) {
        setTimeout(() => tabElements[0].click(), 100);
    }
    
    body.appendChild(sidebar);
    body.appendChild(contentArea);
    contentArea.appendChild(searchBox);
    contentArea.appendChild(controlsBar);
    contentArea.appendChild(output);
    modal.appendChild(header);
    modal.appendChild(body);
    window._dbg.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.transform = "scale(1)";
    }, 10);
    
    refreshBtn.onclick = () => {
        if (currentTabIndex !== undefined && tabElements[currentTabIndex]) {
            let tabName = tabElements[currentTabIndex].innerText.trim();
            let foundTab = tabs.find(t => t.name === tabName);
            if (foundTab) {
                let result = getTabContent(foundTab);
                currentRawData = result;
                currentData = result;
                output.innerText = result;
                refreshBtn.innerHTML = '<i class="fa-solid fa-check"></i> Refreshed!';
                setTimeout(() => {
                    refreshBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refresh';
                }, 1000);
            }
        }
    };
    
    copyBtn.onclick = () => {
        let textarea = document.createElement("textarea");
        textarea.value = output.innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        copyBtn.innerHTML = '<i class="fa-regular fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 1500);
    };
    
    copyRawBtn.onclick = () => {
        let textarea = document.createElement("textarea");
        textarea.value = currentRawData;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        copyRawBtn.innerHTML = '<i class="fa-regular fa-check"></i> Raw Copied!';
        setTimeout(() => {
            copyRawBtn.innerHTML = '<i class="fa-regular fa-file"></i> Copy Raw';
        }, 1500);
    };
    
    saveBtn.onclick = () => {
        let currentTabName = tabElements[currentTabIndex]?.innerText.trim() || "debug";
        let blob = new Blob([currentData], { type: "text/plain" });
        let link = document.createElement("a");
        let url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `debug_${currentTabName.toLowerCase().replace(/ /g, "_")}_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        saveBtn.innerHTML = '<i class="fa-regular fa-check"></i> Saved!';
        setTimeout(() => {
            saveBtn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Save';
        }, 1500);
    };
    
    clearBtn.onclick = () => {
        output.innerText = "";
        currentData = "";
        clearBtn.innerHTML = '<i class="fa-regular fa-check"></i> Cleared!';
        setTimeout(() => {
            clearBtn.innerHTML = '<i class="fa-regular fa-trash-alt"></i> Clear';
        }, 1500);
    };
    
    searchBox.oninput = () => {
        let query = searchBox.value.toLowerCase();
        if (!query) {
            output.innerText = currentData;
            return;
        }
        let lines = currentData.split("\n");
        let filtered = lines.filter(line => line.toLowerCase().includes(query));
        output.innerText = filtered.join("\n") || "No matches found";
    };
    
    closeBtn.onclick = () => {
        modal.remove();
        window._dbg.remove();
        window._dbg = null;
    };
})();
