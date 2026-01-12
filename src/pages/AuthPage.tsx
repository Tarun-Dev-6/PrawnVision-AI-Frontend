import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      } else {
        await signup(email, password, name);
        toast({
          title: "Account created!",
          description: "Welcome to PrawnVision AI.",
        });
      }
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen ocean-gradient-soft flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        <div className="animate-float mb-6">
          <div className="ocean-gradient rounded-3xl p-5 shadow-elevated">
            <Waves className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">PrawnVision AI</h1>
        <p className="text-muted-foreground text-center">
          Smart Shrimp Seed Counting Solution
        </p>
      </div>

      {/* Auth Form */}
      <div className="bg-card rounded-t-[2.5rem] shadow-elevated px-6 pt-8 pb-10 safe-area-inset-bottom animate-slide-up">
        <div className="flex bg-secondary rounded-xl p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
              isLogin
                ? "bg-card shadow-soft text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
              !isLogin
                ? "bg-card shadow-soft text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative animate-fade-in">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {isLogin && (
            <button
              type="button"
              className="text-sm text-primary font-medium hover:underline"
            >
              Forgot Password?
            </button>
          )}

          <Button
            type="submit"
            variant="hero"
            className="w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary font-medium hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary font-medium hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
