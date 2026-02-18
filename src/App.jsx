import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import BrandMarquee from "./components/BrandMarquee";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Assignments from "./components/Assignments";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <BrandMarquee />
        <About />
        <Skills />
        <Experience />
        <Assignments />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
