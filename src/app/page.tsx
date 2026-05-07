import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Projects from "@/components/projects/Projects";
import Experience from "@/components/experience/Experience";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/layout/Footer";


export default function Home() {

  return (
    <>
      <Hero />
      <About />
      <Projects />
      {/*<Experience />*/}
      <Contact />
      <Footer />
    </>
  );
}