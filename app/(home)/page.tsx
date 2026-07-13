import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Projects from '@/components/sections/Projects';
import Testimonials from '@/components/sections/Testimonials';
import Workflow from '@/components/sections/Workflow';
import BlogPreview from '@/components/sections/BlogPreview';
import FaqHome from '@/components/sections/FaqHome';
import Contact from '@/components/sections/Contact';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Testimonials />
      <Workflow />
      <BlogPreview />
      <FaqHome />
      <Contact />
    </SmoothScrollProvider>
  );
}
