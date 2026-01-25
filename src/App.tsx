// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import Index from "./pages/Index";
// import AuthPage from "./pages/AuthPage";
// import CapturePage from "./pages/CapturePage";
// import HistoryPage from "./pages/HistoryPage";
// import ProfilePage from "./pages/ProfilePage";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// // Protected Route wrapper
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen ocean-gradient flex items-center justify-center">
//         <div className="animate-pulse text-primary-foreground">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/auth" replace />;
//   }

//   return <>{children}</>;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Index />} />
//       <Route path="/auth" element={<AuthPage />} />
//       <Route
//         path="/capture"
//         element={
//           <ProtectedRoute>
//             <CapturePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/history"
//         element={
//           <ProtectedRoute>
//             <HistoryPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <ProfilePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <AppRoutes />
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import CapturePage from "./pages/CapturePage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// 🔐 Protected Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen ocean-gradient flex items-center justify-center">
        <div className="animate-pulse text-primary-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />

            <Route
              path="/capture"
              element={
                <ProtectedRoute>
                  <CapturePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
