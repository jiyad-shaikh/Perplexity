
import { tavily as Tavily } from "@tavily/core";

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
});

export const searchInternet = async (query) => {
    try {
        // Handle both string and object inputs
        const searchQuery =
            typeof query === "string" ? query : query?.query;

        if (!searchQuery || typeof searchQuery !== "string") {
            throw new Error("A valid search query is required.");
        }

        const response = await tavily.search(searchQuery, {
            maxResults: 5,
            searchDepth: "advanced",
        });

        return response;

    } catch (err) {
        console.error("Tavily Internet Search Error:", err.message);

        throw new Error(`Internet search failed: ${err.message}`);
    }
};
