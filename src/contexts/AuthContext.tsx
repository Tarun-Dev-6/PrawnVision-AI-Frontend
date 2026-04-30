// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   phone?: string;
//   location?: string;
//   avatar?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (email: string, password: string, name: string, phone?: string, location?: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored user on mount
//     const storedUser = localStorage.getItem("prawnvision_user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     // Simulate API call - replace with your FastAPI backend
//     setIsLoading(true);
//     try {
//       // Simulated login - replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
      
//       const userData: User = {
//         id: "user_" + Date.now(),
//         email,
//         name: email.split("@")[0],
//       };
      
//       localStorage.setItem("prawnvision_user", JSON.stringify(userData));
//       setUser(userData);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signup = async (email: string, password: string, name: string, phone?: string, location?: string) => {
//     setIsLoading(true);
//     try {
//       // Simulated signup - replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
      
//       const userData: User = {
//         id: "user_" + Date.now(),
//         email,
//         name,
//         phone,
//         location,
//       };
      
//       localStorage.setItem("prawnvision_user", JSON.stringify(userData));
//       setUser(userData);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("prawnvision_user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
const API_BASE = "https://tarun666-prawnvision-yolo-api.hf.space";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    phone?: string,
    location?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);


  // --------------------
  // LOGIN
  // --------------------
  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });

    const userData: User = {
  id: res.data.userId,
  name: res.data.name,
  email: res.data.email,
  phone: res.data.phone,
  location: res.data.location,
};

    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  // --------------------
  // SIGNUP
  // --------------------
  const signup = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    location?: string
  ) => {
    const res = await axios.post(`${API_BASE}/auth/signup`, {
      email,
      password,
      name,
      phone,
      location,
    });

    const userData: User = {
      id: res.data.userId,
      name,
      email,
      phone,
      location,
    };

    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  // --------------------
  // LOGOUT
  // --------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


