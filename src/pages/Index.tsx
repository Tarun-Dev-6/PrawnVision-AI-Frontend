import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Waves } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/auth");
      }
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen ocean-gradient flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="animate-float mb-6">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-elevated inline-block">
            <Waves className="h-16 w-16 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground mb-2">
          PrawnVision AI
        </h1>
        <p className="text-primary-foreground/80">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
