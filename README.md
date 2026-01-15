# paperlesspaper node-samples

Minimal Node.js example for uploading (swapping) the image shown on an ePaper screen using the paperlesspaper API:

- `POST /papers/uploadSingleImage/:paperId`

## Setup

- Node.js >= 18

Install deps:

```bash
npm install
```

## Run

Set env vars (API key) and call the script with `paperId` and a local image path:

```bash
export PAPERLESSPAPER_API_KEY="..."

node upload-image.mjs <PAPER_ID> /path/to/image.png
```

Optional base URL override:

```bash
export PAPERLESSPAPER_API_BASE="https://api.memo.wirewire.de/v1"
```

The script prints the returned paper object JSON. Watch `imageUpdatedAt` to confirm the update.
