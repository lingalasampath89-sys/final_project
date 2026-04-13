import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth, User } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Code2, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock authentication logic
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network request

      if (isSignup) {
        if (!email || !password || !displayName) {
          throw new Error("Please fill in all fields.");
        }

        // Save the registered user to local storage as a mock database
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 11),
          email,
          user_metadata: { 
            display_name: displayName,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}` 
          }
        };

        // Let's store users in a mock DB
        const existingUsersStr = localStorage.getItem("mock_users_db") || "[]";
        const existingUsers = JSON.parse(existingUsersStr);
        if (existingUsers.find((u: any) => u.email === email)) {
          throw new Error("User already exists with this email.");
        }

        existingUsers.push({ ...newUser, password });
        localStorage.setItem("mock_users_db", JSON.stringify(existingUsers));

        signIn(newUser);
        toast.success("Account created! Redirecting...");
      } else {
        if (!email || !password) {
          throw new Error("Please fill in all fields.");
        }

        const existingUsersStr = localStorage.getItem("mock_users_db") || "[]";
        const existingUsers = JSON.parse(existingUsersStr);
        const u = existingUsers.find((u: any) => u.email === email && u.password === password);

        if (!u) {
          throw new Error("Invalid login credentials.");
        }

        signIn({
          id: u.id,
          email: u.email,
          user_metadata: u.user_metadata
        });
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const decoded = jwtDecode(credentialResponse.credential) as any;
        const googleUser: User = {
          id: decoded.sub || "google-" + Math.random().toString(36).substring(2, 8),
          email: decoded.email,
          user_metadata: { 
            display_name: decoded.name,
            avatar_url: decoded.picture 
          }
        };
        signIn(googleUser);
        toast.success("Successfully logged in with Google!");
      }
    } catch (err) {
      toast.error("Failed to decode Google profile.");
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast.error("Please enter your email first to reset password. (Mock System)");
    } else {
      toast.info(`Reset link sent to ${email}! (Simulated)`);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden">
{/* Removed glaring background glows */}

        <Card className="w-full max-w-md border-none shadow-none bg-transparent relative z-10">
          <CardHeader className="text-left px-0 pt-0">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Laboratory</span>
            </Link>
            
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            
            <CardTitle className="text-3xl font-bold tracking-tight mb-2">
              {isSignup ? "Initialize Node" : "Access Neural System"}
            </CardTitle>
            <CardDescription className="text-base">
              {isSignup ? "Create your credentials to join the inference network." : "Re-authenticate to synchronize your workspace."}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Identity Name</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Full Name" className="h-12 bg-secondary/50 border-border focus:ring-primary" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Network Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ident@node.ai" required className="h-12 bg-secondary/50 border-border focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Security Key</Label>
                  {!isSignup && (
                    <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:underline font-semibold">
                      Forgot Key?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input 
                     id="password" 
                     type={showPassword ? "text" : "password"} 
                     value={password} 
                     onChange={(e) => setPassword(e.target.value)} 
                     placeholder="••••••••" 
                     required 
                     minLength={6} 
                     className="pr-10 h-12 bg-secondary/50 border-border focus:ring-primary"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={loading}>
                {loading ? "Decrypting..." : isSignup ? "Authorize Profile" : "Connect System"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/60">
                <span className="bg-background px-4">Neural Gateway</span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google Auth Failed');
                }}
                useOneTap
                theme="outline"
                size="large"
                shape="pill"
                text="continue_with"
                width="320px"
              />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {isSignup ? "Previously registered?" : "New to the collective?"}{" "}
              <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-primary hover:text-primary/80 font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all">
                {isSignup ? "Sign In" : "Initialize Link"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right: Project Visual */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-950">
        <img 
          src="/visual.png" 
          alt="Neural Processing Visual" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
        
        <div className="absolute bottom-16 left-16 right-16 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Inference Engine v2.4</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-4 leading-tight uppercase">
            Quantizing Complexity Into <span className="text-primary">Intelligence</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg">
            Our Adaptive Hierarchical ML layers autonomously reconstruct XML structures with 99.8% structural integrity and neural precision.
          </p>
        </div>

        {/* Dynamic Tech Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(to right, var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  );
};

export default Auth;
