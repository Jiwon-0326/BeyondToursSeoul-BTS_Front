import {
  Camera,
  Car,
  Coffee,
  Footprints,
  Heart,
  Home,
  Landmark,
  Leaf,
  MapPin,
  Moon,
  Music2,
  Palette,
  ShoppingBag,
  Shuffle,
  SkipForward,
  Smartphone,
  Soup,
  Train,
  User,
  Users,
  Wifi,
} from 'lucide-vue-next'

export const interestOptions = [
  { id: 'cafe', icon: Coffee, color: '#c97000', label: '카페' },
  { id: 'food', icon: Soup, color: '#f97316', label: '맛집' },
  { id: 'history', icon: Landmark, color: '#a16207', label: '역사/문화' },
  { id: 'nature', icon: Leaf, color: '#16a34a', label: '자연' },
  { id: 'art', icon: Palette, color: '#db2777', label: '예술/전시' },
  { id: 'kpop', icon: Music2, color: '#7c3aed', label: 'K-팝/아이돌' },
  { id: 'shopping', icon: ShoppingBag, color: '#0ea5e9', label: '쇼핑' },
  { id: 'activity', icon: Footprints, color: '#ea580c', label: '액티비티' },
  { id: 'healing', icon: Heart, color: '#ef4444', label: '힐링' },
  { id: 'night', icon: Moon, color: '#2563eb', label: '야경/바' },
  { id: 'photo', icon: Camera, color: '#0891b2', label: '포토스팟' },
  { id: 'local', icon: MapPin, color: '#0d9488', label: '로컬 탐방' },
]

export const relationshipOptions = [
  { id: '혼자', icon: User, color: '#0ea5e9', label: '혼자' },
  { id: '친구', icon: Users, color: '#6366f1', label: '친구' },
  { id: '가족', icon: Home, color: '#16a34a', label: '가족' },
  { id: '연인', icon: Heart, color: '#e11d48', label: '연인' },
]

export const mobilityOptions = [
  { id: 'public', icon: Train, color: '#0284c7', label: '대중교통 중심' },
  { id: 'rental', icon: Car, color: '#f97316', label: '렌트카 중심' },
  { id: 'hybrid', icon: Shuffle, color: '#7c3aed', label: '혼합(상황별)' },
]

export const simOptions = [
  { id: 'skip', icon: SkipForward, color: '#64748b', label: '필요 없음' },
  { id: 'esim', icon: Wifi, color: '#0ea5e9', label: 'eSIM 추천' },
  { id: 'sim', icon: Smartphone, color: '#f59e0b', label: 'USIM 추천' },
]
