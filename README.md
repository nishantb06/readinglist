# Reading Stack - Chrome Extension 🚀

![Reading Stack Logo](images/icons8-bookmark-50.png)

Reading Stack is a lightweight Chrome/Brave extension designed for power readers. It captures your active reading list and syncs it directly to a **Notion Database**, creating a permanent, searchable archive of your digital library while keeping your browser popup clean and fast.

## 🌟 Key Features

- **Notion Integration:** Automatically clones every saved article to your Notion workspace for permanent storage.
- **Dedicated Options UI:** Securely store your Notion API keys once—no need to edit code manually.
- **Smart "K-Limit" Storage:** Automatically manages local storage by keeping only the latest **300 articles** ($K=300$) to ensure browser sync remains fast and reliable.
- **Dynamic Animations:** Smooth CSS slide-in effects and visual feedback when adding new content.
- **Privacy First:** Built for Brave and Chrome; your API keys are stored locally in your browser.

---

## ⚙️ Notion Setup (Required)

To use the sync feature, you must link the extension to your Notion workspace:

1. **Create an Integration:**
   - Visit [Notion My-Integrations](https://www.notion.so/my-integrations).
   - Create a "New integration", name it "Reading Stack", and copy the **Internal Integration Secret**.
2. **Prepare your Database:**
   - Create a new Database in Notion (Table view works best).
   - Ensure it has two specific columns: **Name** (Title type) and **URL** (URL type).
3. **Authorize the Connection:**
   - Open your Notion database page.
   - Click the `...` menu in the top right.
   - Select **Add connections** and search for "Reading Stack".
4. **Get your Database ID:**
   - With the database open as a full page, look at the URL.
   - The ID is the 32-character string after your workspace name and before the `?`:
     `notion.so/workspace/DATABASE_ID?v=...`

---

## 🛠 Installation & Configuration

1. **Download:** Clone this repository or download the ZIP file.
2. **Load:** Open your browser and navigate to `chrome://extensions` (or `brave://extensions`).
3. **Developer Mode:** Enable "Developer mode" in the top right.
4. **Install:** Click **Load unpacked** and select the directory containing the extension files.
5. **Configure Keys:** - Right-click the **Reading Stack icon** in your toolbar.
   - Click **Options** (or Extension Options).
   - Paste your **Notion Secret** and **Database ID**, then click **Save Settings**.

---

## 📖 Usage

1. **Add Current Site:** Click the icon and hit "Add Current Site". The page title and URL are saved to your local list and synced to Notion.
2. **Manual Add:** Enter a URL manually into the input field and click "Add".
3. **Manage:** Use the popup to open links, mark them as read, or delete them.
4. **The Stack Limit:** Once you hit 300 items, the oldest local items are removed to keep the extension performant. **Note:** Items removed from the local popup stay saved in your Notion database forever.

---

## 👨‍💻 Development

The extension is designed to be modular:
- **`popup.js`**: Core logic for UI rendering, $K$-limit enforcement, and Notion API calls.
- **`options.js`**: Manages the persistent storage of credentials using `chrome.storage.local`.
- **`custom.css`**: Contains the `@keyframes` for the "Add" slide-in animation.
- **`manifest.json`**: Updated to Version 3 with necessary `host_permissions` for Notion API access.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## Credits

- Bookmark icon by [Icons8](https://icons8.com)

---

Happy reading!