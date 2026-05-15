import {ReactNode} from 'react';

type MobileStickyFooterProps = {
  children: ReactNode;
};

export default function MobileStickyFooter({children}: MobileStickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pt-1 pb-[env(safe-area-inset-bottom)] lg:hidden pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">{children}</div>
    </div>
  );
}
