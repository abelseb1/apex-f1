import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { NewsArticle } from "@/lib/api";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="group overflow-hidden rounded-md border border-white/10 bg-[#111218] shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:border-white/25">
      <div className="relative h-48 overflow-hidden bg-white/[0.03]">
        {article.imageUrl?.startsWith("/") ? <Image src={article.imageUrl} alt="" fill className="object-cover transition duration-500 group-hover:scale-[1.03]" /> : null}
        {article.imageUrl && !article.imageUrl.startsWith("/") ? (
          // Provider domains are dynamic, so an ordinary image avoids a brittle allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : null}
        <span className="absolute left-0 top-0 h-1 w-16 bg-apex" aria-hidden />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-[0.68rem] font-black uppercase text-white/38">
          <span>{article.source}</span>
          <time dateTime={article.publishedAt}>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(article.publishedAt))}</time>
        </div>
        <h3 className="mt-4 text-xl font-black leading-tight">{article.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/52">{article.summary}</p>
        <a href={article.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase text-white/66 hover:text-white">
          Read source <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </article>
  );
}
