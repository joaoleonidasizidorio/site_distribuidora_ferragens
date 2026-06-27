import { ShieldCheck, Mail, Smartphone, Wrench, Handshake, Headset } from 'lucide-react';
import { useState, useEffect } from 'react';

const STRAPI_URL = "http://localhost:1337";

export default function Team({ setCurrentPage }: { setCurrentPage: (p: string) => void }) {
  const [teamData, setTeamData] = useState<any>(null);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [matrix, setMatrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/teampage?populate=*`);
        const data = await res.json();
        if (data && data.data) setTeamData(data.data);
      } catch (err) { console.error(err); }
    };
    const fetchSpecialists = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/specialists?populate=*`);
        const data = await res.json();
        if (data && data.data) setSpecialists(data.data);
      } catch (err) { console.error(err); }
    };
    const fetchMatrix = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/specialtymatrixs`);
        const data = await res.json();
        if (data && data.data) setMatrix(data.data);
      } catch (err) { console.error(err); }
    };

    Promise.all([fetchTeamData(), fetchSpecialists(), fetchMatrix()]).finally(() => setLoading(false));
  }, []);

  const bgImageUrl = teamData?.heroImage?.url 
    ? `${STRAPI_URL}${teamData.heroImage.url}` 
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuD5ZRZCFxcWlNAFElkskcwuoNj5s3VJa3uFCxi5J0bmmsvYZjcsxwWRhJxrOsPHBoJBdBJzrnNzRIJeWeQ3RIYq9w3GiAxLVBPZ7BH5f2KBa_j9iYkZG3CszMX6JZYYifkgMf4wG7Jb6JIiReEgvT_lUIXjwN80Hj295TPs41cQq7w8q6QJsnyHtHBVNA55nIthE9WX1FAdXgOq8Ztjfo5cFb-bW73M5DVbvRFGJtI_QYwBLkq7LxWP6kw7ibNs45AuxNEdKGtgUHI";

  const mainSpecialist = specialists.find(s => s.isMain) || specialists[0];
  const otherSpecialists = specialists.filter(s => s !== mainSpecialist);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary-container border-b-4 border-secondary text-on-primary-container relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 lg:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-secondary mb-4 block tracking-widest">
              {teamData?.heroSubtitle || "Consultoria Técnica Especializada"}
            </span>
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-on-primary mb-6 tracking-tight leading-tight">
              {teamData?.heroTitle || "PRECISÃO QUE CONSTRÓI CONFIANÇA."}
            </h1>
            <p className="font-sans text-lg text-primary-fixed max-w-lg leading-relaxed">
              {teamData?.heroDescription || "Nossa equipe não apenas vende ferramentas; nós entregamos soluções de engenharia e suporte técnico para grandes obras e reformas residenciais. Conheça os especialistas prontos para otimizar seu projeto."}
            </p>
          </div>
          <div className="relative hidden md:block h-72 w-full industrial-border-thick border-primary shadow-xl rounded-sm overflow-hidden bg-surface-container">
            <img 
              className="w-full h-full object-cover mix-blend-luminosity opacity-80" 
              src={bgImageUrl} 
              alt="Industrial Setup" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Team Bento Grid */}
      <section className="py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-2 border-outline-variant pb-6 gap-4">
          <div>
            <h2 className="font-sans text-3xl font-bold text-primary uppercase tracking-tight mb-2">
              {teamData?.specialistsTitle || "Nossos Especialistas"}
            </h2>
            <p className="font-sans text-on-surface-variant text-lg">
              {teamData?.specialistsSubtitle || "Atendimento técnico direto para ferragens, estruturas e acabamentos."}
            </p>
          </div>
          <div className="font-mono text-xs font-bold text-primary uppercase flex items-center gap-2 tracking-widest bg-surface-container px-4 py-2 rounded-sm border border-outline">
            <ShieldCheck size={18} className="text-secondary" />
            Certificação Garantida
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {loading ? (
            <div className="md:col-span-12 p-10 text-center font-mono text-on-surface-variant animate-pulse">Carregando especialistas...</div>
          ) : (
            <>
              {/* Main Specialist */}
              {mainSpecialist && (
                <div className="md:col-span-8 industrial-border bg-surface-container-lowest group overflow-hidden rounded-sm flex flex-col md:flex-row shadow-sm">
                  <div className="w-full md:w-1/2 overflow-hidden h-64 md:h-auto border-b md:border-b-0 md:border-r border-outline-variant">
                    <img 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 object-[center_top]" 
                      src={mainSpecialist.photo?.url ? `${STRAPI_URL}${mainSpecialist.photo.url}` : "https://lh3.googleusercontent.com/aida-public/AB6AXuB4jRio_4rvTEQoX_h36W48yc2xXlW07FzIbeUuSdv4Na8fpoJsIu2Hx32F4dydNVhh653EecYtR625Fh-DNbHLq20AWW-bdaLjOepWOwwvnsQtBPbK2uL83xNhiOfcOtR6VOFv_VYSDCscJ7XoF6agTb_o8bVwHY23amC2dzIrWc5pvuMMEt2m3kmNd-pACDNpBhtjGPt4Hfky0HXHlhM5SJbNLQMm1roNrm2M8KBiG29D8IEswdYguL4bio557HNvpVrmy2tyRjI"} 
                      alt={mainSpecialist.name} 
                    />
                  </div>
                  <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-surface w-full">
                    <div className="bg-primary text-on-primary inline-block px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest uppercase mb-5 w-fit rounded-sm shadow-sm">
                      {mainSpecialist.role}
                    </div>
                    <h3 className="font-sans text-2xl font-bold text-primary mb-3">{mainSpecialist.name}</h3>
                    <p className="font-sans text-on-surface-variant mb-8 leading-relaxed">
                      {mainSpecialist.description}
                    </p>
                    <div className="space-y-3 pt-5 border-t border-outline-variant border-dashed">
                      {mainSpecialist.email && (
                        <div className="flex items-center gap-3 text-primary font-mono text-xs font-semibold">
                          <Mail size={16} /> {mainSpecialist.email}
                        </div>
                      )}
                      {mainSpecialist.phone && (
                        <div className="flex items-center gap-3 text-primary font-mono text-xs font-semibold">
                          <Smartphone size={16} /> {mainSpecialist.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Other Specialists */}
              {otherSpecialists.map((specialist, idx) => (
                <div key={specialist.documentId || specialist.id || idx} className="md:col-span-4 industrial-border bg-surface-container-lowest flex flex-col group rounded-sm overflow-hidden shadow-sm mt-0 md:-mt-6 lg:mt-0">
                  <div className="h-56 overflow-hidden relative border-b border-outline-variant bg-surface-container">
                    <img 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 object-[center_top]" 
                      src={specialist.photo?.url ? `${STRAPI_URL}${specialist.photo.url}` : "https://lh3.googleusercontent.com/aida-public/AB6AXuC1DaQuoJPjj-3sM7SeG8u44GsVCWUALRQvNG_6PGAtZ8DsF3CxHWgBI8IWYN-B1F-CdLdF1QAbOq4pO-CXe-d65g90uAbPtgIrczJenmZyCDgImC6cfrYkCjpNzJ2z7CGEX536h0gQtc0HVQ4-NxmZjDjx_WtChWCE5LXmBXQCHsdrSGh3CCU9NDgvjMBRSOWwdD6wIJJiEBoHam7JzVwoi3sR4fVoXlgWaeoPc4DXEchC4n7OhQ5cinRzk-eZhUp1WcKQ67r2wsk"} 
                      alt={specialist.name} 
                    />
                    <div className="absolute top-4 left-4 bg-secondary text-white px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest uppercase rounded-sm shadow-sm">
                      {specialist.role}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-sans text-xl font-bold text-primary mb-2">{specialist.name}</h3>
                    <p className="font-sans text-sm text-on-surface-variant flex-grow mb-6 leading-relaxed">
                      {specialist.description}
                    </p>
                    <button className="w-full industrial-border-thick py-3 font-sans font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors rounded-sm text-primary">
                      Solicitar Reunião
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Table / Matrix */}
          <div className="md:col-span-8 industrial-border bg-surface-container overflow-hidden rounded-sm shadow-sm flex flex-col">
            <div className="p-6 bg-primary text-on-primary flex justify-between items-center border-b border-primary">
              <h3 className="font-sans text-xl font-bold uppercase tracking-tight">Matriz de Especialidades</h3>
              <Wrench size={24} />
            </div>
            <div className="overflow-x-auto bg-surface-container-lowest flex-grow">
              <table className="w-full zebra-table text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low font-mono text-primary text-[10px] tracking-widest uppercase border-b border-outline-variant">
                    <th className="p-5">Segmento</th>
                    <th className="p-5">Responsável Técnico</th>
                    <th className="p-5">Prazo de Resposta</th>
                    <th className="p-5">Status</th>
                  </tr>
                </thead>
                <tbody className="font-sans text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-5 text-center text-on-surface-variant animate-pulse font-mono">Carregando matriz...</td>
                    </tr>
                  ) : matrix.length > 0 ? (
                    matrix.map((row, i) => (
                      <tr key={row.documentId || row.id || i} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                        <td className="p-5 font-bold text-primary uppercase">{row.segment}</td>
                        <td className="p-5">{row.responsible}</td>
                        <td className="p-5 font-mono">{row.responseTime}</td>
                        <td className="p-5">
                          <span className={`${
                            row.status === 'Disponível' ? 'bg-secondary text-white' : 'bg-outline text-white'
                          } px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-5 text-center text-on-surface-variant">Nenhuma especialidade cadastrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-surface-container-lowest border-y border-outline-variant py-20 bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-surface-container rounded-full p-4 mb-2">
              <Handshake className="text-secondary" size={40} />
            </div>
            <h4 className="font-sans text-xl font-bold uppercase text-primary tracking-tight">Compromisso Ético</h4>
            <p className="font-sans text-on-surface-variant max-w-sm">Trabalhamos com transparência total em especificações técnicas e normas de segurança vigentes.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-surface-container rounded-full p-4 mb-2">
              <ShieldCheck className="text-secondary" size={40} />
            </div>
            <h4 className="font-sans text-xl font-bold uppercase text-primary tracking-tight">Garantia de Origem</h4>
            <p className="font-sans text-on-surface-variant max-w-sm">Apenas fornecedores homologados e produtos com certificação de qualidade industrial.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-surface-container rounded-full p-4 mb-2">
              <Headset className="text-secondary" size={40} />
            </div>
            <h4 className="font-sans text-xl font-bold uppercase text-primary tracking-tight">Pós-Venda Ativo</h4>
            <p className="font-sans text-on-surface-variant max-w-sm">Nossa equipe acompanha a instalação e performance dos materiais diretamente no canteiro de obras.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 md:px-16 max-w-5xl mx-auto text-center">
        <div className="industrial-border-thick border-primary p-10 md:p-16 bg-surface-container shadow-sm rounded-sm">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-primary uppercase mb-6 tracking-tight">
            {teamData?.ctaTitle || "Fale com um Especialista"}
          </h2>
          <p className="font-sans text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto leading-relaxed">
            {teamData?.ctaDescription || "Seja para uma cotação rápida ou uma análise técnica detalhada do seu projeto, nossa equipe está pronta para atender com a precisão que seu negócio exige."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('contact')}
              className="bg-secondary text-white px-8 py-4 font-sans font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all rounded-sm shadow-md shadow-secondary/20"
            >
              Iniciar Orçamento Online
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className="industrial-border-thick text-primary px-8 py-4 font-sans font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all rounded-sm bg-surface-container-lowest"
            >
              Agendar Visita
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
