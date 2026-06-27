/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import LegalPage from './pages/LegalPage';
import Faq from './pages/Faq';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage} setGlobalSearch={setGlobalSearch}>
      {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
      {currentPage === 'catalog' && <Catalog globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />}
      {currentPage === 'team' && <Team setCurrentPage={setCurrentPage} />}
      {currentPage === 'contact' && <Contact />}
      {currentPage === 'careers' && <Careers />}
      {currentPage === 'terms' && <LegalPage type="terms" />}
      {currentPage === 'privacy' && <LegalPage type="privacy" />}
      {currentPage === 'faq' && <Faq />}
      {currentPage === 'blog' && <Blog setCurrentPage={setCurrentPage} />}
      {currentPage.startsWith('blog/') && <BlogPost slug={currentPage.split('/')[1]} setCurrentPage={setCurrentPage} />}
      <FloatingWhatsApp />
    </Layout>
  );
}
