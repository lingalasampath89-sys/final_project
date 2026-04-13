import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Code2, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = user
    ? [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/workspace", label: "Workspace" },
      { to: "/features", label: "Features" },
      { to: "/profile", label: "Profile" },
      { to: "/about", label: "About" },
    ]
    : [
      { to: "/", label: "Home" },
      { to: "/features", label: "Features" },
      { to: "/about", label: "About" },
    ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <Code2 className="h-6 w-6 text-primary" />
          <span>Smart<span className="text-primary">AI</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-primary/20">
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[10px] font-bold text-primary">
                      {user.user_metadata?.display_name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start ml-2">
                  <span className="text-xs font-bold leading-none">{user.user_metadata?.display_name || 'User'}</span>
                  <span className="text-[10px] text-muted-foreground">Pro Node</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => { e.preventDefault(); signOut(); navigate('/'); }}
                  className="ml-2 hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
              <Button onClick={() => navigate("/auth?mode=signup")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
