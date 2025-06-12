// Clear GitHub stats cache
// Run this in browser console to clear any cached fake data

function clearGitHubStatsCache() {
  const keys = Object.keys(localStorage);
  const githubStatsKeys = keys.filter((key) => key.startsWith("github_stats_"));

  console.log("Found GitHub stats cache keys:", githubStatsKeys);

  githubStatsKeys.forEach((key) => {
    localStorage.removeItem(key);
    console.log("Removed cache key:", key);
  });

  console.log(
    "GitHub stats cache cleared. Refresh the page to see updated stats."
  );

  // Also refresh the page
  window.location.reload();
}

// Run the function
clearGitHubStatsCache();
