import {
  User,
  Mail,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: User, label: "Edit Profile", path: "/profile/edit" },
  { icon: Bell, label: "Notifications", path: "/profile/notifications" },
  { icon: Shield, label: "Privacy & Security", path: "/profile/privacy" },
  { icon: HelpCircle, label: "Help & Support", path: "/profile/help" },
];

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <AppLayout>
      <div className="px-5 pt-6 safe-area-inset-top">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-24 h-24 ocean-gradient rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-primary-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-soft">
              <Camera className="h-4 w-4 text-accent-foreground" />
            </button>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {user?.name || "User"}
          </h1>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card rounded-2xl p-4 text-center shadow-soft">
            <p className="text-2xl font-bold text-foreground">27</p>
            <p className="text-xs text-muted-foreground mt-1">Batches</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-soft">
            <p className="text-2xl font-bold text-foreground">156</p>
            <p className="text-xs text-muted-foreground mt-1">Scans</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-soft">
            <p className="text-2xl font-bold text-foreground">98%</p>
            <p className="text-xs text-muted-foreground mt-1">Accuracy</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden mb-6 animate-scale-in">
          {menuItems.map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="flex-1 font-medium text-foreground">
                {item.label}
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* App Settings */}
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden mb-6 animate-scale-in">
          <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-colors text-left">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Moon className="h-5 w-5 text-primary" />
            </div>
            <span className="flex-1 font-medium text-foreground">
              Dark Mode
            </span>
            <div className="w-12 h-7 bg-secondary rounded-full p-1">
              <div className="w-5 h-5 bg-card rounded-full shadow-sm" />
            </div>
          </button>
        </div>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          PrawnVision AI v1.0.0
        </p>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
