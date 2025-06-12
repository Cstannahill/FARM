// Test script to verify search functionality
console.log("🔍 Testing search functionality...");

// Test 1: Check if search index exists
fetch("/search-index.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch search index: ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("✅ Search index loaded successfully");
    console.log(`📊 Index contains ${data.documents?.length || 0} documents`);

    // Test 2: Check if search service can be imported
    import("./src/lib/enhanced-docs-search-client.js")
      .then((searchModule) => {
        console.log("✅ Search service imported successfully");

        const search = new searchModule.EnhancedDocsSearch();

        // Test 3: Initialize search
        search
          .initialize()
          .then(() => {
            console.log("✅ Search service initialized successfully");

            // Test 4: Perform a simple search
            return search.search("getting started");
          })
          .then((results) => {
            console.log("✅ Search query executed successfully");
            console.log(
              `📈 Found ${results.results.length} results for "getting started"`
            );
            console.log(
              `⚡ Search took ${Math.round(results.metrics.searchTime)}ms`
            );

            if (results.results.length > 0) {
              console.log("📄 First result:", results.results[0].title);
            }
          })
          .catch((error) => {
            console.error("❌ Search test failed:", error);
          });
      })
      .catch((error) => {
        console.error("❌ Failed to import search service:", error);
      });
  })
  .catch((error) => {
    console.error("❌ Failed to load search index:", error);
  });
