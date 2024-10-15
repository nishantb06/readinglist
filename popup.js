document.addEventListener('DOMContentLoaded', function() {
    const articleUrl = document.getElementById('articleUrl');
    const addArticleBtn = document.getElementById('addArticle');
    const addCurrentSiteBtn = document.getElementById('addCurrentSite');
    const readingList = document.getElementById('readingList');

    // Load existing reading list
    chrome.storage.sync.get(['readingList'], function(result) {
        const list = result.readingList || [];
        renderReadingList(list);
    });

    // Add current site
    addCurrentSiteBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            addArticle(currentTab.url, currentTab.title);
        });
    });

    // Add new article
    addArticleBtn.addEventListener('click', function() {
        const url = articleUrl.value.trim();
        if (url) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const title = tabs[0].title;
                addArticle(url, title);
                articleUrl.value = '';
            });
        }
    });

    function addArticle(url, title) {
        chrome.storage.sync.get(['readingList'], function(result) {
            const list = result.readingList || [];
            list.push({url, title, read: false});
            chrome.storage.sync.set({readingList: list}, function() {
                renderReadingList(list);
            });
        });
    }

    function renderReadingList(list) {
        readingList.innerHTML = '';
        list.forEach((article, index) => {
            const card = document.createElement('div');
            card.className = 'card';
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

            const readUnreadBtn = card.querySelector('.card-footer-item:nth-child(1)');
            readUnreadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleReadStatus(index);
            });

            const openBtn = card.querySelector('.card-footer-item:nth-child(2)');
            openBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openArticle(article.url);
            });

            const removeBtn = card.querySelector('.card-footer-item:nth-child(3)');
            removeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                removeArticle(index);
            });

            readingList.appendChild(card);
        });
    }

    function toggleReadStatus(index) {
        chrome.storage.sync.get(['readingList'], function(result) {
            const list = result.readingList || [];
            list[index].read = !list[index].read;
            chrome.storage.sync.set({readingList: list}, function() {
                renderReadingList(list);
            });
        });
    }

    function openArticle(url) {
        chrome.tabs.create({ url: url });
    }

    function removeArticle(index) {
        chrome.storage.sync.get(['readingList'], function(result) {
            const list = result.readingList || [];
            list.splice(index, 1);
            chrome.storage.sync.set({readingList: list}, function() {
                renderReadingList(list);
            });
        });
    }
});
