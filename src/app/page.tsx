import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import Projects from "@/components/projects/Projects";
//import Experience from "@/components/experience/Experience";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/layout/Footer";
import ScrollOrchestrator from "@/components/ui/ScrollOrchestrator";


export default function Home() {

  return (
    <>
        <Hero />
        <div id="portafolio" className="hidden">
          <ScrollOrchestrator />
          <About />
          <Skills />
          <Projects />
          <Contact />
          <Footer />
        </div>
    </>
  );
}