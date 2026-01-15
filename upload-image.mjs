import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import FormData from "form-data";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const API_BASE =
  process.env.PAPERLESSPAPER_API_BASE ?? "https://api.memo.wirewire.de/v1";
const API_KEY = process.env.PAPERLESSPAPER_API_KEY;

function usageAndExit() {
  // eslint-disable-next-line no-console
  console.error(
    "Usage:\n" +
      "  PAPERLESSPAPER_API_KEY=... node upload-image.mjs <paperId> <imagePath>\n\n" +
      "Optional:\n" +
      "  PAPERLESSPAPER_API_BASE=https://api.memo.wirewire.de/v1\n"
  );
  process.exit(2);
}

export async function uploadPaperImage(paperId, filePath) {
  if (!API_KEY) throw new Error("Missing env var: PAPERLESSPAPER_API_KEY");

  const filename = path.basename(filePath);
  const form = new FormData();
  form.append("picture", fs.createReadStream(filePath), {
    filename,
    contentType: "image/png",
  });

  const res = await fetch(
    `${API_BASE}/papers/uploadSingleImage/${encodeURIComponent(paperId)}`,
    {
      method: "POST",
      headers: {
        ...form.getHeaders(),
        "x-api-key": API_KEY,
      },
      body: form,
    }
  );

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  }

  return res.json();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [paperId, imagePath] = process.argv.slice(2);
  if (!paperId || !imagePath) usageAndExit();

  uploadPaperImage(paperId, imagePath)
    .then((paper) => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(paper, null, 2));
      if (paper?.imageUpdatedAt) {
        // eslint-disable-next-line no-console
        console.log(`\nimageUpdatedAt: ${paper.imageUpdatedAt}`);
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err?.stack || String(err));
      process.exit(1);
    });
}
