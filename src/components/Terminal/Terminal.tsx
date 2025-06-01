import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import danceGif from "../../assets/actdance.gif";
import personaMusic from "../../assets/persona.mp3";

interface CommandResult {
  type: "text" | "gif" | "error";
  content: string;
  duration?: number;
}

function Terminal() {
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [results, setResults] = useState<CommandResult[]>([]);
  const [activeGif, setActiveGif] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Toggle terminal visibility with backtick key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`") {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  

  // Focus input when terminal opens
  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isVisible]);

  const audioPersonaRef = useRef<HTMLAudioElement | null>(null);

  const processCommand = (cmd: string) => {
    const normalizedCmd = cmd.trim().toLowerCase();

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    if (normalizedCmd === "clear") {
      setResults([]);
      return;
    }

    if (normalizedCmd === "help") {
      setResults((prev) => [
        ...prev,
        {
          type: "text",
          content:
            "Available commands: help, clear, act dance, persona, exit vim, flip coin, fortune, credits, matrix",
        },
      ]);
      return;
    }
    if (normalizedCmd === "flip coin") {
      const result = Math.random() > 0.5 ? "Heads" : "Tails";
      setResults((prev) => [
        ...prev,
        {
          type: "text",
          content: `Flipping coin... ${result}!`,
        },
      ]);
      return;
    }

    if (normalizedCmd === "fortune") {
      const fortunes = [
        "A beautiful, smart, and loving person will be coming into your life.",
        "Your code will change the world.",
        "The greatest risk is not taking one.",
        "You will refactor legacy code with zero bugs on the first try.",
        "Your pull request will be approved without any change requests.",
        "You will find that missing semicolon soon.",
      ];
      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      setResults((prev) => [
        ...prev,
        { type: "text", content: `🔮 ${fortune}` },
      ]);
      return;
    }

    if (normalizedCmd === "exit vim") {
      setResults((prev) => [
        ...prev,
        { type: "error", content: "Cannot exit vim. You're stuck forever." },
      ]);
      return;
    }

    if (normalizedCmd === "credits") {
      setResults((prev) => [
        ...prev,
        { type: "text", content: "✨ Website by Fady Damak ✨" },
        {
          type: "text",
          content: "Technologies: React, TypeScript, Three.js, GSAP, Tailwind",
        },
        {
          type: "text",
          content:
            "Inspired by my nerdy aah mind",
        },
      ]);
      return;
    }

    if (normalizedCmd.startsWith("persona")) {
      if (!audioPersonaRef.current) {
        audioPersonaRef.current = new Audio(personaMusic);
      }
      audioPersonaRef.current.play();
      setResults((prev) => [
        ...prev,
        {
          type: "text",
          content: "DISTURBING THE PEAACEE",
        },
      ]);
      return;
    }

    if (normalizedCmd.startsWith("stop")) {
      if (audioPersonaRef.current && !audioPersonaRef.current.paused) {
        audioPersonaRef.current.pause();
        audioPersonaRef.current.currentTime = 0;
        setResults((prev) => [
          ...prev,
          {
            type: "text",
            content: "No more persona :(",
          },
        ]);
      } else {
        setResults((prev) => [
          ...prev,
          {
            type: "text",
            content: "No audio is currently playing dumbass",
          },
        ]);
      }
    }

    if (normalizedCmd.startsWith("act dance")) {
      setActiveGif(danceGif);
      setTimeout(() => {
        setActiveGif(null);
      }, 5000);
      setResults((prev) => [
        ...prev,
        {
          type: "gif",
          content: "Dance party initiated! 🎉",
          duration: 5000,
        },
      ]);
    }
    return;
  };

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    processCommand(input);
    setInput("");
  };

  // Handle key navigation through history
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Escape") {
      setIsVisible(false);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        terminalRef.current &&
        !terminalRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible]);

  return (
    <>
      {/* Overlay GIF when active */}
      <AnimatePresence>
        {activeGif && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={activeGif}
              alt="Dance"
              className="max-h-[80vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal window */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={terminalRef}
            className="fixed top-0 left-0 right-0 w-full sm:w-3/4 lg:w-1/2 mx-auto h-72 bg-black/90 backdrop-blur-md z-50 rounded-b-lg overflow-hidden border border-t-0 border-gray-700 shadow-2xl"
            initial={{ y: -300 }}
            animate={{ y: 0 }}
            exit={{ y: -300 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-white/80 text-xs">
                <strong>Terminal</strong>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="h-[calc(100%-32px)] overflow-y-auto p-4 font-mono text-sm">
              {/* Terminal output */}
              <div className="mb-4 text-gray-400">
                <p>
                  Welcome to the goofy aah terminal! Type 'help' for available
                  commands or whatever.
                </p>
                <p>Press Escape to close.</p>

                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`mt-2 ${
                      result.type === "error"
                        ? "text-red-400"
                        : result.type === "gif"
                        ? "text-green-300"
                        : "text-gray-300"
                    }`}
                  >
                    {result.content}
                  </div>
                ))}
              </div>

              {/* Command input */}
              <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-green-500 mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-white outline-none caret-green-500"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Terminal;
