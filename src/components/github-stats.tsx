// GitHub Statistics Display Component
import React from "react";
import { Star, Download, Users, GitFork, Eye } from "lucide-react";
import {
  useGitHubStats,
  formatNumber,
  formatDownloads,
} from "@/hooks/use-github-stats";

interface GitHubStatsProps {
  owner: string;
  repo: string;
  npmPackage?: string;
  showAll?: boolean;
  className?: string;
  showDefaults?: boolean; // New prop to control whether to show minimal defaults
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isLoading?: boolean;
}

function StatItem({ icon, label, value, isLoading }: StatItemProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>
        {isLoading ? (
          <span className="inline-block w-12 h-4 bg-muted animate-pulse rounded" />
        ) : (
          `${value} ${label}`
        )}
      </span>
    </div>
  );
}

function GitHubStats({
  owner,
  repo,
  npmPackage,
  showAll = false,
  className = "",
  showDefaults = false, // New prop with default false
}: GitHubStatsProps) {
  const { github, npm, contributors, totalDownloads, isLoading, error } =
    useGitHubStats({
      owner,
      repo,
      npmPackage,
    });

  // If there's an error or still loading with no cached data, don't render anything
  if (error || (isLoading && !github && !npm && contributors === 0)) {
    return null;
  }

  const stats = [];

  // Check if we have any meaningful data (more than baseline)
  const hasRealData = github || npm || contributors > 0 || totalDownloads > 0;

  // Define thresholds for showing stats (you can adjust these)
  const STAR_THRESHOLD = 5;
  const DOWNLOAD_THRESHOLD = 10;
  const CONTRIBUTOR_THRESHOLD = 2;

  // Use real data if available, otherwise use minimal defaults when showDefaults is true
  const starsCount = github?.stars || (showDefaults && !hasRealData ? 1 : 0);
  const downloadsCount =
    totalDownloads ||
    npm?.yearlyDownloads ||
    (showDefaults && !hasRealData ? 1 : 0);
  const contributorsCount =
    contributors || (showDefaults && !hasRealData ? 1 : 0);

  // Check if any stat meets the threshold for display
  const hasStarsWorthShowing = starsCount >= STAR_THRESHOLD;
  const hasDownloadsWorthShowing = downloadsCount >= DOWNLOAD_THRESHOLD;
  const hasContributorsWorthShowing =
    contributorsCount >= CONTRIBUTOR_THRESHOLD;

  // If no real data and defaults not requested, show nothing
  // Also hide if we have real data but it's below thresholds and showDefaults is false
  if (
    (!hasRealData && !showDefaults && !isLoading) ||
    (!showDefaults &&
      !isLoading &&
      hasRealData &&
      !hasStarsWorthShowing &&
      !hasDownloadsWorthShowing &&
      !hasContributorsWorthShowing)
  ) {
    return null;
  }

  // Stars (most important) - show if above threshold OR if showDefaults is true
  if (
    (starsCount >= STAR_THRESHOLD || showDefaults) &&
    (starsCount > 0 || isLoading)
  ) {
    stats.push(
      <StatItem
        key="stars"
        icon={<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        label="stars"
        value={isLoading ? "" : formatNumber(starsCount)}
        isLoading={isLoading}
      />
    );
  }

  // Downloads (NPM + GitHub releases) - show if above threshold OR if showDefaults is true
  if (
    (downloadsCount >= DOWNLOAD_THRESHOLD || showDefaults) &&
    (downloadsCount > 0 || isLoading)
  ) {
    stats.push(
      <StatItem
        key="downloads"
        icon={<Download className="h-4 w-4" />}
        label="downloads"
        value={isLoading ? "" : formatDownloads(downloadsCount)}
        isLoading={isLoading}
      />
    );
  }

  // Contributors/Developers - show if above threshold OR if showDefaults is true
  if (
    (contributorsCount >= CONTRIBUTOR_THRESHOLD || showDefaults) &&
    (contributorsCount > 0 || isLoading)
  ) {
    stats.push(
      <StatItem
        key="contributors"
        icon={<Users className="h-4 w-4" />}
        label="developers"
        value={isLoading ? "" : formatNumber(contributorsCount)}
        isLoading={isLoading}
      />
    );
  }

  // Additional stats if showAll is true
  if (showAll && github) {
    if (github.forks > 0) {
      stats.push(
        <StatItem
          key="forks"
          icon={<GitFork className="h-4 w-4" />}
          label="forks"
          value={formatNumber(github.forks)}
          isLoading={isLoading}
        />
      );
    }

    if (github.watchers > 0) {
      stats.push(
        <StatItem
          key="watchers"
          icon={<Eye className="h-4 w-4" />}
          label="watchers"
          value={formatNumber(github.watchers)}
          isLoading={isLoading}
        />
      );
    }
  }

  // Show loading placeholders only if we're actively loading and have no stats yet
  if (stats.length === 0 && isLoading) {
    return (
      <div
        className={`flex items-center justify-center gap-6 text-sm text-muted-foreground ${className}`}
      >
        <StatItem
          icon={<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
          label="stars"
          value=""
          isLoading={true}
        />
        <StatItem
          icon={<Download className="h-4 w-4" />}
          label="downloads"
          value=""
          isLoading={true}
        />
        <StatItem
          icon={<Users className="h-4 w-4" />}
          label="developers"
          value=""
          isLoading={true}
        />
      </div>
    );
  }

  // If no stats and not loading, don't render anything (graceful degradation)
  if (stats.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center gap-6 text-sm text-muted-foreground ${className}`}
    >
      {stats}
    </div>
  );
}

export default GitHubStats;
