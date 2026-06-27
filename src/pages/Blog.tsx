import { useState, useEffect } from 'react';
import { Newspaper, Calendar, ArrowRight, Activity, ExternalLink } from 'lucide-react';

const STRAPI_URL = "http://localhost:1337";

export default function Blog({ setCurrentPage }: { setCurrentPage: (p: string) => void }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    // Busca artigos internos (Strapi)
    fetch(`${STRAPI_URL}/api/articles?populate=*&sort=publishedDate:desc`)
      .then(res => res.json())
      .then(json => {
        if (json && json.data) setArticles(json.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    // Busca notícias externas automáticas (ArchDaily)
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com.br/br/feed')
      .then(res => res.json())
      .then(json => {
        if (json && json.items) {
          setNews(json.items.slice(0, 3));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setNewsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 md:px-16 py-12 lg:py-20">
      <div className="mb-12 border-b-2 border-outline-variant pb-6 flex items-center gap-4">
        <Newspaper className="text-primary" size={40} />
        <div>
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-primary uppercase tracking-tight">
            Notícias e Artigos
          </h1>
          <p className="font-sans text-lg text-on-surface-variant mt-2">
            Novidades da indústria, dicas de materiais e atualizações do nosso estoque.
          </p>
        </div>
      </div>

      {/* Radar Automático */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="text-secondary" size={28} />
          <h2 className="font-sans text-2xl font-bold uppercase tracking-tight text-on-surface">Radar da Construção</h2>
        </div>
        
        {newsLoading ? (
           <p className="font-mono text-primary animate-pulse">Buscando notícias no mercado...</p>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item, idx) => {
              const newsImage = item.enclosure?.link || item.thumbnail || 'https://placehold.co/600x400/eeeeee/999999?text=Not%C3%ADcia';
              return (
              <a 
                key={idx} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-surface-container-lowest industrial-border flex flex-col group rounded-sm overflow-hidden shadow-sm hover:border-secondary hover:shadow-md transition-all"
              >
                <div className="h-40 overflow-hidden relative border-b border-outline-variant bg-surface-container">
                  <img 
                    src={newsImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-on-surface-variant mb-3 font-mono text-xs uppercase tracking-wider">
                    <Calendar size={14} /> {new Date(item.pubDate).toLocaleDateString('pt-BR')}
                  </div>
                  <h3 className="font-sans font-bold text-lg text-primary mb-4 group-hover:text-secondary line-clamp-3">
                    {item.title}
                  </h3>
                  <div className="font-mono text-xs text-on-surface-variant flex items-center justify-between mt-auto pt-4 border-t border-outline-variant">
                    <span>ArchDaily Brasil</span>
                    <span className="flex items-center gap-1 text-secondary uppercase font-bold tracking-widest"><ExternalLink size={12} /> LER MAIS</span>
                  </div>
                </div>
              </a>
              );
            })}
          </div>
        ) : (
           <p className="font-sans text-on-surface-variant text-sm">Nenhuma notícia encontrada no momento.</p>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-sans text-2xl font-bold uppercase tracking-tight text-on-surface">Artigos da Distribuidora</h2>
      </div>

      {loading ? (
         <p className="font-mono text-primary animate-pulse">Carregando artigos...</p>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => {
            const coverUrl = article.cover ? `${STRAPI_URL}${article.cover.url}` : 'https://placehold.co/600x400/eeeeee/999999?text=Sem+Imagem';
            const dateStr = article.publishedDate ? new Date(article.publishedDate).toLocaleDateString('pt-BR') : 'Data não informada';
            
            return (
              <div 
                key={article.documentId || article.id} 
                onClick={() => setCurrentPage(`blog/${article.slug}`)}
                className="bg-surface-container-lowest industrial-border flex flex-col group rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative border-b border-outline-variant">
                  <img 
                    src={coverUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-on-surface-variant mb-3 font-mono text-xs uppercase tracking-wider">
                    <Calendar size={14} /> {dateStr}
                  </div>
                  <h3 className="font-sans text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="font-sans text-on-surface-variant text-sm line-clamp-3 mb-6 flex-grow">
                    {article.content}
                  </p>
                  <div className="font-mono text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2 mt-auto">
                    Ler artigo completo <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-12 bg-surface-container industrial-border rounded-sm">
          <p className="font-sans text-on-surface-variant">Nenhum artigo publicado no momento.</p>
        </div>
      )}
    </div>
  );
}
