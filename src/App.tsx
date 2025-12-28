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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [resourcesReady, setResourcesReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    // Define all critical resources to preload
    const imagesToPreload = [
      '/src/assets/pic.avif',
      '/src/assets/playstationWave.avif',
      '/src/assets/project1.avif',
      '/src/assets/project2.avif',
      '/src/assets/project3.avif',
    ];

    const componentsToPreload = [
      () => import("./components/About/About"),
      () => import("./components/Projects/Projects"),
      () => import("./components/Contact/Contact"),
      () => import("./components/SectionParticles/SectionsParticles"),
    ];

    const totalResources = imagesToPreload.length + componentsToPreload.length;
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      setLoadingProgress((loadedCount / totalResources) * 100);
    };

    // Preload images
    const imagePromises = imagesToPreload.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            updateProgress();
            resolve(img);
          };
          img.onerror = () => {
            updateProgress(); // Still count as loaded to avoid blocking
            resolve(img);
          };
          img.src = src;
        })
    );

    // Preload components
    const componentPromises = componentsToPreload.map((importFn) =>
      importFn().then(() => {
        updateProgress();
      }).catch(() => {
        updateProgress(); // Still count as loaded to avoid blocking
      })
    );

    // Wait for all resources to load
    Promise.all([...imagePromises, ...componentPromises]).then(() => {
      setResourcesReady(true);
      setLoadingProgress(90); // leave room for the 3D scene to report readiness
    });
  }, []);

  // Complete loading when both resources and 3D scene are ready
  useEffect(() => {
    if (resourcesReady && sceneReady) {
      setLoadingProgress(100);
      const timer = setTimeout(() => setIsLoading(false), 400); // small buffer to avoid flash
      return () => clearTimeout(timer);
    }
  }, [resourcesReady, sceneReady]);

  return (
    <>
      {isLoading && <LoadingScreen progress={loadingProgress} />}

      <Suspense fallback={<div />}>
        <Terminal />
        <Hero name="Fady Damak" onSceneReady={() => setSceneReady(true)} />
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
      </Suspense>
    </>
  );
}
export default App;
