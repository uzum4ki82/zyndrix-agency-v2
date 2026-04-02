import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Sistemas } from '@/components/sections/Sistemas';
import { Metodo } from '@/components/sections/Metodo';
import { Casos } from '@/components/sections/Casos';
import { Planes } from '@/components/sections/Planes';
import { Testimonios } from '@/components/sections/Testimonios';
import { Contacto, Footer } from '@/components/sections/Contacto';
import { Background } from '@/components/common/Background';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#03040a] selection:bg-primary selection:text-white overflow-x-hidden">
      <Background />
      <Navbar />
      <Hero />
      <Sistemas />
      <Metodo />
      <Casos />
      <Planes />
      <Testimonios />
      <Contacto />
      <Footer />
    </main>
  );
}
