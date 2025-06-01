// filepath: [App.tsx](http://_vscodecontentref_/0)
import { lazy, Suspense, useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import Terminal from "./components/Terminal/Terminal"; // Import the Terminal component

// Use lazy loading for all components
const Hero = lazy(() => import("./components/Hero/Hero"));
const About = lazy(() => import("./components/About/About"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const SectionParticles = lazy(() => import("./components/SectionParticles/SectionsParticles"));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  
  useEffect(() => {
    // Handle back/forward cache issues
    const handlePageHide = () => {
      if (window.performance && window.performance.navigation.type === 2) {
        window.location.reload();
      }
    };
    window.addEventListener("pagehide", handlePageHide);
    
    // Give the browser a moment to initialize before hiding the loading screen
    const timer = setTimeout(() => {
      setContentReady(true);
      
      // Add a little delay before removing the loading screen for smoother transition
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 2000);
    
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      
      <Terminal />
      
      {contentReady && (
        <Suspense fallback={null}>
          <>
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
      )}
    </>
  );
}

export default App;