import { lazy, Suspense, useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import Terminal from "./components/Terminal/Terminal";
import Hero from "./components/Hero/Hero";
const About = lazy(() => import("./components/About/About"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const SectionParticles = lazy(
  () => import("./components/SectionParticles/SectionsParticles")
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePageHide = () => {
      if (window.performance && window.performance.navigation.type === 2) {
        window.location.reload();
      }
    };
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return isLoading ? (
    <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
  ) : (
    <>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="animate-pulse">Loading hero section...</div>
          </div>
        }
      >
        <>
          <Terminal />
          <Hero name="Fady Damak" />
          <SectionParticles
            color="#940A31"
            count={10}
            size={0.3}
            opacity={0.2}
            zIndex={-5}
          />

          <About />
          <Projects />
          <Contact />

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <span className="sr-only">Scroll down</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5L12 19M12 19L19 12M12 19L5 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </>
      </Suspense>
    </>
  );
}
export default App;
