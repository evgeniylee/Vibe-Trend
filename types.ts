
// Navigation tabs available in the application
export type NavigationTab = 'trends' | 'keyword_search' | 'radar' | 'audio_lab' | 'hook_factory' | 'analysis' | 'scripts' | 'watchlist' | 'accounts' | 'settings' | 'pricing';

// Data structure for a viral video trend
export interface VideoTrend {
  id: string;
  thumbnail: string;
  videoUrl?: string | null;
  postUrl?: string | null;
  title: string;
  niche: string;
  region: string;
  views: string;
  viewsNumber?: number; // Raw number for calculations
  likes: string;
  comments: string;
  shares: string;
  growth: string;
  creator: string;
  creatorFollowers?: number; // To calculate multiplier
  description: string;
  momentum?: 'Steady' | 'High' | 'Explosive';
  hookStrength?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  isAnomaly?: boolean;
  anomalyMultiplier?: number; // e.g., 50 (50x more views than followers)
  anomalyType?: 'Underdog' | 'Rocket' | 'Silent Viral';
  audioId?: string;
  audioName?: string;
  lastUpdated?: number;
}
// ... rest of the types remain same
export interface AudioTrend {
  id: string;
  name: string;
  creator: string;
  usageCount: string;
  usageNumber: number; // For sorting
  growth: string;
  velocity: 'Sprinting' | 'Running' | 'Walking'; // Speed of growth
  saturation: number; // 0-100%
  topNiches: string[];
  prediction: 'Rising Star' | 'Peak' | 'Saturated' | 'Hidden Gem';
  isNew: boolean;
  thumbnail: string;
}

export interface InstagramAccount {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  followers: string;
  avgViews: string;
  niche: string;
  isGrowing: boolean;
  description: string;
  isVisible?: boolean;
  lastUpdated?: number;
}

export interface AnalysisResult {
  stats: {
    viralScore: string;
    views: string;
    median: string;
    likes: string;
    comments: string;
    er: string;
    momentum: string;
    hookStrength: string;
  };
  transcription: string;
  hook: string;
  structure: {
    hook: string;
    body: string;
    cta: string;
  };
  funnel: string;
  whyItWorked: string[];
  psychologicalTriggers: string[];
}

export interface UserSubscription {
  plan: 'free' | 'pro' | 'agency' | string;
  isPro: boolean;
  usageCount: number;
  usageLimit: number;
  timeSaved: string;
}

export interface SCInstagramUser {
  id: string;
  username: string;
  full_name?: string;
  profile_pic_url?: string;
  profile_pic_url_hd?: string;
  biography?: string;
  follower_count?: number;
  edge_followed_by?: { count: number };
  category_name?: string;
}

export interface SCInstagramMedia {
  node?: any;
  id?: string;
  pk?: string;
  shortcode?: string;
  display_url?: string;
  video_url?: string;
}
