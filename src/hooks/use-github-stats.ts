// GitHub repository statistics hook
import { useState, useEffect } from "react";

// GitHub API response types
interface GitHubAsset {
  name: string;
  download_count: number;
  size: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: GitHubAsset[];
}

interface GitHubRepository {
  name: string;
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  subscribers_count: number;
  size: number;
  default_branch: string;
  language: string;
  updated_at: string;
  license?: {
    name: string;
  };
}

interface GitHubContributor {
  login: string;
  contributions: number;
}

export interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  subscribers: number;
  size: number;
  defaultBranch: string;
  language: string;
  lastUpdated: string;
  license?: string;
}

export interface GitHubReleaseInfo {
  tagName: string;
  name: string;
  publishedAt: string;
  downloadCount: number;
}

export interface NPMStats {
  weeklyDownloads: number;
  monthlyDownloads: number;
  yearlyDownloads: number;
}

export interface RepositoryStats {
  github: GitHubStats | null;
  npm: NPMStats | null;
  contributors: number;
  totalDownloads: number;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

interface UseGitHubStatsOptions {
  owner: string;
  repo: string;
  npmPackage?: string;
  cacheTimeout?: number; // in milliseconds, default 5 minutes
}

const CACHE_KEY_PREFIX = "github_stats_";
const DEFAULT_CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function useGitHubStats({
  owner,
  repo,
  npmPackage,
  cacheTimeout = DEFAULT_CACHE_TIMEOUT,
}: UseGitHubStatsOptions): RepositoryStats {
  const [stats, setStats] = useState<RepositoryStats>({
    github: null,
    npm: null,
    contributors: 0,
    totalDownloads: 0,
    isLoading: false,
    error: null,
    lastFetched: null,
  });

  const cacheKey = `${CACHE_KEY_PREFIX}${owner}_${repo}`;

  useEffect(() => {
    async function fetchStats() {
      // Don't fetch for placeholder/example repositories
      if (
        !owner ||
        !repo ||
        owner === "yourusername" ||
        owner === "example" ||
        repo === "farm-framework" ||
        repo === "example-repo"
      ) {
        // Set empty stats for placeholder repositories
        setStats({
          github: null,
          npm: null,
          contributors: 0,
          totalDownloads: 0,
          isLoading: false,
          error: null,
          lastFetched: new Date(),
        });
        return;
      }

      // Check cache first
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached);
          const cacheAge =
            Date.now() - new Date(parsedCache.timestamp).getTime();

          if (cacheAge < cacheTimeout) {
            setStats({
              ...parsedCache.data,
              lastFetched: new Date(parsedCache.timestamp),
            });
            return;
          }
        } catch (error) {
          console.warn("Failed to parse cached GitHub stats:", error);
        }
      }

      setStats((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Helper function to fetch with timeout and better error handling
        const fetchWithTimeout = async (
          url: string,
          timeout = 8000
        ): Promise<Response> => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          try {
            const response = await fetch(url, {
              signal: controller.signal,
              headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "FARM-Framework-Docs",
              },
            });
            clearTimeout(timeoutId);
            return response;
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        };

        // Try to fetch real GitHub stats with timeout protection
        const [repoResponse, contributorsResponse, releasesResponse] =
          await Promise.allSettled([
            fetchWithTimeout(`https://api.github.com/repos/${owner}/${repo}`),
            fetchWithTimeout(
              `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`
            ),
            fetchWithTimeout(
              `https://api.github.com/repos/${owner}/${repo}/releases`
            ),
          ]);

        let githubStats: GitHubStats | null = null;
        let contributorsCount = 0;
        let releaseDownloads = 0;
        let hasValidData = false;

        // Process repository data with validation
        if (repoResponse.status === "fulfilled" && repoResponse.value.ok) {
          try {
            const repoData: GitHubRepository = await repoResponse.value.json();
            // Validate that we received actual repository data
            if (
              repoData &&
              typeof repoData === "object" &&
              repoData.full_name
            ) {
              githubStats = {
                stars: Math.max(0, repoData.stargazers_count || 0),
                forks: Math.max(0, repoData.forks_count || 0),
                watchers: Math.max(0, repoData.watchers_count || 0),
                openIssues: Math.max(0, repoData.open_issues_count || 0),
                subscribers: Math.max(0, repoData.subscribers_count || 0),
                size: Math.max(0, repoData.size || 0),
                defaultBranch: repoData.default_branch || "main",
                language: repoData.language || "Unknown",
                lastUpdated: repoData.updated_at || new Date().toISOString(),
                license: repoData.license?.name,
              };
              hasValidData = true;
            }
          } catch (parseError) {
            console.warn("Failed to parse GitHub repository data:", parseError);
          }
        }

        // Process contributors data with validation
        if (
          contributorsResponse.status === "fulfilled" &&
          contributorsResponse.value.ok
        ) {
          try {
            const contributorsData: GitHubContributor[] =
              await contributorsResponse.value.json();
            if (Array.isArray(contributorsData)) {
              contributorsCount = contributorsData.length;
              // Only count as valid data if we have contributors
              if (contributorsCount > 0) {
                hasValidData = true;
              }
            }
          } catch (parseError) {
            console.warn(
              "Failed to parse GitHub contributors data:",
              parseError
            );
          }
        }

        // Process releases data for download counts with validation
        if (
          releasesResponse.status === "fulfilled" &&
          releasesResponse.value.ok
        ) {
          try {
            const releasesData: GitHubRelease[] =
              await releasesResponse.value.json();
            if (Array.isArray(releasesData)) {
              releaseDownloads = releasesData.reduce((total, release) => {
                if (
                  release &&
                  release.assets &&
                  Array.isArray(release.assets)
                ) {
                  return (
                    total +
                    release.assets.reduce(
                      (assetTotal: number, asset: GitHubAsset) => {
                        return (
                          assetTotal + Math.max(0, asset.download_count || 0)
                        );
                      },
                      0
                    )
                  );
                }
                return total;
              }, 0);
              // Only count as valid data if we have download stats
              if (releaseDownloads > 0) {
                hasValidData = true;
              }
            }
          } catch (parseError) {
            console.warn("Failed to parse GitHub releases data:", parseError);
          }
        }

        // Fetch NPM stats if package name provided
        let npmStats: NPMStats | null = null;
        if (npmPackage) {
          try {
            const npmResponse = await fetchWithTimeout(
              `https://api.npmjs.org/downloads/point/last-week/${npmPackage}`,
              5000 // Shorter timeout for NPM API
            );
            if (npmResponse.ok) {
              const weeklyData = await npmResponse.json();

              // Validate NPM response data
              if (weeklyData && typeof weeklyData.downloads === "number") {
                const [monthlyResponse, yearlyResponse] =
                  await Promise.allSettled([
                    fetchWithTimeout(
                      `https://api.npmjs.org/downloads/point/last-month/${npmPackage}`,
                      5000
                    ),
                    fetchWithTimeout(
                      `https://api.npmjs.org/downloads/point/last-year/${npmPackage}`,
                      5000
                    ),
                  ]);

                let monthlyDownloads = 0;
                let yearlyDownloads = 0;

                if (
                  monthlyResponse.status === "fulfilled" &&
                  monthlyResponse.value.ok
                ) {
                  try {
                    const monthlyData = await monthlyResponse.value.json();
                    monthlyDownloads = Math.max(0, monthlyData.downloads || 0);
                  } catch (parseError) {
                    console.warn(
                      "Failed to parse NPM monthly data:",
                      parseError
                    );
                  }
                }

                if (
                  yearlyResponse.status === "fulfilled" &&
                  yearlyResponse.value.ok
                ) {
                  try {
                    const yearlyData = await yearlyResponse.value.json();
                    yearlyDownloads = Math.max(0, yearlyData.downloads || 0);
                  } catch (parseError) {
                    console.warn(
                      "Failed to parse NPM yearly data:",
                      parseError
                    );
                  }
                }

                npmStats = {
                  weeklyDownloads: Math.max(0, weeklyData.downloads || 0),
                  monthlyDownloads,
                  yearlyDownloads,
                };

                // Only count as valid data if we have meaningful download numbers
                if (
                  npmStats.weeklyDownloads > 0 ||
                  npmStats.yearlyDownloads > 0
                ) {
                  hasValidData = true;
                }
              }
            }
          } catch (error) {
            console.warn("Failed to fetch NPM stats:", error);
          }
        }

        // Calculate total downloads
        const totalDownloads =
          releaseDownloads + (npmStats?.yearlyDownloads || 0);

        // Always set stats even if no data was fetched - this allows graceful degradation
        const fetchedStats: RepositoryStats = {
          github: githubStats,
          npm: npmStats,
          contributors: contributorsCount,
          totalDownloads,
          isLoading: false,
          error: null, // No error - just no data available
          lastFetched: new Date(),
        };

        // Cache the results only if we have meaningful data
        if (hasValidData) {
          try {
            const cacheData = {
              data: fetchedStats,
              timestamp: new Date().toISOString(),
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
          } catch (cacheError) {
            console.warn("Failed to cache GitHub stats:", cacheError);
            // Continue without caching - not a critical failure
          }
        }

        setStats(fetchedStats);
      } catch (error) {
        console.warn("GitHub stats API unavailable:", error);
        // Silent failure - set empty stats without error state
        // This allows the component to render nothing gracefully
        setStats({
          github: null,
          npm: null,
          contributors: 0,
          totalDownloads: 0,
          isLoading: false,
          error: null, // No error state - just no data
          lastFetched: new Date(),
        });
      }
    }

    if (owner && repo) {
      fetchStats();
    }
  }, [owner, repo, npmPackage, cacheKey, cacheTimeout]);

  return stats;
}

// Utility functions for formatting stats
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

export function formatDownloads(downloads: number): string {
  if (downloads >= 1000000) {
    return Math.floor(downloads / 1000000) + "M+";
  }
  if (downloads >= 1000) {
    return Math.floor(downloads / 1000) + "k+";
  }
  return downloads.toString();
}
