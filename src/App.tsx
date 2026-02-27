import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  Search, 
  Settings, 
  ArrowUpDown, 
  Info, 
  Languages, 
  User, 
  Key, 
  RefreshCw,
  TrendingUp,
  AlertCircle,
  X,
  LineChart as ChartIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FLIP_ITEMS, ROMAN_NUMERALS, type ItemRecipe } from "./data";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Language = "zh" | "en";

interface BazaarProduct {
  product_id: string;
  sell_summary: { pricePerUnit: number }[];
  buy_summary: { pricePerUnit: number }[];
  quick_status: {
    sellPrice: number;
    buyPrice: number;
    sellVolume: number;
    buyVolume: number;
  };
}

export default function App() {
  const [lang, setLang] = useState<Language>("zh");
  const [quantity, setQuantity] = useState<number>(71680);
  const [useSuper, setUseSuper] = useState<boolean>(false);
  const [bazaarData, setBazaarData] = useState<Record<string, BazaarProduct>>({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("");
  const [playerCollections, setPlayerCollections] = useState<Record<string, number>>({});
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const t = {
    zh: {
      title: "Hypixel Bazaar 倒卖追踪器",
      buyQty: "购买数量",
      superToggle: "合成至三重压缩",
      profit: "利润",
      buyPrice: "购入价",
      sellPrice: "售出价",
      supply: "原料可供(件)",
      demand: "成品需求(件)",
      collection: "收集等级",
      notUnlocked: "未解锁配方",
      apiSettings: "API 设置",
      username: "游戏 ID",
      apiKey: "API Key",
      check: "验证",
      lastUpdate: "最后更新",
      rawToEnchanted: "购入原料 → 售出成品",
      totalProfit: "总利润",
      noData: "正在获取数据...",
      error: "获取数据失败",
      npc: "NPC 价格",
      bz: "Bazaar 价格",
      refresh: "刷新价格",
      apiDesc: "输入 API Key 以检查配方解锁状态。未解锁的物品将以红色显示。",
      marketWarning: "超出市场容量",
      historyTitle: "价格历史",
      buyPriceHist: "买入价历史",
      sellPriceHist: "卖出价历史",
      range1h: "1小时",
      range1d: "1天",
      range1w: "1周",
      range1m: "1月",
      close: "关闭",
      loadingHistory: "正在加载历史数据...",
    },
    en: {
      title: "Hypixel Bazaar Flip Tracker",
      buyQty: "Buy Quantity",
      superToggle: "Craft to Super Enchanted",
      profit: "Profit",
      buyPrice: "Buy Price",
      sellPrice: "Sell Price",
      supply: "Raw Supply (Units)",
      demand: "Target Demand (Units)",
      collection: "Collection",
      notUnlocked: "Recipe Locked",
      apiSettings: "API Settings",
      username: "Minecraft ID",
      apiKey: "API Key",
      check: "Verify",
      lastUpdate: "Last Update",
      rawToEnchanted: "Raw → Enchanted",
      totalProfit: "Total Profit",
      noData: "Fetching data...",
      error: "Failed to fetch data",
      npc: "NPC Price",
      bz: "Bazaar Price",
      refresh: "Refresh Prices",
      apiDesc: "Enter API Key to check recipe status. Locked items will be shown in red.",
      marketWarning: "Exceeds Market Capacity",
      historyTitle: "Price History",
      buyPriceHist: "Buy Price History",
      sellPriceHist: "Sell Price History",
      range1h: "1h",
      range1d: "1d",
      range1w: "1w",
      range1m: "1m",
      close: "Close",
      loadingHistory: "Loading history data...",
    }
  }[lang];

  const [selectedHistoryItem, setSelectedHistoryItem] = useState<{ id: string, name: string } | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyRange, setHistoryRange] = useState<"1h" | "1d" | "1w" | "1m">("1d");

  const fetchHistory = async (itemId: string) => {
    setHistoryLoading(true);
    setHistoryData([]); 
    try {
      console.log(`Fetching history for ${itemId} with range ${historyRange}`);
      const res = await axios.get(`/api/bazaar/${itemId}/history`);
      
      if (!res.data || !Array.isArray(res.data)) {
        console.error("History data is not an array or is empty:", res.data);
        return;
      }

      const now = new Date().getTime();
      const ranges = {
        "1h": 60 * 60 * 1000,
        "1d": 24 * 60 * 60 * 1000,
        "1w": 7 * 24 * 60 * 60 * 1000,
        "1m": 30 * 24 * 60 * 60 * 1000,
      };
      
      const processed = res.data
        .map((d: any) => {
          const timestamp = d.timestamp || d.time || d.date;
          const time = new Date(timestamp).getTime();
          return {
            ...d,
            time,
            buyPrice: d.buyPrice || d.buy || 0,
            sellPrice: d.sellPrice || d.sell || 0,
            formattedTime: new Date(timestamp).toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          };
        })
        .filter((d: any) => !isNaN(d.time))
        .sort((a: any, b: any) => a.time - b.time);

      // If we have data but filtering makes it empty, show the most recent data instead of nothing
      let filtered = processed.filter((d: any) => now - d.time <= ranges[historyRange]);
      
      if (filtered.length === 0 && processed.length > 0) {
        console.warn("Filtering returned empty, showing last 50 points instead");
        filtered = processed.slice(-50);
      }

      setHistoryData(filtered);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (selectedHistoryItem) {
      fetchHistory(selectedHistoryItem.id);
    }
  }, [selectedHistoryItem, historyRange]);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const res = await axios.get("/api/bazaar");
      if (res.data.success) {
        setBazaarData(res.data.products);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyApi = async () => {
    if (!username || !apiKey) return;
    setIsCheckingApi(true);
    try {
      const uuidRes = await axios.get(`/api/uuid/${username}`);
      const uuid = uuidRes.data.id;
      const colRes = await axios.get(`/api/player/${uuid}/collections`, {
        headers: { "x-api-key": apiKey }
      });
      setPlayerCollections(colRes.data.collections || {});
    } catch (err) {
      alert("Verification failed. Check your ID and API Key.");
    } finally {
      setIsCheckingApi(false);
    }
  };

  const calculateProfit = (item: ItemRecipe) => {
    const raw = bazaarData[item.rawId];
    const enchanted = bazaarData[item.enchantedId];
    const superEnchanted = item.superEnchantedId ? bazaarData[item.superEnchantedId] : null;

    if (!raw) return null;

    // Cost: We put a Buy Order. Cost = highest buy order + 0.1 (or just use quick_status.sellPrice for conservative)
    // Actually, prompt says "buy raw花的钱(x)", let's use the current highest buy order as the price we'd pay if we wait.
    // Or quick_status.sellPrice if we buy instantly.
    // Let's use sellPrice (instant buy) as the cost and buyPrice (instant sell) as the revenue for a "worst case" flip.
    // But most people flip by waiting. Let's use the most realistic: 
    // Cost = raw.quick_status.sellPrice (Instant Buy)
    // Revenue = Max(enchanted.quick_status.buyPrice (Instant Sell), NPC Price)
    const rawCost = Math.max(0.1, raw.quick_status.sellPrice || 0.1);
    
    let sellPrice = 0;
    let targetId = "";
    let ratio = item.ratio1;
    let npcPrice = item.npcPrice || 0;

    if (useSuper && item.superEnchantedId && item.ratio2) {
      targetId = item.superEnchantedId;
      ratio = item.ratio1 * item.ratio2;
      const bzSellPrice = superEnchanted?.quick_status.buyPrice || 0;
      sellPrice = Math.max(bzSellPrice, item.superNpcPrice || 0);
      npcPrice = item.superNpcPrice || 0;
    } else {
      targetId = item.enchantedId;
      const bzSellPrice = enchanted?.quick_status.buyPrice || 0;
      sellPrice = Math.max(bzSellPrice, item.npcPrice || 0);
    }

    // Ensure sellPrice is at least 0.1
    sellPrice = Math.max(0.1, sellPrice);

    const totalCost = rawCost * quantity;
    const totalRevenue = (sellPrice / 1) * (quantity / ratio);
    const profit = totalRevenue - totalCost;

    return {
      profit,
      rawPrice: rawCost,
      sellPrice,
      isNpc: sellPrice === npcPrice && sellPrice > 0,
      targetId,
      ratio,
      supply: Math.floor(raw.quick_status.sellVolume / ratio), // How many enchanted items can be made from raw supply
      demand: bazaarData[targetId]?.quick_status.buyVolume || 0, // How many enchanted items are wanted
    };
  };

  const sortedItems = useMemo(() => {
    return FLIP_ITEMS.map(item => ({
      ...item,
      stats: calculateProfit(item)
    }))
    .filter(item => item.stats !== null)
    .sort((a, b) => (b.stats?.profit || 0) - (a.stats?.profit || 0));
  }, [bazaarData, quantity, useSuper]);

  const isUnlocked = (item: ItemRecipe) => {
    if (Object.keys(playerCollections).length === 0) return true; // Default to true if not checked
    const currentLevel = playerCollections[item.collection] || 0;
    return currentLevel >= item.collectionLevel;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t.title}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase tracking-wider">
                  {t.lastUpdate}: {lastUpdated.toLocaleTimeString()}
                </span>
                <button 
                  onClick={fetchData}
                  disabled={isRefreshing}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-wider transition-colors"
                >
                  <RefreshCw size={10} className={cn(isRefreshing && "animate-spin")} />
                  {t.refresh}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Language Toggle */}
            <button 
              onClick={() => setLang(l => l === "zh" ? "en" : "zh")}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-xs font-semibold text-slate-600"
            >
              <Languages size={14} />
              {lang === "zh" ? "ENGLISH" : "中文"}
            </button>

            {/* Quantity Input */}
            <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-transparent focus-within:border-indigo-500/30 transition-all">
              <label className="text-[10px] font-bold uppercase text-slate-400 mr-3">{t.buyQty}</label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-transparent border-none outline-none w-24 font-mono text-sm font-medium"
              />
            </div>

            {/* Super Toggle */}
            <button 
              onClick={() => setUseSuper(!useSuper)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-bold uppercase shadow-sm",
                useSuper 
                  ? "bg-indigo-600 text-white shadow-indigo-200" 
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              )}
            >
              <ArrowUpDown size={14} />
              {t.superToggle}
            </button>
          </div>
        </div>

        {/* API Settings - Minimal */}
        <div className="max-w-7xl mx-auto px-6 pb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
            <Settings size={12} />
            {t.apiSettings}
          </div>
          <div className="flex items-center bg-slate-50 px-2 py-1.5 rounded-md border border-slate-100">
            <User size={12} className="text-slate-400 mr-2" />
            <input 
              placeholder={t.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-24 font-medium"
            />
          </div>
          <div className="flex items-center bg-slate-50 px-2 py-1.5 rounded-md border border-slate-100">
            <Key size={12} className="text-slate-400 mr-2" />
            <input 
              type="password"
              placeholder={t.apiKey}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-32 font-medium"
            />
          </div>
          <button 
            onClick={handleVerifyApi}
            disabled={isCheckingApi}
            className="text-[10px] font-bold uppercase bg-slate-900 text-white px-4 py-1.5 rounded-md hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {isCheckingApi ? <RefreshCw size={10} className="animate-spin" /> : t.check}
          </button>
          <div className="group relative">
            <Info size={14} className="text-slate-300 cursor-help" />
            <div className="absolute left-0 top-full mt-2 w-64 bg-slate-900 text-white p-3 rounded-lg text-[10px] leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
              {t.apiDesc}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <RefreshCw size={40} className="animate-spin text-indigo-500 mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.noData}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr] bg-slate-50/50 border-b border-slate-100 p-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <div>{t.rawToEnchanted}</div>
              <div className="text-right">{t.buyPrice}</div>
              <div className="text-right">{t.sellPrice}</div>
              <div className="text-right">{t.supply}</div>
              <div className="text-right">{t.demand}</div>
              <div className="text-right">{t.totalProfit}</div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {sortedItems.map((item) => {
                  const unlocked = isUnlocked(item);
                  const stats = item.stats!;
                  const targetQty = quantity / stats.ratio;
                  const supplyShortage = targetQty > stats.supply;
                  const demandShortage = targetQty > stats.demand;
                  
                  return (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr] p-4 items-center hover:bg-slate-50/80 transition-colors group relative"
                    >
                      {/* Name & Recipe */}
                      <div className="relative">
                        <div className={cn(
                          "font-bold text-sm tracking-tight transition-colors",
                          !unlocked ? "text-red-500" : "text-slate-900"
                        )}>
                          {lang === "zh" ? item.nameZh : item.nameEn}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <button 
                            onClick={() => setSelectedHistoryItem({ id: item.rawId, name: lang === "zh" ? item.nameZh : item.nameEn })}
                            className="text-[10px] font-medium text-slate-400 hover:text-indigo-600 transition-colors underline decoration-dotted"
                          >
                            {item.rawId}
                          </button>
                          <span className="text-[10px] text-slate-300">→</span>
                          <button 
                            onClick={() => setSelectedHistoryItem({ id: stats.targetId, name: lang === "zh" ? item.nameZh : item.nameEn })}
                            className="text-[10px] font-medium text-indigo-500 hover:text-indigo-700 transition-colors underline decoration-dotted"
                          >
                            {stats.targetId}
                          </button>
                        </div>
                        
                        {/* Tooltip for Collection */}
                        <div className="absolute left-0 -top-10 bg-slate-900 text-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-10 shadow-xl border border-white/10">
                          {t.collection}: {item.collection} {item.collectionLevel} ({ROMAN_NUMERALS[item.collectionLevel]})
                        </div>
                      </div>

                      {/* Buy Price */}
                      <div className="text-right font-mono text-xs font-medium text-slate-600">
                        {stats.rawPrice.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </div>

                      {/* Sell Price */}
                      <div className="text-right font-mono text-xs font-medium text-slate-600 flex flex-col items-end">
                        <span>{stats.sellPrice.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                        <span className={cn(
                          "text-[8px] font-bold uppercase px-1 rounded",
                          stats.isNpc ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {stats.isNpc ? t.npc : t.bz}
                        </span>
                      </div>

                      {/* Supply */}
                      <div className={cn(
                        "text-right font-mono text-xs",
                        supplyShortage ? "text-red-500 font-bold" : "text-slate-400"
                      )}>
                        {stats.supply.toLocaleString()}
                        {supplyShortage && <div className="text-[8px] uppercase">{t.marketWarning}</div>}
                      </div>

                      {/* Demand */}
                      <div className={cn(
                        "text-right font-mono text-xs",
                        demandShortage ? "text-amber-500 font-bold" : "text-slate-400"
                      )}>
                        {stats.demand.toLocaleString()}
                        {demandShortage && !stats.isNpc && <div className="text-[8px] uppercase">{t.marketWarning}</div>}
                        {stats.isNpc && <div className="text-[8px] uppercase text-emerald-500">∞ NPC</div>}
                      </div>

                      {/* Total Profit */}
                      <div className={cn(
                        "text-right font-mono font-bold text-base",
                        stats.profit > 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {stats.profit > 0 ? "+" : ""}{Math.round(stats.profit).toLocaleString()}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto p-6 mt-12 border-t border-slate-100">
        <div className="flex items-start gap-3 text-slate-400">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <div className="text-[10px] font-medium uppercase leading-relaxed tracking-wide">
            <p>• {lang === "zh" ? "数据每 60 秒自动刷新，支持手动点击刷新。" : "Data refreshes every 60s, manual refresh supported."}</p>
            <p>• {lang === "zh" ? "购入价基于 Bazaar 卖单价，售出价取买单价与 NPC 价格的最大值。" : "Buy price based on Sell Offers, Sell price is Max(Buy Orders, NPC)."}</p>
            <p>• {lang === "zh" ? "红色名称表示配方未解锁。小麦支持面包和干草块两种路径。" : "Red names indicate locked recipes. Wheat supports both Bread and Hay Bale paths."}</p>
          </div>
        </div>
      </footer>

      {/* History Modal */}
      <AnimatePresence>
        {selectedHistoryItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHistoryItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ChartIcon size={20} className="text-indigo-600" />
                    {selectedHistoryItem.name} - {t.historyTitle}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">{selectedHistoryItem.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedHistoryItem(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {/* Range Selector */}
                <div className="flex gap-2 mb-6">
                  {(["1h", "1d", "1w", "1m"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setHistoryRange(r)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all",
                        historyRange === r 
                          ? "bg-slate-900 text-white" 
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {t[`range${r}` as keyof typeof t]}
                    </button>
                  ))}
                </div>

                <div className="h-[400px] w-full">
                  {historyLoading ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-50">
                      <RefreshCw size={32} className="animate-spin text-indigo-500 mb-4" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">{t.loadingHistory}</p>
                    </div>
                  ) : historyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData}>
                        <defs>
                          <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="formattedTime" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          tick={{ fill: "#94a3b8" }}
                        />
                        <YAxis 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          tick={{ fill: "#94a3b8" }}
                          tickFormatter={(val) => val.toLocaleString()}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#0f172a", 
                            border: "none", 
                            borderRadius: "12px",
                            color: "#fff",
                            fontSize: "12px",
                            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
                          }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="buyPrice" 
                          name={t.buyPriceHist}
                          stroke="#6366f1" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorBuy)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="sellPrice" 
                          name={t.sellPriceHist}
                          stroke="#10b981" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorSell)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono uppercase">
                      No historical data available for this range
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

