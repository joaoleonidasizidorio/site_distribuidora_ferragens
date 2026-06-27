import { useState, useEffect } from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

const STRAPI_URL = "http://localhost:1337";

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export default function LegalPage({ type }: LegalPageProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const endpoint = type === 'privacy' ? 'privacypolicy' : 'termsofuse';
    
    fetch(`${STRAPI_URL}/api/${endpoint}`)
      .then(res => res.json())
      .then(json => {
        if (json && json.data) {
          setData(json.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [type]);

  const Icon = type === 'privacy' ? ShieldCheck : FileText;
  const defaultTitle = type === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso';

  return (
    <div className="w-full bg-surface-container-lowest min-h-[60vh] py-16 md:py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10 border-b-2 border-outline-variant pb-6">
          <Icon className="text-primary" size={40} />
          <h1 className="font-sans text-3xl md:text-5xl font-bold text-primary tracking-tight">
            {data?.title || defaultTitle}
          </h1>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-outline-variant rounded w-3/4"></div>
            <div className="h-4 bg-outline-variant rounded w-full"></div>
            <div className="h-4 bg-outline-variant rounded w-5/6"></div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none text-on-surface-variant font-sans leading-relaxed space-y-6">
            {(data?.content || '').split('\n').map((paragraph: string, idx: number) => {
              if (!paragraph.trim()) return null;
              return <p key={idx} className="text-lg">{paragraph}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
