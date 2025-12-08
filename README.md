# Xandeum Network Explorer (pNode-Scope)

> A real-time, decentralized analytics dashboard for the Xandeum Storage Network.

![Dashboard Preview](public/dashboard-screenshot.png)

## ⚡ Key Features (The "Innovation")

Unlike standard explorers that just ping a seed node, **pNode-Scope** features a **Recursive Crawler Engine**:

1.  **Recursive pRPC Crawling:** The backend doesn't just ask *one* node; it recursively discovers peers via `get-pods` and visits *their* RPC endpoints to gather distinct CPU/RAM stats.
2.  **Geospatial Intelligence:** Automatically resolves pNode IP addresses to physical locations to visualize network topology on an interactive globe.
3.  **Live "Hacker" Terminal:** A real-time log of the crawler's activity, visualizing the gossip protocol in action.
4.  **Fault Tolerance:** Built with a robust fallback engine to ensure the dashboard remains usable even if specific nodes timeout.

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Data Layer:** Native Node.js `http` (Bypassing fetch for raw RPC compatibility)
* **Visualization:** `react-simple-maps` (D3-based) & `recharts`
* **Styling:** Tailwind CSS + Shadcn UI

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* A running Xandeum pNode (locally or remote)

### 1. Configure the Crawler
Open `src/app/api/nodes/route.ts` and set your Seed Node URL:
```typescript
const SEED_NODE_URL = '[http://127.0.0.1:6000/rpc](http://127.0.0.1:6000/rpc)';
```
Run the Dashboard
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` to see the live network state.

---

### Step 2: The "Money Shot" Screenshot
The README references `public/dashboard-screenshot.png`. You need to take this now.

1.  **Open your Dashboard.**
2.  **Wait** for the map to populate and the Terminal to show some green logs.
3.  **Click a Node** so the Inspector panel slides out (showing the CPU stats).
4.  **Take a Screenshot** of the whole browser window.
5.  **Save it** as `dashboard-screenshot.png` inside your `public/` folder.

---

### Step 3: The Demo Video (60 Seconds)
If the submission requires a video (or even if it's optional), this is 50% of your score.

**The Script:**
1.  **0:00 - 0:10 (The Hook):** "Hi, this is [Your Name], and this is pNode-Scope. We didn't just build a UI; we built a recursive network crawler for Xandeum."
2.  **0:10 - 0:25 (The Map):** Zoom in on the map. "We visualize the physical distribution of storage nodes in real-time."
3.  **0:25 - 0:40 (The Inspector):** Click your Local Node. "By clicking any node, we query its specific pRPC endpoint on port 6000 to get live CPU and RAM usage, proving the node's proof-of-physical-work."
4.  **0:40 - 0:60 (The Terminal):** Point to the bottom. "And down here, you can see the live crawler discovering peers via the gossip protocol. It handles network latency and fallbacks gracefully."

---

### Step 4: Final Code Cleanup
Before you zip/push:
1.  **Check `route.ts`:** Remove any `console.log` that spews too much junk (keep the error logs).
2.  **Check `layout.tsx`:** Make sure the metadata title is nice (e.g., `title: "Xandeum Explorer"` instead of "Create Next App").
3.  **Push to GitHub:** Make sure your repo is public.