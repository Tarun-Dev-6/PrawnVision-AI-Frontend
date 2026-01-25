import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

  const userDetails = {
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    phone: user?.phone || "1234567890",
    location: user?.location || "Bhimavaram, India",
    joinedDate: "January 2026",
  };

  return (
    <AppLayout>
      <div className="px-5 pt-6">
        {/* Profile Avatar */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="relative w-28 h-28 mx-auto mb-4">
            <div className="w-28 h-28 ocean-gradient rounded-full flex items-center justify-center shadow-elevated">
              <User className="h-14 w-14 text-primary-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 w-9 h-9 bg-accent rounded-full flex items-center justify-center shadow-soft border-2 border-background">
              <Camera className="h-4 w-4 text-accent-foreground" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {userDetails.name}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Shrimp Seed Counter
          </p>
        </div>

        {/* User Details Card */}
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden mb-6 animate-scale-in">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Profile Details</h2>
          </div>
          
          <div className="divide-y divide-border">
            {/* Email */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{userDetails.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{userDetails.phone}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{userDetails.location}</p>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground">{userDetails.joinedDate}</p>
              </div>
            </div>
          </div>
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
