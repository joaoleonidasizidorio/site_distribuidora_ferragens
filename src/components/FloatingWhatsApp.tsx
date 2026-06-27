import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const STRAPI_URL = "http://localhost:1337";

export default function FloatingWhatsApp() {
  const [phoneNumber, setPhoneNumber] = useState('5511999999999');

  useEffect(() => {
    // Tenta buscar o número de vendas do Strapi (Página de Contato)
    fetch(`${STRAPI_URL}/api/contactpage`)
      .then(res => res.json())
      .then(json => {
        if (json && json.data && json.data.whatsappSales) {
          // Limpa possíveis formatações (deixa só os números)
          const cleanNumber = json.data.whatsappSales.replace(/\D/g, '');
          setPhoneNumber(cleanNumber);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleClick = () => {
    const text = encodeURIComponent('Olá! Estava navegando no site e gostaria de falar com um consultor.');
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-[#20bd5a] transition-all flex items-center justify-center group"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle size={32} />
      <span className="absolute right-full mr-4 bg-surface text-on-surface text-sm font-sans font-bold px-3 py-1.5 rounded-sm shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-outline-variant">
        Precisa de ajuda?
      </span>
    </button>
  );
}
