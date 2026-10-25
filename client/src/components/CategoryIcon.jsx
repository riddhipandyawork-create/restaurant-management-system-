import {
  Sparkles, Flame, Leaf, Coffee, UtensilsCrossed,
  Utensils, Star, Heart, Award, Layers, Disc,
  Compass, Scroll, Wheat, CircleDot, ChefHat
} from 'lucide-react';

const ICON_MAP = {
  'from-the-temples': Sparkles,
  'from-the-streets': Compass,
  'flowing-from-tradition': Leaf,
  'ghee-roast-specials': Flame,
  'thali': UtensilsCrossed,
  'classics': Star,
  'vadais': CircleDot,
  'idlis': Layers,
  'dosais': Utensils,
  'paper-dosais': Scroll,
  'rava-dosais': Disc,
  'uthappams': Disc,
  'rice': Wheat,
  'specials': Award,
  'prasadam': Heart,
  'beverages': Coffee,
};

export default function CategoryIcon({ slug, size = 16, color, className, style }) {
  const Icon = ICON_MAP[slug] || UtensilsCrossed;
  return <Icon size={size} color={color} className={className} style={{ flexShrink: 0, ...style }} />;
}
