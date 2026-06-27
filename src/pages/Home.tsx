import { Package, ShieldCheck, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const STRAPI_URL = "http://localhost:1337";

export default function Home({ setCurrentPage }: { setCurrentPage: (p: string) => void }) {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [homeData, setHomeData] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [marqueeDirection, setMarqueeDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/products?filters[isHighlight][$eq]=true`);
        const data = await res.json();
        if (data && data.data) {
          setHighlights(data.data);
        }
      } catch (err) {
        console.error("Erro ao buscar destaques do Strapi:", err);
      }
    };
    
    const fetchHomepage = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/homepage?populate=*`);
        const data = await res.json();
        if (data && data.data) {
          setHomeData(data.data);
        }
      } catch (err) {
        console.error("Erro ao buscar homepage do Strapi:", err);
      }
    };

    const fetchPartners = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/partners?populate=*`);
        const data = await res.json();
        if (data && data.data && data.data.length > 0) {
          setPartners(data.data);
        } else {
          // Padrão de carrossel se estiver vazio no banco
          setPartners([
            { id: 'fake-1', documentId: 'p1', name: 'Gerdau' },
            { id: 'fake-2', documentId: 'p2', name: 'Votorantim' },
            { id: 'fake-3', documentId: 'p3', name: 'ArcelorMittal' },
            { id: 'fake-4', documentId: 'p4', name: 'Tigre' },
            { id: 'fake-5', documentId: 'p5', name: 'Amanco' },
            { id: 'fake-6', documentId: 'p6', name: 'Bosch' }
          ]);
        }
      } catch (err) {
        console.error("Erro ao buscar parceiros:", err);
      }
    };

    Promise.all([fetchHighlights(), fetchHomepage(), fetchPartners()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const bgImageUrl = homeData?.heroImage?.url 
    ? `${STRAPI_URL}${homeData.heroImage.url}` 
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuBJCMJIH2Gig3rM-YqzbEUTkOeoKikx1WH65gHeRtu6-aYCT538juwP_uSx90_lhEB5Ajn4ioXazBafBjNmK6vDQwfzJYayqthvHqoKBCC8B1X0eyy4Fwpj5txtBwleewjci_ERmnJ6PYh8StFbpVbU4eisbHD3fgOWBSCRhPzXGDQ-IsLnxqfTdw4yaraF20aIKpmPXz-g77KgB8qf4BVeG3rLdySKWxcNyRMoJqiZ0Zmsq0HCupeERKlR3peskzUiIl-X1KeX0dI";

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-60 transition-all duration-700" 
            style={{ backgroundImage: `url('${bgImageUrl}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 w-full">
          <div className="max-w-2xl">
            <span className="inline-block text-primary px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest mb-6 bg-on-primary rounded-sm shadow-sm">
              {homeData?.heroSubtitle || "Estrutura e Confiança"}
            </span>
            <h1 className="font-sans text-5xl md:text-6xl font-bold tracking-tight text-on-primary mb-6 leading-tight">
              {homeData?.heroTitle || "A BASE SÓLIDA PARA O SEU PROJETO"}
            </h1>
            <p className="font-sans text-lg text-on-primary/90 mb-10 max-w-lg leading-relaxed">
              {homeData?.heroDescription || "Distribuição especializada de ferragens, ferramentas e insumos industriais. Qualidade técnica para quem constrói o futuro com precisão."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setCurrentPage('catalog')}
                className="bg-primary-container text-on-primary bg-opacity-90 px-8 py-4 font-sans font-bold uppercase tracking-widest text-sm hover:brightness-110 border border-primary-container transition-all rounded-sm"
              >
                Explorar Catálogo
              </button>
              <button className="border-2 border-on-primary text-on-primary px-8 py-4 font-sans font-bold uppercase tracking-widest text-sm hover:bg-on-primary hover:text-primary transition-all rounded-sm">
                Nossas Unidades
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee / Grid */}
      {partners.length > 0 && (
        <section className="bg-surface-container-lowest py-10 border-b border-outline-variant overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-16 mb-8 flex items-center justify-center gap-4">
            <button 
              onClick={() => setMarqueeDirection('left')} 
              className={`p-1.5 rounded-full transition-colors ${marqueeDirection === 'left' ? 'bg-primary text-on-primary' : 'bg-surface-container text-outline hover:bg-surface-container-high'}`}
              title="Girar para esquerda"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="font-mono text-xs font-bold uppercase text-on-surface-variant tracking-widest text-center">
              Confiança de grandes marcas e construtoras
            </h3>
            <button 
              onClick={() => setMarqueeDirection('right')} 
              className={`p-1.5 rounded-full transition-colors ${marqueeDirection === 'right' ? 'bg-primary text-on-primary' : 'bg-surface-container text-outline hover:bg-surface-container-high'}`}
              title="Girar para direita"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="relative w-full max-w-full group">
            {/* Gradient Masks */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-surface-container-lowest to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-surface-container-lowest to-transparent z-10 pointer-events-none"></div>

            <div className={`flex w-max ${marqueeDirection === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'} hover:[animation-play-state:paused]`}>
              {/* Duplicamos a lista de parceiros para fazer o loop infinito sem quebras */}
              {[...partners, ...partners].map((partner, index) => (
                <div key={`${partner.documentId || partner.id}-${index}`} className="w-40 md:w-56 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 mx-6 cursor-pointer flex-shrink-0">
                  {partner.logo ? (
                    <img src={`${STRAPI_URL}${partner.logo.url}`} alt={partner.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="font-sans font-bold text-lg text-on-surface-variant">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 border-b-2 border-outline-variant pb-6 gap-4">
          <div>
            <h2 className="font-sans text-3xl font-bold text-primary uppercase tracking-tight mb-2">
              {homeData?.categoriesTitle || "Categorias Especializadas"}
            </h2>
            <p className="font-sans text-on-surface-variant text-lg">
              {homeData?.categoriesDescription || "Produtos selecionados pela robustez e desempenho técnico."}
            </p>
          </div>
          <button 
            onClick={() => setCurrentPage('catalog')}
            className="font-mono text-xs font-bold text-primary uppercase tracking-widest hover:text-secondary transition-colors"
          >
            Ver Todas as Categorias
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          {/* Tools */}
          <div 
            onClick={() => setCurrentPage('catalog')}
            className="md:col-span-8 industrial-border group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaT9bvsyoZm_nmpNXeiA_1ayZn-6vzFw8AZVRRML0Bf8hz49ns-xw4N9Mt3Zi1KWf4PHzWJi8uwNlsnXiSxhXlgFK1V0NgtiJNOrsjOdip0PegDha7e8q3cIYQd8bEi5F0T0Xhse-w1EnTKi_jU9R6JJZaOH8F54KUAhx6ikQDj3ryuMSIvCRSCVJz6SdUeI4S5GcTyS9g2zryrRLIEjhPEKGgajIZKZgEYHYY3tDPnUIHD8cpQrKNKAlMEqLGupreuKcUgj0rjnc')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
            <div className="absolute bottom-0 p-8">
              <h3 className="font-sans text-2xl font-bold text-on-primary uppercase mb-2">Ferramentas Profissionais</h3>
              <p className="text-on-primary/80 max-w-md font-sans">Equipamentos de alto torque e precisão para regime de trabalho intenso.</p>
            </div>
          </div>
          {/* Hardware */}
          <div 
            onClick={() => setCurrentPage('catalog')}
            className="md:col-span-4 industrial-border group relative overflow-hidden cursor-pointer min-h-[250px]"
          >
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAcOVTb9saDdgtQpGyhQ6ZHTOBx8ITFxCoiuaFNFBGRLcJiZmcwvJGNAOsnicZuzpS2Nv4w5DxSUpzHnwmFO8c6louZV68psFkUSPE8Zhj43NrzIS3tTkajTgPMQjzT0IDb14-oisxIqTmNaf81SxKDVU18JS1MP7zKmd8Yj2SurhJjG5m-KwHicUTUgR9UDl61KKOHOd8MbYyxMCYj0aW1H9l0i-0mag6yNYuqtOxhyMtbvOlFy2YakjJBARt6WqMlrpzCD2pafy4')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
            <div className="absolute bottom-0 p-8">
              <h3 className="font-sans text-2xl font-bold text-on-primary uppercase mb-2">Ferragens em Geral</h3>
              <p className="text-on-primary/80 font-sans">Fixação e estruturação com certificação de carga.</p>
            </div>
          </div>
          {/* Electrical */}
          <div 
            onClick={() => setCurrentPage('catalog')}
            className="md:col-span-5 industrial-border group relative overflow-hidden cursor-pointer min-h-[250px]"
          >
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoDNvFSK6St7QUjctYPSt0Jd8NB9eXZT-lNJO92FeKs2tq73vthCg1h3R_sP0AuJ7uzc_8vvZdlHmFdLSYEUQKuMosR1ClQI46B0IYTuPeezvFQpSQcPb7jbx6KBiwYsdup_ECmfa5LlQSYSdYqJmvDHEj450Uhr_lEn_Vh1-URW3QV1vJjQUeok8-dnze0EE8wTv4FWonjn-bMGbPYweHhEpyXg6YE-JbU95vAgQlxtforW4En11Bug4UPWnn4r_Nfo00Fs9mOqw')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
            <div className="absolute bottom-0 p-8">
              <h3 className="font-sans text-2xl font-bold text-on-primary uppercase mb-2">Materiais Elétricos</h3>
              <p className="text-on-primary/80 font-sans max-w-[200px]">Soluções completas para infraestrutura de alta tensão.</p>
            </div>
          </div>
          {/* Plumbing */}
          <div 
            onClick={() => setCurrentPage('catalog')}
            className="md:col-span-7 industrial-border group relative overflow-hidden cursor-pointer min-h-[250px]"
          >
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA6j6LqEYszb6MAzTVEkfRSNrH1MD1TrxQ2GzvkgVAN8zrNjbW85PxFBSI_hbx6hYfS4rRLwAXBUPIMUu8SvNQ_Ty2hD4fZdbeSpc5nyWGh_GMqN8wUpnOy874Bqs3ES1gajfDa38QKwdkPb1D9zf62d8fPVx052xXkqhukvk3nvy5w0ZnLYtnpWUnUrwjLKRfWfn5DFn_vZlCw1AGvkhDoDWWdFGIDXrNOcKHQl14f-kz0YmcRYLuWm5-HgUmq3NNA-tD0eQyhNmE')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
            <div className="absolute bottom-0 p-8">
              <h3 className="font-sans text-2xl font-bold text-on-primary uppercase mb-2">Hidráulica Industrial</h3>
              <p className="text-on-primary/80 font-sans max-w-sm">Tubulações, conexões e válvulas para projetos de qualquer escala.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Data / Value Props */}
      <section className="bg-surface-container-low py-24 border-y border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-5">
            <div className="bg-primary text-on-primary w-14 h-14 flex items-center justify-center rounded-sm">
              <Package size={28} />
            </div>
            <h4 className="font-sans text-xl font-bold uppercase text-primary tracking-tight">
              {homeData?.benefit1Title || "Estoque Pronta Entrega"}
            </h4>
            <p className="font-sans text-on-surface-variant leading-relaxed">
              {homeData?.benefit1Description || "Mantemos mais de 15.000 itens em estoque permanente para garantir que sua obra nunca pare por falta de material."}
            </p>
          </div>
          <div className="space-y-5">
            <div className="bg-primary text-on-primary w-14 h-14 flex items-center justify-center rounded-sm">
              <ShieldCheck size={28} />
            </div>
            <h4 className="font-sans text-xl font-bold uppercase text-primary tracking-tight">
              {homeData?.benefit2Title || "Garantia de Origem"}
            </h4>
            <p className="font-sans text-on-surface-variant leading-relaxed">
              {homeData?.benefit2Description || "Trabalhamos exclusivamente com marcas líderes de mercado que oferecem suporte técnico e garantia integral no Brasil."}
            </p>
          </div>
          <div className="space-y-5">
            <div className="bg-primary text-on-primary w-14 h-14 flex items-center justify-center rounded-sm">
              <Truck size={28} />
            </div>
            <h4 className="font-sans text-xl font-bold uppercase text-primary tracking-tight">
              {homeData?.benefit3Title || "Logística Integrada"}
            </h4>
            <p className="font-sans text-on-surface-variant leading-relaxed">
              {homeData?.benefit3Description || "Frota própria e roteirização inteligente para entregas em até 24 horas na região metropolitana estendida."}
            </p>
          </div>
        </div>
      </section>

      {/* Product Table Highlights */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        <h3 className="font-sans text-2xl font-bold uppercase text-primary mb-10 border-l-4 pl-4 border-primary">
          Destaques de Carga e Fixação
        </h3>
        <div className="overflow-x-auto industrial-border rounded-sm">
          <table className="w-full zebra-table text-left border-collapse min-w-[800px]">
            <thead className="bg-primary text-on-primary font-mono text-xs tracking-wider uppercase">
              <tr>
                <th className="p-5">SKU / Código</th>
                <th className="p-5">Descrição do Produto</th>
                <th className="p-5">Material / Acabamento</th>
                <th className="p-5">Categoria</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody className="font-sans">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-5 text-center font-mono text-primary animate-pulse">Carregando destaques...</td>
                </tr>
              ) : highlights.length > 0 ? (
                highlights.map((product) => (
                  <tr key={product.documentId || product.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="p-5 font-mono text-sm">{product.sku || '-'}</td>
                    <td className="p-5 font-semibold text-primary">{product.name}</td>
                    <td className="p-5 text-on-surface-variant">{product.material || '-'}</td>
                    <td className="p-5 font-medium">{product.category || '-'}</td>
                    <td className="p-5"><span className="bg-secondary text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">Destaque</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-5 text-center bg-surface-container border border-outline border-dashed">
                    <p className="font-sans text-on-surface-variant font-medium">Nenhum produto em destaque.</p>
                    <p className="font-mono text-xs mt-2 opacity-70">Acesse o Strapi, crie Produtos e marque "isHighlight" como verdadeiro.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="bg-primary py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <h2 className="font-sans text-3xl font-bold text-on-primary uppercase mb-4 tracking-tight">
              {homeData?.contactTitle || "Precisa de uma cotação em lote?"}
            </h2>
            <p className="text-on-primary-container font-sans text-lg max-w-2xl">
              {homeData?.contactDescription || "Nossa equipe técnica está pronta para analisar seu projeto e oferecer condições especiais para faturamento PJ."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <input 
              className="bg-surface-container-low text-on-surface px-6 py-4 min-w-[320px] font-sans border border-transparent focus:border-secondary outline-none rounded-sm" 
              placeholder="Seu e-mail corporativo" 
              type="email" 
            />
            <button className="bg-secondary text-white px-8 py-4 font-sans font-bold uppercase tracking-widest text-sm hover:opacity-90 active:opacity-80 transition-all rounded-sm flex-shrink-0">
              Enviar Contato
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
