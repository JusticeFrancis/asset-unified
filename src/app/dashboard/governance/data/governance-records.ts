export type GovernanceProposalStatus = "active" | "closed";
export type GovernanceVoteChoice = "for" | "against" | "abstain";
export type GovernanceVoteTally = { for: { count: number; pct: number }; against: { count: number; pct: number }; abstain: { count: number; pct: number } };
export type GovernanceProposalRecord = {
  id?: string; slug: string; breadcrumbLabel: string; title: string; propertyLine: string; propertyShort: string;
  categoryLabel: string; status: GovernanceProposalStatus; forPct: number; againstPct: number; abstainPct?: number;
  listUserVoteLabel?: string; proposerNote: string; eligibleVotes: number; daysLeft?: string; locationDetail: string;
  description: string; proposedBy: string; dateSubmitted: string; votingCloses: string; cost: string; quorumRequired: string;
  voteTally: GovernanceVoteTally; castSummary: string; quorumMessage: string; userVotingPower: number; seedHasVoted?: boolean;
  userVoteSummary?: { choice: GovernanceVoteChoice; votes: number; dateLabel: string };
  voteBlurbs: Record<GovernanceVoteChoice, string>;
};
