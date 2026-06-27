import { Mail, MessageCircle, Phone, MapPin, Send, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

const STRAPI_URL = "http://localhost:1337";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [contactData, setContactData] = useState<any>(null);
  const [hours, setHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/contactpage?populate=*`);
        const data = await res.json();
        if (data && data.data) setContactData(data.data);
      } catch (err) { console.error(err); }
    };
    const fetchHours = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/operationalhours`);
        const data = await res.json();
        if (data && data.data) setHours(data.data);
      } catch (err) { console.error(err); }
    };

    Promise.all([fetchContactData(), fetchHours()]).finally(() => setLoading(false));
  }, []);

  const mapUrl = contactData?.mapImage?.url 
    ? `${STRAPI_URL}${contactData.mapImage.url}` 
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuAXHRoIVtsGMRSnX4HJzPTjQ_peyBUQ0D5OW0sKZlfuIjSg9XE_Uu9mgDLZ60dH8oqcXpFBB1iaCKJDk5crmAah_mzTPHTFeBNRAP3XMIm_XYK13xchC1yzJtPwb0LP1DdRE9cTCMEdMkDIrE34OZgL7ZVnpvvzyNRSN4JDA4Q3P4vL9IM9zNb0ZEwsWkNSFWcC_ex659lGMhq85y4TzTl1XBAZTN_qBCgVhe_xeDgcoRhbGRNIjTNxiyQpXbr0jlWIaIrBfOvX2TY";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 lg:py-20">
      
      {/* Page Header */}
      <div className="mb-12 border-l-[6px] border-primary pl-6">
        <h1 className="font-sans text-4xl md:text-5xl font-bold uppercase tracking-tight text-primary mb-4">
          {contactData?.pageTitle || "Fale Conosco"}
        </h1>
        <p className="text-lg font-sans text-on-surface-variant max-w-2xl leading-relaxed">
          {contactData?.pageDescription || "Suporte técnico e comercial para grandes obras e pequenos reparos. Nossa equipe de especialistas está pronta para ajudar com orçamentos e especificações industriais."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Form Section */}
        <div className="lg:col-span-7 industrial-border bg-surface-container-lowest p-8 shadow-sm rounded-sm">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-outline-variant">
            <Mail className="text-primary" size={28} />
            <h2 className="font-sans text-2xl tracking-tight uppercase font-bold text-primary">
              {contactData?.formTitle || "Enviar Mensagem"}
            </h2>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 relative">
                <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">Nome Completo</label>
                <input required className="industrial-border p-3.5 bg-surface-container font-sans text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none rounded-sm" placeholder="Ex: João da Silva" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">E-mail Corporativo</label>
                <input required className="industrial-border p-3.5 bg-surface-container font-sans text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none rounded-sm" placeholder="nome@empresa.com.br" type="email" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">Telefone / WhatsApp</label>
                <input className="industrial-border p-3.5 bg-surface-container font-sans text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none rounded-sm" placeholder="(00) 00000-0000" type="tel" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">Assunto</label>
                <select className="industrial-border p-3.5 bg-surface-container font-sans text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none rounded-sm text-on-surface">
                  <option>Orçamento de Ferragens</option>
                  <option>Suporte Técnico</option>
                  <option>Parcerias Comerciais</option>
                  <option>Outros assuntos gerais</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">Sua Mensagem</label>
              <textarea required className="industrial-border p-3.5 bg-surface-container font-sans text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none rounded-sm resize-y" placeholder="Descreva os produtos ou serviços necessários, quantidades estimadas e cronograma..." rows={6}></textarea>
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting || isSent}
              className={`w-full md:w-auto px-10 py-4 font-sans font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-colors rounded-sm shadow-sm ${
                isSent ? 'bg-green-700 text-white cursor-default' : 'bg-primary text-on-primary hover:brightness-110 active:brightness-90'
              }`}
            >
              {isSubmitting ? (
                <>PROCESSANDO...</>
              ) : isSent ? (
                <>ENVIADO COM SUCESSO</>
              ) : (
                <>
                  Enviar Solicitação <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          
          <a href="#" className="bg-primary-container text-on-primary-container p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-opacity-90 border border-primary transition-all group rounded-sm shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <MessageCircle className="text-secondary flex-shrink-0" size={36} />
              <div>
                <p className="font-mono text-xs font-bold uppercase mb-1 tracking-widest text-on-primary-container/80">WhatsApp Comercial</p>
                <p className="font-sans text-2xl font-bold tracking-tight">{contactData?.whatsappPhone || "(85) 98880-0637"}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest/20 p-2 rounded-full hidden md:block group-hover:-rotate-12 transition-transform">
               <ExternalLink size={20} />
            </div>
          </a>

          <div className="industrial-border bg-surface-container-lowest p-8 space-y-8 shadow-sm rounded-sm">
            <div className="flex gap-5">
              <Phone className="text-primary mt-1 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-mono text-xs uppercase font-bold text-on-surface-variant mb-2 tracking-widest">Central de Vendas</h4>
                <p className="font-sans text-xl font-bold text-primary mb-1">{contactData?.salesPhone || "(85) 3252-3000"}</p>
                <p className="text-sm font-sans text-on-surface-variant">{contactData?.salesHours || "Segunda a Sexta, das 08:00 às 16:45"}</p>
              </div>
            </div>
            <div className="h-px bg-outline-variant w-full"></div>
            <div className="flex gap-5">
              <MapPin className="text-primary mt-1 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-mono text-xs uppercase font-bold text-on-surface-variant mb-2 tracking-widest">Endereço Industrial</h4>
                <p className="font-sans text-lg font-bold text-primary mb-1">{contactData?.addressLine1 || "R. Visc. Sabóia, 130 - Centro"}</p>
                <p className="text-sm font-sans text-on-surface-variant">{contactData?.addressLine2 || "Fortaleza - CE, 60030-090, Brasil"}</p>
              </div>
            </div>
          </div>

          <div className="industrial-border bg-surface-container-high aspect-video relative group overflow-hidden rounded-sm shadow-sm hidden sm:block">
            <iframe 
              src="https://maps.google.com/maps?q=R.%20Visc.%20Saboia,%20130%20-%20Centro,%20Fortaleza%20-%20CE&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            ></iframe>
            <div className="absolute bottom-4 right-4 pointer-events-auto">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=R.+Visc.+Saboia,+130+-+Centro,+Fortaleza+-+CE"
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-surface-container-lowest industrial-border px-5 py-2.5 flex items-center gap-2 text-primary font-sans text-xs font-bold uppercase tracking-widest hover:bg-surface-container transition-colors shadow-sm rounded-sm"
              >
                <ExternalLink size={14} /> Ver no Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Hours */}
      <div className="mt-20">
        <h3 className="font-sans text-2xl font-bold uppercase mb-8 border-b-2 border-primary inline-block tracking-tight text-primary pb-2">
          {contactData?.hoursTitle || "Horários de Operação"}
        </h3>
        <div className="industrial-border overflow-hidden rounded-sm shadow-sm bg-surface-container-lowest">
          <table className="w-full zebra-table">
            <thead className="bg-primary text-on-primary">
              <tr>
                <th className="p-5 text-left font-mono text-xs font-bold uppercase tracking-widest w-1/3">Departamento</th>
                <th className="p-5 text-left font-mono text-xs font-bold uppercase tracking-widest w-1/3">Dias</th>
                <th className="p-5 text-left font-mono text-xs font-bold uppercase tracking-widest w-1/3">Horário</th>
              </tr>
            </thead>
            <tbody className="text-on-surface font-sans text-sm">
              {loading ? (
                <tr><td colSpan={3} className="p-5 text-center font-mono animate-pulse">Carregando horários...</td></tr>
              ) : hours.length > 0 ? (
                hours.map((h, i) => (
                  <tr key={h.documentId || h.id || i} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="p-5 font-bold text-primary">{h.department}</td>
                    <td className="p-5 text-on-surface-variant font-medium">{h.days}</td>
                    <td className="p-5 font-mono">{h.hours}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="p-5 font-bold text-primary">Atendimento</td>
                    <td className="p-5 text-on-surface-variant font-medium">Segunda a Sexta</td>
                    <td className="p-5 font-mono">08:00–16:45</td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="p-5 font-bold text-primary">Atendimento</td>
                    <td className="p-5 text-on-surface-variant font-medium">Sábado</td>
                    <td className="p-5 font-mono">08:00–12:00</td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="p-5 font-bold text-primary">Atendimento</td>
                    <td className="p-5 text-on-surface-variant font-medium">Domingo</td>
                    <td className="p-5 font-mono text-red-600 font-bold">Fechado</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
