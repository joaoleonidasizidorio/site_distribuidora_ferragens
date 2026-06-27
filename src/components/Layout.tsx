import { useState } from 'react';
import { Search, Package, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  setGlobalSearch: (search: string) => void;
}

export default function Layout({ children, currentPage, setCurrentPage, setGlobalSearch }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'team', label: 'Equipe' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contato' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-sans">
      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-16 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            className="font-sans text-xl font-bold uppercase tracking-tighter text-primary cursor-pointer flex-shrink-0"
            onClick={() => setCurrentPage('home')}
          >
            Distribuidora de Ferragens
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 items-center">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`font-sans font-semibold uppercase tracking-wider text-xs transition-colors relative py-1.5
                  ${currentPage === item.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <form 
              className="hidden md:flex items-center bg-surface-container-low rounded-sm border border-outline-variant focus-within:border-primary transition-colors overflow-hidden h-9"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('search') as HTMLInputElement;
                if (input.value.trim()) {
                  setGlobalSearch(input.value.trim());
                  setCurrentPage('catalog');
                  input.value = '';
                }
              }}
            >
              <input 
                name="search"
                type="text" 
                placeholder="Buscar..." 
                className="bg-transparent px-3 py-1 text-xs font-sans outline-none w-28 focus:w-44 transition-all text-on-surface placeholder:text-on-surface-variant/50"
              />
              <button type="submit" className="text-primary px-2 hover:bg-surface-container-highest transition-colors h-full flex items-center justify-center">
                <Search size={14} />
              </button>
            </form>
            <button className="bg-primary text-on-primary px-5 py-2 font-sans font-bold uppercase tracking-wider text-xs hover:opacity-90 active:scale-95 transition-all rounded-sm hidden sm:block">
              Solicitar Orçamento
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-primary p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Corporate Footer */}
      <footer className="w-full mt-auto bg-primary border-t border-primary pt-12 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="font-sans text-xl md:text-2xl font-bold text-on-primary uppercase mb-2 tracking-tight">
              Distribuidora de Ferragens
            </div>
            <p className="text-on-primary/80 font-sans text-sm max-w-sm text-center md:text-left leading-relaxed">
              Excelência em materiais para construção e indústria desde 1994. Precisão em cada peça.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <button onClick={() => setCurrentPage('terms')} className="font-mono text-xs text-on-primary/80 hover:text-on-primary uppercase tracking-wider transition-colors text-left">Termos de Uso</button>
            <button onClick={() => setCurrentPage('privacy')} className="font-mono text-xs text-on-primary/80 hover:text-on-primary uppercase tracking-wider transition-colors text-left">Política de Privacidade</button>
            <button onClick={() => setCurrentPage('careers')} className="font-mono text-xs text-on-primary/80 hover:text-on-primary uppercase tracking-wider transition-colors text-left">Trabalhe Conosco</button>
            <button onClick={() => setCurrentPage('faq')} className="font-mono text-xs text-on-primary/80 hover:text-on-primary uppercase tracking-wider transition-colors text-left">FAQ</button>
          </div>
        </div>
        <div className="mt-12 text-center border-t border-on-primary/10 pt-6">
          <p className="text-on-primary/50 font-mono text-xs uppercase tracking-widest">
            © 2024 Distribuidora de Ferragens. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
