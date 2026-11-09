import { cached, cacheTtl } from "./cache";
import type { NewsArticle } from "./types";

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

export async function getNews(): Promise<NewsArticle[]> {
  return cached("news", cacheTtl.news, async () => {
    const baseUrl = process.env.NEWS_BASE_URL;
    const apiKey = process.env.NEWS_API_KEY;

    if (!baseUrl || !apiKey) {
      return [];
    }

    try {
      const response = await fetch(baseUrl, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(12_000),
        headers: { "Authorization": `Bearer ${apiKey}`, "Accept": "application/json" }
      });
      if (!response.ok) throw new Error("News provider request failed");
      const json = await response.json();
      const articles = Array.isArray(json.articles) ? json.articles : [];
      return articles.slice(0, 24).map((item: unknown, index: number): NewsArticle => {
        const article = record(item);
        const source = record(article.source);
        return {
        id: String(article.id ?? `provider-news-${index}`),
        title: String(article.title ?? "Untitled story"),
        source: String(source.name ?? article.source ?? "News provider"),
        publishedAt: String(article.publishedAt ?? new Date().toISOString()),
        summary: String(article.description ?? article.summary ?? ""),
        url: String(article.url ?? "#"),
        imageUrl: typeof article.urlToImage === "string" ? article.urlToImage : typeof article.image === "string" ? article.image : undefined,
        category: "general"
      };
      });
    } catch {
      return [];
    }
  });
}
