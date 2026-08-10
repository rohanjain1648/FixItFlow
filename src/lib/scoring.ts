export interface ContractorScoreInput {
  contractorId: string;
  name: string;
  rating: number;
  quotedPrice?: number;
  hourlyRate?: number;
  isAvailable: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
}

export interface ScoredContractor extends ContractorScoreInput {
  score: number; // 0 to 100
  reasoning: string;
}

export function rankContractors(
  contractors: ContractorScoreInput[]
): ScoredContractor[] {
  return contractors
    .map((c) => {
      let score = 50;

      // Rating impact (0-25 pts)
      const ratingPts = (c.rating / 5) * 25;
      score += ratingPts;

      // Price impact (0-25 pts)
      const price = c.quotedPrice || c.hourlyRate || 150;
      const pricePts = Math.max(0, 25 - (price / 200) * 20);
      score += pricePts;

      // Availability impact (0-50 pts)
      if (c.isAvailable) {
        score += 30;
      } else {
        score -= 20;
      }

      // Priority boost
      if (c.priority === "EMERGENCY" && c.isAvailable) {
        score += 15;
      }

      const finalScore = Math.min(100, Math.round(score));
      const reasoning = `${c.name}: Rating (${c.rating}/5), Quote ($${price}), Available (${c.isAvailable ? "Yes" : "No"}) -> Score ${finalScore}/100`;

      return {
        ...c,
        score: finalScore,
        reasoning,
      };
    })
    .sort((a, b) => b.score - a.score);
}
