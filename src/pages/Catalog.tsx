import { PenTool, Briefcase, Factory, Archive, Headset, Table2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const STRAPI_URL = "http://localhost:1337";

interface CatalogProps {
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
}

export default function Catalog({ globalSearch, setGlobalSearch }: CatalogProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(globalSearch || '');
  const [catalogData, setCatalogData] = useState<any>(null);
  const [materialSpecs, setMaterialSpecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (globalSearch !== undefined) {
      setSearchTerm(globalSearch);
    }
  }, [globalSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/products?populate=*`);
        const data = await res.json();
        if (data && data.data) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Erro ao buscar produtos do Strapi:", err);
      }
    };

    const fetchCatalogData = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/catalogpage`);
        const data = await res.json();
        if (data && data.data) {
          setCatalogData(data.data);
        }
      } catch (err) {
        console.error("Erro ao buscar dados da página:", err);
      }
    };

    const fetchMaterialSpecs = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/materialspecs`);
        const data = await res.json();
        if (data && data.data) {
          setMaterialSpecs(data.data);
        }
      } catch (err) {
        console.error("Erro ao buscar especificações:", err);
      }
    };

    Promise.all([fetchProducts(), fetchCatalogData(), fetchMaterialSpecs()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const countFerramentas = products.filter(p => p.category === 'Ferramentas').length;
  const countFerragens = products.filter(p => p.category === 'Ferragens').length;
  const countEstruturas = products.filter(p => p.category === 'Estruturas').length;
  const countSuprimentos = products.filter(p => p.category === 'Suprimentos').length;

  const filteredProducts = products.filter(p => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (p.name && p.name.toLowerCase().includes(lowerSearch)) || 
           (p.description && p.description.toLowerCase().includes(lowerSearch)) ||
           (p.sku && p.sku.toLowerCase().includes(lowerSearch)) ||
           (p.category && p.category.toLowerCase().includes(lowerSearch));
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-6 md:px-16 py-12 lg:py-20">
      
      {/* Title Section */}
      <div className="mb-12">
        <h1 className="font-sans text-4xl md:text-5xl font-bold text-primary uppercase mb-4 tracking-tight">
          {catalogData?.pageTitle || "Catálogo de Materiais"}
        </h1>
        <div className="h-1.5 w-24 bg-primary mb-6"></div>
        <p className="font-sans text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          {catalogData?.pageDescription || "Explore nossa linha completa de ferragens industriais, ferramentas profissionais e estruturas metálicas de alta resistência."}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
          <div>
            <h3 className="font-mono text-sm font-bold text-primary uppercase mb-5 border-b-2 border-outline-variant pb-3">Categorias</h3>
            <ul className="space-y-4 font-sans text-on-surface-variant font-medium">
              <li>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-5 h-5 accent-primary border-outline cursor-pointer" type="checkbox" />
                  <span className="text-secondary font-bold group-hover:text-secondary transition-colors">Todas as Ferragens</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-5 h-5 accent-primary border-outline cursor-pointer" type="checkbox" />
                  <span className="group-hover:text-primary transition-colors">Ferramentas</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-5 h-5 accent-primary border-outline cursor-pointer" type="checkbox" />
                  <span className="group-hover:text-primary transition-colors">Estruturas Metálicas</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-5 h-5 accent-primary border-outline cursor-pointer" type="checkbox" />
                  <span className="group-hover:text-primary transition-colors">Suprimentos</span>
                </label>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-mono text-sm font-bold text-primary uppercase mb-5 border-b-2 border-outline-variant pb-3">Especificação Técnica</h3>
            <div className="space-y-6">
              <div>
                <span className="block font-mono text-xs font-bold mb-3 tracking-wider text-on-surface-variant uppercase">Material</span>
                <select className="w-full bg-surface-container-lowest border border-outline-variant p-3 font-sans text-sm focus:border-primary outline-none rounded-sm">
                  <option>Aço Inoxidável</option>
                  <option>Aço Carbono</option>
                  <option>Alumínio Industrial</option>
                  <option>Galvanizado</option>
                </select>
              </div>
              <div>
                <span className="block font-mono text-xs font-bold mb-3 tracking-wider text-on-surface-variant uppercase">Resistência (PSI)</span>
                <input className="w-full accent-primary" type="range" defaultValue={50} />
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-surface-container-low border border-outline border-l-4 border-l-secondary rounded-r-sm">
            <Headset className="text-secondary mb-3" size={24} />
            <p className="font-mono text-xs font-bold uppercase text-on-surface-variant tracking-wider">
              {catalogData?.supportTitle || "Suporte Técnico"}
            </p>
            <p className="font-sans text-sm mt-2 font-medium">
              {catalogData?.supportText || "Precisa de dimensões personalizadas?"}
            </p>
            <a href="#" className="text-secondary font-bold text-sm block mt-3 hover:underline">Fale com um Engenheiro →</a>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-grow">
          
          {/* Top Category Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-primary p-6 text-on-primary group cursor-pointer hover:bg-secondary transition-colors relative overflow-hidden rounded-sm shadow-sm">
              <div className="relative z-10">
                <PenTool className="mb-4" size={32} strokeWidth={1.5} />
                <h4 className="font-sans font-bold text-lg uppercase tracking-wide">Ferramentas</h4>
                <p className="text-xs font-mono opacity-80 mt-2">{countFerramentas} Itens</p>
              </div>
            </div>
            <div className="bg-surface-container p-6 text-primary group cursor-pointer hover:border-secondary border border-transparent transition-all rounded-sm shadow-sm">
              <Briefcase className="mb-4 opacity-80" size={32} strokeWidth={1.5} />
              <h4 className="font-sans font-bold text-lg uppercase tracking-wide">Ferragens</h4>
              <p className="text-xs font-mono text-on-surface-variant mt-2">{countFerragens} Itens</p>
            </div>
            <div className="bg-surface-container p-6 text-primary group cursor-pointer hover:border-secondary border border-transparent transition-all rounded-sm shadow-sm">
              <Factory className="mb-4 opacity-80" size={32} strokeWidth={1.5} />
              <h4 className="font-sans font-bold text-lg uppercase tracking-wide">Estruturas</h4>
              <p className="text-xs font-mono text-on-surface-variant mt-2">{countEstruturas} Itens</p>
            </div>
            <div className="bg-surface-container p-6 text-primary group cursor-pointer hover:border-secondary border border-transparent transition-all rounded-sm shadow-sm">
              <Archive className="mb-4 opacity-80" size={32} strokeWidth={1.5} />
              <h4 className="font-sans font-bold text-lg uppercase tracking-wide">Suprimentos</h4>
              <p className="text-xs font-mono text-on-surface-variant mt-2">{countSuprimentos} Itens</p>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="mb-6">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setGlobalSearch(e.target.value);
              }}
              placeholder="Buscar produtos por nome, categoria ou SKU..."
              className="w-full bg-surface-container-lowest border border-outline-variant p-4 font-sans text-lg focus:border-primary outline-none rounded-sm"
            />
          </div>

          {/* Actual Product Listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <p className="col-span-full font-mono text-primary animate-pulse">Carregando itens do catálogo...</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const coverUrl = product.cover ? `${STRAPI_URL}${product.cover.url}` : 'https://placehold.co/600x400/eeeeee/999999?text=Sem+Imagem';
                return (
                  <div key={product.documentId || product.id} className="bg-surface-container-lowest industrial-border flex flex-col group rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-56 bg-surface-container-low overflow-hidden relative border-b border-outline-variant">
                      <img 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100 mix-blend-multiply" 
                        src={coverUrl} 
                        alt={product.name} 
                      />
                      <div className="absolute top-3 left-3 bg-secondary text-white font-mono text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-sm shadow-sm">{product.category || "Geral"}</div>
                    </div>
                    <div className="p-5 flex-grow">
                      <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest">SKU: {product.sku || product.id}</span>
                      <h5 className="font-sans text-lg font-bold uppercase text-primary mt-2">{product.name}</h5>
                      {product.material && (
                        <span className="inline-block mt-2 font-mono text-[10px] text-primary border border-primary px-2 py-0.5 rounded-sm">Material: {product.material}</span>
                      )}
                      <p className="text-sm text-on-surface-variant mt-3 line-clamp-2">
                        {product.description || "Nenhuma descrição disponível."}
                      </p>
                    </div>
                    <button className="w-full bg-primary text-on-primary py-4 font-sans font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-colors">
                      Adicionar à Cotação
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-surface-container p-6 border border-outline border-dashed rounded-sm text-center">
                <p className="font-sans text-on-surface-variant font-medium">Nenhum produto cadastrado no momento.</p>
                <p className="font-mono text-xs mt-2 opacity-70">Acesse o painel do Strapi, adicione novos Produtos e lembre-se de clicar em "Publish"!</p>
              </div>
            )}
          </div>

          {/* Technical Specs Comparison Table */}
          <div className="mt-20">
            <h3 className="font-sans text-2xl font-bold text-primary uppercase mb-6 flex items-center gap-3">
              <Table2 size={28} />
              {catalogData?.tableTitle || "Tabela Comparativa de Resistência"}
            </h3>
            <div className="overflow-x-auto industrial-border-thick rounded-sm shadow-sm bg-surface-container-lowest">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-primary text-on-primary font-mono text-xs tracking-wider uppercase border-b border-primary">
                    <th className="p-5 font-semibold">Material</th>
                    <th className="p-5 font-semibold">Densidade <span className="lowercase">(kg/m³)</span></th>
                    <th className="p-5 font-semibold">Resistência Tração</th>
                    <th className="p-5 font-semibold">Dureza (Rockwell)</th>
                    <th className="p-5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="font-sans text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-5 text-center text-on-surface-variant font-mono animate-pulse">Carregando especificações...</td>
                    </tr>
                  ) : materialSpecs.length > 0 ? (
                    materialSpecs.map((spec, i) => (
                      <tr key={spec.documentId || spec.id || i} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? 'bg-surface-container-low/30' : ''}`}>
                        <td className="p-5 font-bold text-primary">{spec.materialName}</td>
                        <td className="p-5 font-mono">{spec.density}</td>
                        <td className="p-5 font-mono text-on-surface-variant">{spec.resistance}</td>
                        <td className="p-5 font-mono text-on-surface-variant">{spec.hardness}</td>
                        <td className="p-5">
                          <span className={`${
                            spec.status === 'Premium' ? 'bg-primary text-on-primary' : 
                            spec.status === 'Sob Encomenda' ? 'bg-surface-container-high text-primary border border-outline' :
                            'bg-secondary/10 text-secondary border border-secondary/20'
                          } text-[10px] px-2.5 py-1 font-bold uppercase tracking-widest rounded-sm`}>
                            {spec.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-5 text-center text-on-surface-variant">Nenhuma especificação cadastrada no painel.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
