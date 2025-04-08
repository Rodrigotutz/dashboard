// components/like-buttons.tsx
"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { registerLike } from "@/@actions/tip/tip";

export function LikeButtons({
  tipId,
  initialLikes,
  initialDislikes,
  onVoteSuccess,
}: {
  tipId: number;
  initialLikes: number;
  initialDislikes: number;
  onVoteSuccess?: (updatedTip: any) => void;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (type: "like" | "dislike") => {
    try {
      setIsLoading(true);
      const result = await registerLike(tipId, type);

      if (result.success && result.tip) {
        setLikes(result.tip.likes);
        setDislikes(result.tip.dislikes);

        if (onVoteSuccess) {
          onVoteSuccess(result.tip);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("like")}
        disabled={isLoading}
      >
        <ThumbsUp className="h-4 w-4 text-green-500 mr-2" />
        {likes}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("dislike")}
        disabled={isLoading}
      >
        <ThumbsDown className="h-4 w-4 text-red-500 mr-2" />
        {dislikes}
      </Button>
    </div>
  );
}
