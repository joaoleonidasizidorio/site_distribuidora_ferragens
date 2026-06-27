import { Briefcase, MapPin, Building, Smartphone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const STRAPI_URL = "http://localhost:1337";

export default function Careers() {
  const [careerData, setCareerData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedJob, setSelectedJob] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/careerpage?populate=*`);
        const data = await res.json();
        if (data && data.data) setCareerData(data.data);
      } catch (err) { console.error(err); }
    };
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/jobpositions`);
        const data = await res.json();
        if (data && data.data) {
          // Filter only active jobs
          setJobs(data.data.filter((j: any) => j.isActive));
        }
      } catch (err) { console.error(err); }
    };

    Promise.all([fetchCareerData(), fetchJobs()]).finally(() => setLoading(false));
  }, []);

  const bgImageUrl = careerData?.heroImage?.url 
    ? `${STRAPI_URL}${careerData.heroImage.url}` 
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuCHrjh-o2qPYCuYWdewK-n0OIkr7bw_LU7wuFxATOSdR1bU4M74o57ho2H5_5TFNx2Mc3JYeol4SlGYcAvdIZv7O1Y0FhX9nYELeEXMiLryjnq2ZlEigiQXgMFLPFb8nhZfS0Fp7EdsviMegzuKiU4Uc5P1z2O5BoRrGlseRmTeSyRQXzlIBoqfCIzhq9NOwL1-3PUS6JYPg8ls7MTvocUJu2fHUNRbl36nCTLVqTCG_dGI0Gp6oquRevwqitqThgRfZycHKU6CwnE";

  const handleApplyClick = (title: string) => {
    setSelectedJob(title);
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsAppClick = (jobTitle: string) => {
    const phone = careerData?.whatsappRh || "5511987654321";
    const text = encodeURIComponent(`Olá! Tenho interesse na vaga de ${jobTitle}. Gostaria de mais informações.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const dataObj = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      jobTitle: formData.get('jobTitle'),
    };

    const submitData = new FormData();
    submitData.append('data', JSON.stringify(dataObj));
    
    if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
      submitData.append('files.resume', fileInputRef.current.files[0]);
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/applications`, {
        method: 'POST',
        body: submitData,
      });

      if (!res.ok) {
        throw new Error('Erro ao enviar candidatura. Verifique as permissões do Strapi.');
      }

      setIsSent(true);
      if (e.currentTarget) e.currentTarget.reset();
      setSelectedJob('');
      setTimeout(() => setIsSent(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary-container border-b-4 border-secondary text-on-primary-container relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 lg:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-secondary mb-4 block tracking-widest">
              {careerData?.heroSubtitle || "Vem construir o futuro com a gente"}
            </span>
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-on-primary mb-6 tracking-tight leading-tight">
              {careerData?.heroTitle || "FAÇA PARTE DA NOSSA EQUIPE."}
            </h1>
            <p className="font-sans text-lg text-primary-fixed max-w-lg leading-relaxed">
              {careerData?.heroDescription || "Estamos sempre em busca de talentos excepcionais para integrar nosso time. Se você é apaixonado por engenharia, construção e inovação, confira nossas vagas."}
            </p>
          </div>
          <div className="relative hidden md:block h-72 w-full industrial-border-thick border-primary shadow-xl rounded-sm overflow-hidden bg-surface-container">
            <img 
              className="w-full h-full object-cover mix-blend-luminosity opacity-80" 
              src={bgImageUrl} 
              alt="Careers" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-surface-container-lowest border-y border-outline-variant py-20 bg-grid-pattern">
        <div className="max-w-4xl mx-auto px-6 md:px-16 text-center">
          <h2 className="font-sans text-3xl font-bold uppercase tracking-tight text-primary mb-6">
            {careerData?.benefitsTitle || "Por que trabalhar conosco?"}
          </h2>
          <p className="font-sans text-lg text-on-surface-variant leading-relaxed">
            {careerData?.benefitsDescription || "Oferecemos um ambiente dinâmico, plano de carreira acelerado e benefícios competitivos no mercado."}
          </p>
        </div>
      </section>

      {/* Vagas Abertas */}
      <section className="py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-12 border-b-2 border-outline-variant pb-6">
          <h2 className="font-sans text-3xl font-bold text-primary uppercase tracking-tight mb-2">Vagas Abertas</h2>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="p-10 text-center font-mono text-on-surface-variant animate-pulse">Carregando vagas...</div>
          ) : jobs.length > 0 ? (
            jobs.map((job, idx) => (
              <div key={job.documentId || job.id || idx} className="industrial-border bg-surface-container-lowest p-6 md:p-8 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary transition-colors">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-secondary text-white px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest uppercase rounded-sm">
                      {job.department}
                    </span>
                    <span className="bg-surface-container-highest text-on-surface px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest uppercase rounded-sm">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-primary mb-2">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-sans text-on-surface-variant mb-4">
                    <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</div>
                  </div>
                  <p className="font-sans text-on-surface-variant text-sm leading-relaxed max-w-3xl">
                    {job.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <button 
                    onClick={() => handleApplyClick(job.title)}
                    className="w-full bg-primary text-white py-3 font-sans font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-colors rounded-sm shadow-sm text-center"
                  >
                    Preencher Formulário
                  </button>
                  <button 
                    onClick={() => handleWhatsAppClick(job.title)}
                    className="w-full industrial-border-thick text-primary bg-surface-container-lowest py-3 font-sans font-bold uppercase tracking-widest text-xs hover:bg-surface-container transition-colors rounded-sm flex items-center justify-center gap-2"
                  >
                    <Smartphone size={16} /> Via WhatsApp
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center industrial-border bg-surface-container-lowest rounded-sm">
              <Briefcase size={48} className="mx-auto text-outline mb-4" />
              <p className="font-sans text-lg text-on-surface-variant">Nenhuma vaga aberta no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Formulário de Candidatura */}
      <section id="application-form" className="py-20 md:py-28 px-6 md:px-16 max-w-4xl mx-auto">
        <div className="industrial-border-thick border-primary p-8 md:p-12 bg-surface-container shadow-sm rounded-sm">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-outline-variant">
            <Mail className="text-primary" size={28} />
            <h2 className="font-sans text-2xl tracking-tight uppercase font-bold text-primary">Envie seu Currículo</h2>
          </div>
          
          {isSent ? (
            <div className="bg-green-100 border border-green-500 text-green-800 p-8 text-center rounded-sm">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-2">Candidatura Enviada!</h3>
              <p>Recebemos seus dados e seu currículo. Entraremos em contato em breve.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleFormSubmit}>
              {errorMsg && (
                <div className="bg-red-100 border border-red-500 text-red-700 p-4 rounded-sm text-sm font-bold">
                  {errorMsg}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">Nome Completo</label>
                  <input name="name" required className="industrial-border p-3.5 bg-surface-container-lowest font-sans text-sm focus:border-primary outline-none rounded-sm" placeholder="João da Silva" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">E-mail</label>
                  <input name="email" required className="industrial-border p-3.5 bg-surface-container-lowest font-sans text-sm focus:border-primary outline-none rounded-sm" placeholder="joao@email.com" type="email" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">WhatsApp / Telefone</label>
                  <input name="phone" required className="industrial-border p-3.5 bg-surface-container-lowest font-sans text-sm focus:border-primary outline-none rounded-sm" placeholder="(11) 90000-0000" type="tel" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">Vaga de Interesse</label>
                  <input name="jobTitle" required value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="industrial-border p-3.5 bg-surface-container-lowest font-sans text-sm focus:border-primary outline-none rounded-sm" placeholder="Ex: Vendedor Técnico" type="text" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs uppercase font-bold text-on-surface-variant">Currículo (PDF)</label>
                <input ref={fileInputRef} name="resume" required type="file" accept=".pdf" className="industrial-border p-3.5 bg-surface-container-lowest font-sans text-sm focus:border-primary outline-none rounded-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-secondary file:text-white hover:file:bg-secondary/90 cursor-pointer" />
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 font-sans font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-colors rounded-sm shadow-sm bg-primary text-on-primary hover:brightness-110 active:brightness-90 disabled:opacity-50"
              >
                {isSubmitting ? 'ENVIANDO...' : <><Send size={18} /> Enviar Candidatura</>}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
