import {useEffect, useState} from 'react';
import {ArrowUp} from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
      className="fixed right-4 bottom-24 lg:bottom-8 z-40 p-3 rounded-full bg-slate-800 text-white border border-slate-700 shadow-lg hover:bg-blue-600 transition-all"
      aria-label="返回顶部"
      data-cta="false"
    >
      <ArrowUp size={18} />
    </button>
  );
}

