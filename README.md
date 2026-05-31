# socialblade

This small demo shows channel views/subs and stores seed values in Firebase Realtime Database (fallback to local history.json/localStorage).

Setup

1. Create a Firebase project and enable Realtime Database (locked to test mode during development).
2. In the Firebase console -> Project settings -> SDK setup, copy the config and paste it into `index.html` replacing the `FIREBASE_CONFIG` placeholder.
3. Optionally set a YouTube Data API key in `CONFIG.apiKey` in `index.html` for real values. Without it the page will still try to fetch and may error if invalid.

Run locally

1. Serve the folder as static files. From the project root:

```bash
cd /Users/alv/Desktop/socialblade
python3 -m http.server 3000
```

2. Open `http://localhost:3000` in your browser.

Notes

- If Firebase is configured and reachable the page will read/write `/history` in the Realtime Database.
- If Firebase isn't configured the page will fall back to `history.json` and localStorage backups.

Verify database contents

- Open the Firebase console, go to Realtime Database -> Data, and inspect the `/history` node. It should contain `totalAccess` and a `channels` array with objects that include `seed` (views, subs, viewsToday, subsToday).
