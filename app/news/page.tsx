import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { getNews } from "@/lib/api";

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "all" } = await searchParams;
  const articles = (await getNews()).filter((article) => {
    const matchesQuery = `${article.title} ${article.summary}`.toLowerCase().includes(q.toLowerCase());
    const matchesCategory = category === "all" || article.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <PageHeader title="Latest News" eyebrow="Attributed sources">
        <form className="flex flex-wrap gap-2">
          <input name="q" defaultValue={q} placeholder="Search" className="rounded-md border border-line bg-white/8 px-3 py-2 text-sm" />
          <select name="category" defaultValue={category} className="rounded-md border border-line bg-graphite px-3 py-2 text-sm">
            {["all", "race", "technical", "driver", "team", "general"].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button className="rounded-md bg-apex px-4 py-2 text-sm font-bold">Filter</button>
        </form>
      </PageHeader>
      {articles.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => <NewsCard key={article.id} article={article} />)}
        </div>
      ) : <EmptyState title="News feed unavailable" message="No attributed stories are available from the configured provider right now." />}
    </>
  );
}
