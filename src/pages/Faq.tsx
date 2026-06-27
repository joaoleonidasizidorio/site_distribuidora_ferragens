import { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const STRAPI_URL = "http://localhost:1337";

export default function Faq() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${STRAPI_URL}/api/faqs`)
      .then(res => res.json())
      .then(json => {
        if (json && json.data) setFaqs(json.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-surface-container-lowest min-h-[60vh] py-16 md:py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <HelpCircle className="text-primary mx-auto mb-4" size={48} />
          <h1 className="font-sans text-3xl md:text-5xl font-bold text-primary tracking-tight uppercase mb-4">
            Perguntas Frequentes
          </h1>
          <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto">
            Encontre respostas rápidas para as dúvidas mais comuns sobre nossos produtos, entregas e faturamento B2B.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-16 bg-surface-container rounded-sm border border-outline-variant w-full"></div>
            ))}
          </div>
        ) : faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq.documentId || faq.id} className="industrial-border bg-surface-container-low rounded-sm overflow-hidden">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container transition-colors"
                >
                  <span className="font-sans font-bold text-lg text-primary pr-8">{faq.question}</span>
                  {openIndex === idx ? <ChevronUp className="text-primary flex-shrink-0" /> : <ChevronDown className="text-on-surface-variant flex-shrink-0" />}
                </button>
                {openIndex === idx && (
                  <div className="p-6 pt-0 border-t border-outline-variant/30 mt-2">
                    <p className="font-sans text-on-surface-variant leading-relaxed whitespace-pre-wrap mt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-surface-container industrial-border rounded-sm">
            <p className="font-sans text-on-surface-variant">Nenhuma pergunta frequente cadastrada no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
