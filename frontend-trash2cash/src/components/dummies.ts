export interface NFTAchievement {
    id: string;
    title: string;
    description: string;
    image: string;
    requiredTokens: number;
    requiredItems?: number;
    isUnlocked: boolean;
    isMinted: boolean;
  }

export interface DetectedItem {
    name: string;
    confidence: number;
    category: "plastic" | "paper" | "metal" | "glass" | "organic" | "other";
    tokenValue: number;
  }

export interface LeaderboardUser {
  id: string;
  name: string;
  image: string | null;
  totalItems: number;
  totalTokens: number;
  totalSubmissions: number;
  rank: number;
}


export  const recentActivities = [
    {
      type: "Plastic Bottle Recycling",
      description: "Submitted 5 plastic bottles",
      time: "Today, 10:30 AM",
      status: "success" as const,
    },
    {
      type: "Paper Recycling",
      description: "Submitted 2kg of paper waste",
      time: "Yesterday, 4:15 PM",
      status: "success" as const,
    },
    {
      type: "Token Exchange",
      description: "Exchanged 50 T2C for rewards",
      time: "May 10, 2:20 PM",
      status: "pending" as const,
    },
  ]; 


    