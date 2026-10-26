import Link from "next/link";
import { notFound } from "next/navigation";
import { newsArticles } from "@/lib/news-data";
import NewsSidebar from "@/components/NewsSidebar";

export default function NewsArticle({ params }: { params: { slug: string } }) {
  const article = newsArticles.find((item) => item.slug === params.slug);
  if (!article) notFound();
  const related = newsArticles.filter((item) => item.category === article.category && item.slug !== article.slug).slice(0, 2);
  return <main className="mx-auto max-w-6xl px-4 pt-8"><p className="mb-5 text-sm text-gray-500"><Link href="/" className="hover:text-orange-600">Trang chủ</Link> / <Link href="/news" className="hover:text-orange-600">Tin tức</Link> / {article.category}</p>
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <article className="min-w-0 rounded-3xl border bg-white p-5 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-orange-600">{article.category} · {article.date}</p><h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{article.title}</h1><p className="mt-4 text-lg leading-7 text-gray-600">{article.intro}</p><img src={article.image} alt="" className="mt-7 aspect-[16/9] w-full rounded-2xl object-cover"/><div className="mt-8">{article.sections.map((section) => <section key={section.heading} className="mb-8"><h2 className="text-xl font-extrabold">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 text-sm leading-7 text-gray-700">{paragraph}</p>)}</section>)}</div>{related.length > 0 && <div className="mt-10 border-t pt-6"><h2 className="text-lg font-bold">Bài viết liên quan</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{related.map((item) => <Link key={item.slug} href={`/news/${item.slug}`} className="rounded-xl bg-gray-50 p-4 text-sm font-semibold hover:text-orange-700">{item.title} →</Link>)}</div></div>}</article>
      <NewsSidebar activeCategory={article.category}/>
    </div>
  </main>;
}
