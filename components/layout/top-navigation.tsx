import useScrollPosition from "@react-hook/window-scroll";
import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SomaLogo } from "@/components/ui/soma-logo";


const useRange = (
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  const mappedValue = useMemo(() => {
    const newValue =
      ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    const largest = Math.max(outMin, outMax);
    const smallest = Math.min(outMin, outMax);
    return Math.min(Math.max(newValue, smallest), largest);
  }, [num]);

  return mappedValue;
};

export function TopNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const y = useScrollPosition(60);
  const navX = useRange(y, 0, 50, 0, 42);
  const logoScale = useRange(y, 0, 50, 1, 0.8);
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <div className="font-sans">
        <header className="flex gap-4 bg-slate-50 px-6 py-4 pl-16 text-sm border-b border-slate-200">
          <div
            style={{
              transform: `scale(${logoScale})`,
            }}
            className="fixed left-6 top-4 z-[60]"
          >
            <SomaLogo size="sm" />
          </div>
          <div className="flex gap-4">
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">SomaJournal</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">wellness</span>
          </div>
        </header>
      </div>
      <nav className="sticky top-0 flex border-b border-slate-200 bg-slate-100 text-sm z-50">
        <ol
          style={{
            transform: `translateX(${navX}px)`,
          }}
          className="relative flex gap-4 px-6 py-4 text-slate-600"
        >
          <li 
            onClick={() => handleNavigate('/dashboard')} 
            className={`cursor-pointer transition-colors font-medium ${
              pathname === '/dashboard' ? 'text-emerald-600' : 'hover:text-emerald-700'
            }`}
          >
            Dashboard
          </li>
          <li 
            onClick={() => handleNavigate('/journal')} 
            className={`cursor-pointer transition-colors font-medium ${
              pathname === '/journal' ? 'text-emerald-600' : 'hover:text-emerald-700'
            }`}
          >
            Journal
          </li>
          <li 
            onClick={() => handleNavigate('/settings')} 
            className={`cursor-pointer transition-colors font-medium ${
              pathname === '/settings' ? 'text-emerald-600' : 'hover:text-emerald-700'
            }`}
          >
            Settings
          </li>
        </ol>
      </nav>
    </>
  );
}