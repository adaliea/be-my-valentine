# Valentine's Day Asking Site 💖

A personalized, interactive website to ask your special someone to be your Valentine. Built with Next.js and deployed on Cloudflare Workers.

Inspired by the following:
- https://www.youtube.com/shorts/y6vJyY2m7a0
- https://www.youtube.com/shorts/MDYzgYfdYFU


<img width="45%" height="auto" alt="image" src="https://github.com/user-attachments/assets/24d6a653-a13b-42aa-b7e5-19537666d1a7" />
<img width="45%" height="auto" alt="image" src="https://github.com/user-attachments/assets/2a25f445-63d3-4827-ab87-3c48bc78041d" />
<img width="45%" height="auto" alt="image" src="https://github.com/user-attachments/assets/70d98bf2-95ce-4e9a-945d-ce0045b5cacb" />
<img width="45%" height="auto" alt="image" src="https://github.com/user-attachments/assets/3162491b-a821-47fd-9749-cc60a76dd004" />

## Demo
[https://valentine.adalie.me/](https://valentine.adalie.me/)

## Features

- **Interactive Question:** "Will you be my Valentine?" with Yes/No buttons.
- **Playful Rejection:** If they click "No", the button runs away (changes text), the "Yes" button grows larger, and the question itself changes to be more pleading.
- **Celebration:** Clicking "Yes" triggers a confetti explosion (customizable colors!) and shows a success message with a cute GIF.
- **Secure Personalization:** The partner's name is hidden behind a secret token in the URL.
- **Analytics:** Tracks every "No" click and the final "Yes" in Cloudflare KV, so you can see the journey!

## 🚀 Deployment Guide

### Prerequisites

1.  **Cloudflare Account:** You need a Cloudflare account.
2.  **Node.js:** Installed locally.
3.  **Wrangler CLI:** `npm install -g wrangler`

### 1. Cloudflare KV Setup (For Analytics)

This project uses Cloudflare KV to store the history of button clicks.

1.  Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Navigate to **Workers & Pages** > **KV**.
3.  Click **Create a Namespace**. Name it something like `valentine-stats`.
4.  Copy the **ID** of your new namespace.
5.  Open `wrangler.jsonc` in this project.
6.  Find the `kv_namespaces` section and update the `id` and `preview_id` (you can use the same ID for both if you want, or create a separate one for preview):

```jsonc
"kv_namespaces": [
  {
    "binding": "VALENTINE_KV",
    "id": "YOUR_ACTUAL_NAMESPACE_ID_HERE",
    "preview_id": "YOUR_PREVIEW_NAMESPACE_ID_HERE"
  }
]
```

### 2. Environment Variables

You need to set two secrets for the application to work securely.

1.  `VALENTINE_TOKEN`: A secret string (e.g., `love123`). This must be present in the URL for the name to show up and for analytics to record.
2.  `PARTNER_NAME`: The name of the person you are asking (e.g., `Adalie`).

**For Local Development:**
Create a `.env.local` file:
```bash
VALENTINE_TOKEN=love123
PARTNER_NAME=Adalie
```

**For Production (Cloudflare):**
Go to your Worker's settings in the Cloudflare Dashboard > **Settings** > **Variables and Secrets** and add them there.

### 3. Deploy

Run the deploy command:

```bash
npm run deploy
```

Once deployed, Cloudflare will give you a URL (e.g., `https://valentine-next.your-name.workers.dev`).

### 4. Sending the Link

To send the personalized link to your partner, add `?token=YOUR_TOKEN` to the end of the URL.

Example:
`https://valentine-next.your-name.workers.dev/?token=love123`

When they visit this link, the token is validated, stored in a secure cookie, and then removed from the address bar so it looks clean!

## 🎨 Customization

### Phrases & Images (`src/app/constants.ts`)

Edit `src/app/constants.ts` to change the text and images.

*   **`MESSAGES`**: A single list of paired messages. Each entry has:
    *   `buttonText`: The text on the "No" button.
    *   `questionText`: The pleading question that appears at the top.
    *   *Example:* `{ buttonText: "Don't do this!", questionText: "I'll be so sad..." }`
*   **`SUCCESS_IMAGE_URL`**: The GIF displayed when they say "Yes".
*   **`ASKING_IMAGE_URL`**: The GIF displayed while asking.
*   **`SUCCESS_TEXT`**: The heading text on the success screen.
*   **`CONFETTI_COLORS`**: An array of hex codes for the confetti explosion.

### Colors

*   **Confetti:** Edit `CONFETTI_COLORS` in `src/app/constants.ts`.
*   **Buttons & Text:** Edit `src/app/components/ValentineClient.tsx`. Look for the Tailwind CSS classes:
    *   **Yes Button:** `bg-[#2ecc71]` (Green)
    *   **No Button:** `bg-[#e74c3c]` (Red)
    *   **Headings:** `text-[#A30262]` (Pink/Purple)

## 📊 Viewing Stats

To see if they pressed "No" (and how many times!) before saying "Yes":

1.  Go to Cloudflare Dashboard > **Workers & Pages** > **KV**.
2.  Click on your `valentine-stats` namespace.
3.  Click **KV Pairs**.
4.  You will see entries like:
    *   `no-2026-01-30T12:00:00...` -> Contains count and timestamp.
    *   `yes-2026-01-30T12:05:00...` -> The moment they said Yes!

## 🛠️ Development

```bash
# Run locally
npm run dev

# Preview Cloudflare runtime locally
npm run preview
```
