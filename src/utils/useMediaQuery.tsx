import { useState, useEffect } from "react";

// Define breakpoints inside the hook
const breakpoints = {
  mobile: "(max-width: 600px)",
  tablet: "(max-width: 1000px)",
  desktop: "(min-width: 769px)",
  mobilesm: "(max-width: 400px)",
};

const useMediaQuery = (breakpoint: keyof typeof breakpoints): boolean => {
  const query = breakpoints[breakpoint];
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", updateMatch);

    return () => mediaQueryList.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
};

export default useMediaQuery;
