
import React from 'react';
import { VideoTrend, AudioTrend } from './types';

export const MOCK_AUDIO: AudioTrend[] = [
  { 
    id: 'a1', 
    name: 'Lo-Fi Chill Morning', 
    creator: '@audio_prod', 
    usageCount: '12.4K', 
    usageNumber: 12400,
    growth: '+450%', 
    velocity: 'Sprinting',
    saturation: 15,
    topNiches: ['Lifestyle', 'Aesthetic', 'Coffee'],
    prediction: 'Rising Star',
    isNew: true, 
    thumbnail: 'https://images.unsplash.com/photo-1514525253361-bee8718a342b?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'a2', 
    name: 'Extreme Transition Bass', 
    creator: '@editor_beats', 
    usageCount: '245K', 
    usageNumber: 245000,
    growth: '+12%', 
    velocity: 'Walking',
    saturation: 85,
    topNiches: ['Transitions', 'Fashion', 'Travel'],
    prediction: 'Saturated',
    isNew: false, 
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop' 
  }
];

export const MOCK_TRENDS: VideoTrend[] = [
  {
    id: 'anomaly-ultra-1',
    thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop',
    title: 'How to organize your desk for maximum productivity',
    niche: 'Productivity',
    region: 'RU',
    views: '1.5M',
    viewsNumber: 1500000,
    likes: '120K',
    comments: '800',
    shares: '45K',
    growth: '+1200%',
    creator: '@focus_mate',
    creatorFollowers: 1200,
    isAnomaly: true,
    anomalyMultiplier: 1250,
    anomalyType: 'Underdog',
    momentum: 'Explosive',
    description: 'Маленький аккаунт показал феноменальный результат на простом бытовом совете.'
  },
  {
    id: 'anomaly-rocket-1',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    title: 'The unboxing of the future',
    niche: 'Tech',
    region: 'Global',
    views: '8.2M',
    viewsNumber: 8200000,
    likes: '950K',
    comments: '12K',
    shares: '200K',
    growth: '+500%',
    creator: '@tech_nexus',
    creatorFollowers: 1000000,
    isAnomaly: true,
    anomalyMultiplier: 8.2,
    anomalyType: 'Rocket',
    momentum: 'Explosive',
    description: 'Видео набрало 5 миллионов за последние 12 часов. Трендовый звук и монтаж.'
  },
  {
    id: 'test-viral-1',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    title: 'The Rock Casting Call 1990s',
    niche: 'Entertainment',
    region: 'Global',
    views: '12.3M',
    viewsNumber: 12300000,
    likes: '452K',
    comments: '12.4K',
    shares: '85K',
    growth: '+240%',
    creator: '@wmag',
    description: 'Dwayne Johnson talks about his name and background.'
  }
];

export const ICONS = {
  AllVideos: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  SearchWord: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Radar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v2m0 16v2m10-10h-2M4 10H2" />
    </svg>
  ),
  AudioLab: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  HookFactory: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Analysis: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Channels: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Scripts: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Saved: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};
