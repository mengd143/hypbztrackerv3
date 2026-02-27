import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy for Hypixel Bazaar API
  app.get("/api/bazaar", async (req, res) => {
    try {
      const response = await axios.get("https://api.hypixel.net/v2/skyblock/bazaar");
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Bazaar data" });
    }
  });

  // Proxy for UUID lookup
  app.get("/api/uuid/:username", async (req, res) => {
    try {
      const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${req.params.username}`);
      res.json(response.data);
    } catch (error) {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Proxy for Player Collections
  app.get("/api/player/:uuid/collections", async (req, res) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) return res.status(400).json({ error: "API Key required" });

    try {
      const response = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${req.params.uuid}`, {
        headers: { "API-Key": apiKey as string }
      });
      
      const profiles = response.data.profiles;
      if (!profiles || profiles.length === 0) return res.json({ collections: {} });
      
      const activeProfile = profiles.find((p: any) => p.selected) || profiles[0];
      const collections = activeProfile.members[req.params.uuid]?.collection || {};
      
      res.json({ collections });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player data" });
    }
  });

  // Proxy for Historical Bazaar Data (using Coflnet API)
  app.get("/api/bazaar/:itemId/history", async (req, res) => {
    const { itemId } = req.params;
    try {
      console.log(`[Server] Fetching history for: ${itemId}`);
      
      // Try Coflnet Bazaar History
      const response = await axios.get(`https://sky.coflnet.com/api/bazaar/${itemId}/history`, {
        timeout: 8000
      });
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(`[Server] Success: Found ${response.data.length} records for ${itemId}`);
        return res.json(response.data);
      }

      console.warn(`[Server] Coflnet returned empty or invalid for ${itemId}, trying fallback...`);
      
      // Fallback: Try a different Coflnet endpoint if the first one is empty
      const fallbackResponse = await axios.get(`https://sky.coflnet.com/api/item/${itemId}/history`, {
        timeout: 8000
      });

      if (Array.isArray(fallbackResponse.data)) {
        return res.json(fallbackResponse.data);
      }
      
      res.json([]);
    } catch (error: any) {
      console.error(`[Server] History fetch error for ${itemId}:`, error.message);
      res.status(500).json({ error: "Failed to fetch historical data", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
