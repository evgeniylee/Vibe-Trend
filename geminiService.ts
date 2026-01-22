
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, VideoTrend, InstagramAccount } from "./types";
import { supabase } from "./supabaseClient";
import { ScrapeCreators } from "./scrapeCreatorsService";

// Local templates for "Instant AI" effect without tokens
const HOOK_TEMPLATES = [
  { text: "Как я получил {topic} всего за {time}", style: "Result-Driven" },
  { text: "Перестань делать {topic}, если не хочешь {pain}", style: "Fear of Missing Out" },
  { text: "Секрет {topic}, о котором молчат 99% экспертов", style: "Secret" },
  { text: "3 простых шага, чтобы {topic} стал реальностью", style: "Educational" },
  { text: "Это изменило мою жизнь: как {topic} помог мне", style: "Storytelling" }
];

export const LogicService = {
  // Pure mathematical analysis (0 cost)
  calculateLocalMetrics: (trend: VideoTrend) => {
    const views = parseInt(trend.views.replace(/[^0-9]/g, '')) || 0;
    const followers = trend.creatorFollowers || 5000;
    const multiplier = Math.round((views / followers) * 10) / 10;
    
    let momentum: 'Steady' | 'High' | 'Explosive' = 'Steady';
    if (multiplier > 50) momentum = 'Explosive';
    else if (multiplier > 10) momentum = 'High';

    return {
      viralScore: `${multiplier}x`,
      momentum,
      er: `${Math.min(25, Math.round((multiplier / 2) * 100) / 100)}%`,
      multiplier
    };
  },

  // Template based generation (0 cost)
  getInstantHooks: (topic: string) => {
    return HOOK_TEMPLATES.map(tpl => ({
      text: tpl.text.replace('{topic}', topic).replace('{time}', '24 часа').replace('{pain}', 'потерять охваты'),
      style: tpl.style,
      visualAdvice: "Используйте динамичный монтаж и крупные субтитры в центре экрана.",
      score: 75 + Math.floor(Math.random() * 20)
    }));
  }
};

export const DbService = {
  testConnection: async () => {
    try {
      const { data, error } = await supabase.from('tracked_accounts').select('count', { count: 'exact', head: true });
      if (error) throw error;
      return { success: true, message: "Connected to Supabase" };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  getScKey: async () => {
    const { data, error } = await supabase.from('app_settings').select('value').eq('key', 'sc_api_key').maybeSingle();
    return data?.value || null;
  },

  saveScKey: async (val: string) => {
    await supabase.from('app_settings').upsert({ key: 'sc_api_key', value: val }, { onConflict: 'key' });
  },

  getTrackedAccounts: async () => {
    const { data, error } = await supabase.from('tracked_accounts').select('*').order('last_updated', { ascending: false });
    if (error) return [];
    return data.map(acc => ({
      ...acc,
      id: acc.id,
      fullName: acc.full_name,
      avg_views: acc.avg_views,
      is_growing: acc.is_growing,
      is_visible: acc.is_visible,
      last_updated: new Date(acc.last_updated).getTime()
    }));
  },

  upsertAccount: async (acc: InstagramAccount) => {
    await supabase.from('tracked_accounts').upsert({
      username: acc.username,
      full_name: acc.fullName,
      avatar: acc.avatar,
      followers: acc.followers,
      avg_views: acc.avgViews,
      niche: acc.niche,
      is_growing: acc.isGrowing,
      description: acc.description,
      is_visible: true,
      last_updated: new Date().toISOString()
    }, { onConflict: 'username' });
  },

  getCachedTrends: async (niche: string) => {
    const { data } = await supabase
      .from('cached_trends')
      .select('*')
      .ilike('niche', niche.trim())
      .gt('last_updated', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString());
    return data?.map(t => ({ ...t, id: t.external_id })) || null;
  },

  saveTrends: async (trends: VideoTrend[]) => {
    if (!trends || trends.length === 0) return;
    const payload = trends.map(t => ({
      external_id: t.id,
      title: t.title,
      thumbnail: t.thumbnail,
      niche: t.niche,
      region: t.region,
      views: t.views,
      likes: t.likes,
      comments: t.comments,
      growth: t.growth,
      creator: t.creator,
      description: t.description,
      last_updated: new Date().toISOString()
    }));
    await supabase.from('cached_trends').upsert(payload, { onConflict: 'external_id' });
  },

  getVideoAnalysis: async (videoId: string): Promise<AnalysisResult | null> => {
    const { data } = await supabase.from('video_analysis').select('result').eq('video_id', videoId).maybeSingle();
    return data ? (data.result as AnalysisResult) : null;
  },

  saveVideoAnalysis: async (videoId: string, result: AnalysisResult) => {
    await supabase.from('video_analysis').upsert({
      video_id: videoId,
      result: result,
      created_at: new Date().toISOString()
    }, { onConflict: 'video_id' });
  },

  getSavedScripts: async () => {
    const { data, error } = await supabase.from('saved_scripts').select('*').order('created_at', { ascending: false });
    return error ? [] : data;
  },

  saveScript: async (title: string, niche: string, content: string) => {
    const { data, error } = await supabase.from('saved_scripts').insert([{ title, niche, content }]).select();
    if (error) throw error;
    return data[0];
  },

  deleteScript: async (id: string) => {
    await supabase.from('saved_scripts').delete().eq('id', id);
  }
};

// Add missing searchInstagramAccount export to resolve import errors in TrendsView and AccountsView
/**
 * Searches for an Instagram account by handle and returns the account information.
 * Uses ScrapeCreators service to fetch profile data.
 */
export const searchInstagramAccount = async (handle: string): Promise<InstagramAccount | null> => {
  const result = await ScrapeCreators.getProfile(handle);
  return result ? result.account : null;
};

export const fetchTrendsFromWeb = async (
  niche: string, 
  followedAccounts: InstagramAccount[] = []
): Promise<{ trends: VideoTrend[], sources: any[], fromCache: boolean }> => {
  const key = ScrapeCreators.getKey();
  if (!key) {
    const cached = await DbService.getCachedTrends(niche);
    return { trends: cached || [], sources: [], fromCache: true };
  }

  try {
    const followedTrends: VideoTrend[] = [];
    const activeAccounts = followedAccounts.filter(a => a.isVisible !== false);

    if (activeAccounts.length > 0) {
      const profilePromises = activeAccounts.map(acc => ScrapeCreators.getProfile(acc.username));
      const profilesData = await Promise.all(profilePromises);
      profilesData.forEach(data => { if (data && data.posts) followedTrends.push(...data.posts.slice(0, 5)); });
    }

    const globalTrends = await ScrapeCreators.getHashtagFeed(niche);
    const combined = [...followedTrends, ...globalTrends];
    const uniqueResults = Array.from(new Map(combined.map(item => [item.id, item])).values());

    if (uniqueResults.length > 0) {
      await DbService.saveTrends(uniqueResults);
      return { trends: uniqueResults, sources: [{ web: { title: "SC Live" } }], fromCache: false };
    }

    const cached = await DbService.getCachedTrends(niche);
    return { trends: cached || [], sources: [], fromCache: true };
  } catch (err) {
    return { trends: [], sources: [], fromCache: false };
  }
};

export const analyzeVideoTrend = async (trend: VideoTrend): Promise<{result: AnalysisResult, fromCache: boolean}> => {
  const cachedAnalysis = await DbService.getVideoAnalysis(trend.id);
  if (cachedAnalysis) return { result: cachedAnalysis, fromCache: true };

  const local = LogicService.calculateLocalMetrics(trend);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze viral strategy for: "${trend.title}". Desc: ${trend.description}. Views: ${trend.views}.
    RUSSIAN language. Structure as JSON. Use stats provided: Score=${local.viralScore}, ER=${local.er}, Momentum=${local.momentum}.`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stats: {
            type: Type.OBJECT,
            properties: {
              viralScore: { type: Type.STRING },
              views: { type: Type.STRING },
              median: { type: Type.STRING },
              likes: { type: Type.STRING },
              comments: { type: Type.STRING },
              er: { type: Type.STRING },
              momentum: { type: Type.STRING }
            }
          },
          transcription: { type: Type.STRING },
          hook: { type: Type.STRING },
          structure: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              body: { type: Type.STRING },
              cta: { type: Type.STRING }
            }
          },
          funnel: { type: Type.STRING },
          whyItWorked: { type: Type.ARRAY, items: { type: Type.STRING } },
          psychologicalTriggers: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
  });
  
  const result = JSON.parse(response.text.trim()) as AnalysisResult;
  result.stats.viralScore = local.viralScore; // Force local precision
  result.stats.er = local.er;
  result.stats.momentum = local.momentum;

  await DbService.saveVideoAnalysis(trend.id, result);
  return { result, fromCache: false };
};

export const generateScript = async (niche: string, topic: string, analysis?: AnalysisResult): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write a viral Reels script for niche "${niche}" about "${topic}". RUSSIAN.`,
  });
  return response.text;
};
