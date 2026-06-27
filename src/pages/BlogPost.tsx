import { useState, useEffect } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';

const STRAPI_URL = "http://localhost:1337";

export default function BlogPost({ slug, setCurrentPage }: { slug: string, setCurrentPage: (p: string) => void }) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`)
      .then(res => res.json())
      .then(json => {
        if (json && json.data && json.data.length > 0) {
          setArticle(json.data[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center font-mono text-primary animate-pulse">Carregando artigo...</div>;
  }

  if (!article) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Artigo não encontrado</h2>
        <button onClick={() => setCurrentPage('blog')} className="text-secondary font-bold hover:underline">← Voltar para o Blog</button>
      </div>
    );
  }

  const coverUrl = article.cover ? `${STRAPI_URL}${article.cover.url}` : null;
  const dateStr = article.publishedDate ? new Date(article.publishedDate).toLocaleDateString('pt-BR') : '';

  return (
    <article className="w-full bg-surface-container-lowest min-h-[60vh] pb-24">
      {coverUrl && (
        <div className="w-full h-64 md:h-96 relative">
          <img src={coverUrl} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto px-6 md:px-0 -mt-16 md:-mt-24 relative z-10">
        <div className="bg-surface-container-lowest p-8 md:p-12 industrial-border shadow-lg rounded-sm">
          <button 
            onClick={() => setCurrentPage('blog')}
            className="flex items-center gap-2 font-mono text-xs uppercase font-bold text-on-surface-variant hover:text-secondary transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Voltar para o Blog
          </button>
          
          <h1 className="font-sans text-3xl md:text-5xl font-bold text-primary leading-tight mb-6 tracking-tight">
            {article.title}
          </h1>
          
          {dateStr && (
            <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs uppercase tracking-wider mb-10 pb-6 border-b border-outline-variant">
              <Calendar size={14} /> Publicado em {dateStr}
            </div>
          )}
          
          <div className="prose prose-lg max-w-none text-on-surface-variant font-sans leading-relaxed space-y-6">
            {(article.content || '').split('\n').map((paragraph: string, idx: number) => {
              if (!paragraph.trim()) return null;
              return <p key={idx} className="text-lg">{paragraph}</p>;
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
