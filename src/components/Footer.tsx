"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const hidden = ["/login", "/signup", "/pop"];
  if (hidden.includes(pathname)) return null;

  return (
    <footer className="mt-auto px-6 py-4 text-center text-[10px] text-ink/20">
      <p>
        Dragón emoji by{" "}
        <a href="https://github.com/chr-1x/dragn-emoji" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink/40">
          khr / chr-1x
        </a>
        ,{" "}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink/40">
          CC BY-NC-SA 4.0
        </a>
        . Contenido de Spoonfed Chinese,{" "}
        <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink/40">
          CC BY 2.0
        </a>
        .
      </p>
    </footer>
  );
}
