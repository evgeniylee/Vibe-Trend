
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, VideoTrend, InstagramAccount } from "./types";
import { supabase } from "./supabaseClient";
import { ScrapeCreators } from "./scrapeCreatorsService";

// Helper to get fresh AI instance (as per security and session best practices)
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const HOOK_TEMPLATES = [
  { text: "Как я получил {topic} всего за {time}", style: "Result-Driven" },
  { text: "Перестань делать {topic}, если не хочешь {pain}", style: "Fear of Missing Out" },
  { text: "Секрет {topic}, о котором молчат 99% экспертов", style: "Secret" },
  { text: "3 простых шага, чтобы {topic} стал реальностью", style: "Educational" },
  { text: "Это изменило мою жизнь: как {topic} помог мне", style: "Storytelling" }
];

export const LogicService = {
  calculateLocalMetrics: (trend: VideoTrend) => {
    const views = parseInt(trend.views.replace(/[^0-9]/g, '')) || 0;
    const followers = trend.creatorFollowers || 5000;
    const multiplier = Math.round((views / followers) * 10) / 10;
    
    const momentum: 'Steady' | 'High' | 'Explosive' = 
      multiplier > 50 ? 'Explosive' : multiplier > 10 ? 'High' : 'Steady';

    return {
      viralScore: `${multiplier}x`,
      momentum,
      er: `${Math.min(25, Math.round((multiplier / 2) * 100) / 100)}%`,
      multiplier
    };
  },

  getInstantHooks: (topic: string) => {
    return HOOK_TEMPLATES.map(tpl => ({
      text: tpl.text
        .replace('{topic}', topic)
        .replace('{time}', '24 часа')
        .replace('{pain}', 'потерять охваты'),
      style: tpl.style,
      visualAdvice: "Используйте динамичный монтаж и крупные субтитры в центре экрана.",
      score: 75 + Math.floor(Math.random() * 20)
    }));
  }
};

export const DbService = {
  getScKey: async (): Promise<string | null> => {
    const { data } = await supabase.from('app_settings').select('value').eq('key', 'sc_api_key').maybeSingle();
    return data?.value || null;
  },

  saveScKey: async (val: string) => {
    await supabase.from('app_settings').upsert({ key: 'sc_api_key', value: val }, { onConflict: 'key' });
  },

  getTrackedAccounts: async (): Promise<InstagramAccount[]> => {
    const { data, error } = await supabase.from('tracked_accounts').select('*').order('last_updated', { ascending: false });
    if (error) return [];
    return data.map(acc => ({
      ...acc,
      id: acc.id,
      fullName: acc.full_name,
      avgViews: acc.avg_views,
      isGrowing: acc.is_growing,
      isVisible: acc.is_visible,
      lastUpdated: new Date(acc.last_updated).getTime()
    }));
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

  // Added deleteScript to fix missing property error in ScriptsView
  deleteScript: async (id: string) => {
    const { error } = await supabase.from('saved_scripts').delete().eq('id', id);
    if (error) throw error;
  }
};

export const searchInstagramAccount = async (handle: string): Promise<InstagramAccount | null> => {
  try {
    const result = await ScrapeCreators.getProfile(handle);
    return result ? result.account : null;
  } catch (err) {
    console.error("Search API Failure:", err);
    return null;
  }
};

export const fetchTrendsFromWeb = async (
  niche: string, 
  followedAccounts: InstagramAccount[] = []
): Promise<{ trends: VideoTrend[], sources: any[], fromCache: boolean }> => {
  const key = ScrapeCreators.getKey();
  if (!key) {
    const { data } = await supabase.from('cached_trends').select('*').ilike('niche', niche.trim());
    return { trends: data?.map(t => ({ ...t, id: t.external_id })) || [], sources: [], fromCache: true };
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

    return { trends: uniqueResults, sources: [{ web: { title: "Live Feed" } }], fromCache: false };
  } catch (err) {
    console.error("Fetch Error:", err);
    return { trends: [], sources: [], fromCache: false };
  }
};

export const analyzeVideoTrend = async (trend: VideoTrend): Promise<{result: AnalysisResult, fromCache: boolean}> => {
  const cachedAnalysis = await DbService.getVideoAnalysis(trend.id);
  if (cachedAnalysis) return { result: cachedAnalysis, fromCache: true };

  const local = LogicService.calculateLocalMetrics(trend);
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze viral strategy for: "${trend.title}". Desc: ${trend.description}. Views: ${trend.views}.
    Language: RUSSIAN. Response must be JSON only. Use these calculated stats: Score=${local.viralScore}, ER=${local.er}, Momentum=${local.momentum}.`,
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
  
  const result = JSON.parse(response.text) as AnalysisResult;
  // Ensure math consistency
  result.stats.viralScore = local.viralScore;
  result.stats.er = local.er;
  result.stats.momentum = local.momentum;

  await DbService.saveVideoAnalysis(trend.id, result);
  return { result, fromCache: false };
};

export const generateScript = async (niche: string, topic: string, analysis?: AnalysisResult): Promise<string> => {
  const ai = getAI();
  const prompt = analysis 
    ? `Based on this viral structure: ${JSON.stringify(analysis.structure)}. Create a new script for niche "${niche}" about "${topic}". Language: RUSSIAN. Format as a screenplay.`
    : `Write a viral Reels script for niche "${niche}" about "${topic}". Include hook, body, and CTA. Language: RUSSIAN.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
};
