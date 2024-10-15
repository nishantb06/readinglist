document.addEventListener('DOMContentLoaded', function() {
    const articleUrl = document.getElementById('articleUrl');
    const addArticleBtn = document.getElementById('addArticle');
    const readingList = document.getElementById('readingList');

    // Load existing reading list
    chrome.storage.sync.get(['readingList'], function(result) {
        const list = result.readingList || [];
        renderReadingList(list);
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
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <div class="article-title">${article.title}</div>
                    <div class="article-url">${article.url}</div>
                </div>
                <div class="article-actions">
                    <button class="${article.read ? 'unread' : 'read'}">${article.read ? 'Unread' : 'Read'}</button>
                    <button class="remove">Remove</button>
                </div>
            `;

            const readUnreadBtn = li.querySelector('.read, .unread');
            readUnreadBtn.addEventListener('click', function() {
                toggleReadStatus(index);
            });

            const removeBtn = li.querySelector('.remove');
            removeBtn.addEventListener('click', function() {
                removeArticle(index);
            });

            readingList.appendChild(li);
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
