import { useEffect } from "react";

function useBodyToggleClass(isLeftOpen, setLeftOpen) {
  useEffect(() => {
    const classLeftSideCollapsed = "left-side-collapsed";

    const updateBodyClass = () => {
      const userModule = document.querySelector(".user-module");
      if (!userModule) return;

      if (window.innerWidth <= 1280) {
        userModule.classList.add(classLeftSideCollapsed);
        setLeftOpen(true); // collapse sidebar on small screens
      } else {
        userModule.classList.remove(classLeftSideCollapsed);
        setLeftOpen(false); // expand sidebar on large screens
      }
    };

    // Run on mount
    updateBodyClass();

    // Run on resize
    window.addEventListener("resize", updateBodyClass);

    return () => window.removeEventListener("resize", updateBodyClass);

  }, [setLeftOpen]);  
}

export default useBodyToggleClass;
