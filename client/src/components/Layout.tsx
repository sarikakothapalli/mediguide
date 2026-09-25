import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/symptoms', label: 'Symptoms', icon: '🩺' },
  { path: '/clinics', label: 'Find Care', icon: '📍' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="bg-teal-700 text-white px-4 py-3 shadow-md sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">➕</span>
            <div>
              <h1 className="text-lg font-bold leading-tight">MediGuide</h1>
              <p className="text-xs text-teal-200">Your health companion</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-bottom">
        <div className="max-w-lg mx-auto flex">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                  active ? 'text-teal-700 font-semibold' : 'text-slate-500'
                }`}
              >
                <span className="text-xl mb-0.5">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
