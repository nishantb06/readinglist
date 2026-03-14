document.getElementById('save').addEventListener('click', () => {
    const secret = document.getElementById('secret').value;
    const dbid = document.getElementById('dbid').value;

    chrome.storage.local.set({
        'NOTION_SECRET': secret,
        'DATABASE_ID': dbid
    }, () => {
        const status = document.getElementById('status');
        status.textContent = 'Settings saved! You can close this tab.';
        setTimeout(() => { status.textContent = ''; }, 3000);
    });
});

// Load existing values
chrome.storage.local.get(['NOTION_SECRET', 'DATABASE_ID'], (data) => {
    if (data.NOTION_SECRET) document.getElementById('secret').value = data.NOTION_SECRET;
    if (data.DATABASE_ID) document.getElementById('dbid').value = data.DATABASE_ID;
});