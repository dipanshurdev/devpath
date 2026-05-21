import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {  BookmarkIcon, Clock, Users, Heart } from 'lucide-react';
import { CompactBookmarkButton } from '@/components/BookmarkButton';

interface RoadmapCardLazyProps {
  roadmapId: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: string;
  viewCount?: number;
  likeCount?: number;
  bookmarkCount?: number;
  isBookmarked?: boolean;
  isFeatured?: boolean;
  creator?: {
    name: string;
    username: string;
    avatar?: string;
  };
  className?: string;
}

// Memoized roadmap card component for better performance
const RoadmapCardLazy = React.memo<RoadmapCardLazyProps>(({
  roadmapId,
  title,
  description,
  type,
  difficulty,
  estimatedTime,
  viewCount = 0,
  likeCount = 0,
  bookmarkCount = 0,
  isBookmarked = false,
  isFeatured = false,
  creator,
  className = '',
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500 text-white';
      case 'intermediate':
        return 'bg-yellow-500 text-white';
      case 'advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group ${className} `}
    >
      <Card className="glass-card-hover w-full min-w-[350px]
    h-[400px]">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyBadgeColor(difficulty)}>
                  {difficulty}
                </Badge>
                {isFeatured && (
                  <Badge className="ml-2 bg-amber-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              
              <h3 className="heading-4 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </h3>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <CompactBookmarkButton
                roadmapId={roadmapId}
                initialBookmarked={isBookmarked}
                initialCount={bookmarkCount}
              />
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>{type}</span>
                <span>•</span>
                <span>{estimatedTime}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="body-sm text-muted dark:text-white/80 line-clamp-3 text-gray-800">
            {description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between border-y border-border/40 py-4">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{viewCount || 0}</span>
              </div>
              <span>Views</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                <span>{likeCount || 0}</span>
              </div>
              <span>Likes</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BookmarkIcon className="w-3.5 h-3.5 text-primary" />
                <span>{bookmarkCount || 0}</span>
              </div>
              <span>Saves</span>
            </div>
          </div>

          {/* Creator */}
          {creator && (
            <div className="flex items-center gap-3 pt-4 border-t border-border/40">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/80 p-0.5">
                <Image
                  src={creator.avatar || `https://api.dicebear.com/7.x?seed=${creator.username}`}
                  alt={creator.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x?seed=${creator.username}`;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{creator.name}</p>
                <p className="text-xs text-muted-foreground">@{creator.username}</p>
              </div>
            </div>
          )}

          {/* Time Estimate */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime}</span>
          </div>

          {/* CTA Button */}
          <Button asChild className="premium-button w-full group">
            <Link href={`/roadmaps/${roadmapId}`}>
              Start Learning
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
});

RoadmapCardLazy.displayName = 'RoadmapCardLazy';

export default RoadmapCardLazy;
