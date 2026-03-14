document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURATION ---
    // --- CONFIGURATION (Now dynamic) ---
    let NOTION_SECRET, DATABASE_ID;
    const MAX_K = 300;

    chrome.storage.local.get(['NOTION_SECRET', 'DATABASE_ID'], function(data) {
        NOTION_SECRET = data.NOTION_SECRET;
        DATABASE_ID = data.DATABASE_ID;
    });
    // ---------------------

    const articleUrl = document.getElementById('articleUrl');
    const addArticleBtn = document.getElementById('addArticle');
    const addCurrentSiteBtn = document.getElementById('addCurrentSite');
    const readingList = document.getElementById('readingList');

    chrome.storage.sync.get(['readingList'], function(result) {
        const list = result.readingList || [];
        renderReadingList(list);
    });

    addCurrentSiteBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            addArticle(currentTab.url, currentTab.title);
        });
    });

    addArticleBtn.addEventListener('click', function() {
        const url = articleUrl.value.trim();
        if (url) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const title = tabs[0] ? tabs[0].title : "New Article";
                addArticle(url, title);
                articleUrl.value = '';
            });
        }
    });

    async function saveToNotion(url, title) {
        // Safety check: if env vars aren't loaded yet, fetch them again
        if (!NOTION_SECRET || !DATABASE_ID) {
            const data = await chrome.storage.local.get(['NOTION_SECRET', 'DATABASE_ID']);
            NOTION_SECRET = data.NOTION_SECRET;
            DATABASE_ID = data.DATABASE_ID;
        }
    
        if (!NOTION_SECRET) return console.error("Missing Notion Secret!");
    
        try {
            await fetch('https://api.notion.com/v1/pages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_SECRET}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                },
                body: JSON.stringify({
                    parent: { database_id: DATABASE_ID },
                    properties: {
                        'Name': { title: [{ text: { content: title } }] },
                        'URL': { url: url }
                    }
                })
            });
        } catch (e) { console.error('Notion Sync Error:', e); }
    }

    function addArticle(url, title) {
        // Check if keys exist before doing anything
        chrome.storage.local.get(['NOTION_SECRET', 'DATABASE_ID'], function(data) {
            if (!data.NOTION_SECRET || !data.DATABASE_ID) {
                alert("Error: Notion keys not found! Please right-click the extension icon and go to 'Options' to set them.");
                return;
            }
    
            // If keys exist, proceed with saving
            chrome.storage.sync.get(['readingList'], function(result) {
                let list = result.readingList || [];
                list.unshift({url, title, read: false, animate: true});
    
                if (list.length > MAX_K) {
                    list = list.slice(0, MAX_K);
                }
    
                chrome.storage.sync.set({readingList: list}, function() {
                    renderReadingList(list);
                    saveToNotion(url, title); // Now we know the keys are there
                });
            });
        });
    }

    function renderReadingList(list) {
        readingList.innerHTML = '';
        list.forEach((article, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // If it's a newly added item, apply animation
            if (article.isNew) {
                card.classList.add('new-item-animate');
                // Remove the flag so it doesn't animate again on next refresh
                delete article.isNew; 
                chrome.storage.sync.set({readingList: list}); 
            }

            card.innerHTML = `
                <div class="card-content">
                    <div class="article-title is-subtitle is-size-10">${article.title}</div>
                </div>
                <footer class="card-footer">
                    <a href="#" class="card-footer-item button is-light ${article.read ? 'is-success' : ''}">${article.read ? 'Unread' : 'Read'}</a>
                    <a href="#" class="card-footer-item button is-light is-info">Open</a>
                    <a href="#" class="card-footer-item button is-light is-danger">Remove</a>
                </footer>
            `;

            // ... (Rest of your event listeners for buttons stay the same)
            const readUnreadBtn = card.querySelector('.card-footer-item:nth-child(1)');
            readUnreadBtn.addEventListener('click', (e) => { e.preventDefault(); toggleReadStatus(index); });

            const openBtn = card.querySelector('.card-footer-item:nth-child(2)');
            openBtn.addEventListener('click', (e) => { e.preventDefault(); chrome.tabs.create({ url: article.url }); });

            const removeBtn = card.querySelector('.card-footer-item:nth-child(3)');
            removeBtn.addEventListener('click', (e) => { e.preventDefault(); removeArticle(index); });

            readingList.appendChild(card);
        });
    }

    function toggleReadStatus(index) {
        chrome.storage.sync.get(['readingList'], function(result) {
            const list = result.readingList || [];
            list[index].read = !list[index].read;
            chrome.storage.sync.set({readingList: list}, () => renderReadingList(list));
        });
    }

    function removeArticle(index) {
        chrome.storage.sync.get(['readingList'], function(result) {
            const list = result.readingList || [];
            list.splice(index, 1);
            chrome.storage.sync.set({readingList: list}, () => renderReadingList(list));
        });
    }
});