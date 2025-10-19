import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type contextType = {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  toggleDarkMode: () => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  user: {
    isLoggedIn: boolean;
    user?: Record<string, any>;
  };
  setUser: Dispatch<
    SetStateAction<{ isLoggedIn: boolean; user?: Record<string, any> }>
  >;
  checkIsLoggedIn: () => void;
  logout: () => void;
  sendverifyEmail: () => void;
  isRatingOpen: boolean;
  setIsRatingOpen: Dispatch<SetStateAction<boolean>>
};

export const contextProvider = createContext<contextType | null>(null);

export const useAppContext = () => {
  const context = useContext(contextProvider);

  if (!context) {
    throw Error("useContextProvider must be used within a contextProvider");
  }

  return context;
};

const AppContext = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [user, setUser] = useState<{
    isLoggedIn: boolean;
    user?: Record<string, any>;
  }>({
    isLoggedIn: false,
    user: undefined,
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BackendURL}/api/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        localStorage.removeItem("user");
        navigate("/");
        toast.success(data.msg);
        checkIsLoggedIn();
      } else {
        toast.error(data.msg);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const sendverifyEmail = async () => {
    const toastId = toast.loading("sending OTP to mail");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BackendURL}/api/user/send-veri-otp`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.msg);
        navigate("/verify-email");
      } else {
        toast.error(data.msg);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const checkIsLoggedIn = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser({
        isLoggedIn: true,
        user: JSON.parse(userData),
      });
    } else {
      setUser({
        isLoggedIn: false,
        user: undefined,
      });
    }
  };

  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  return (
    <contextProvider.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        setIsLoading,
        isLoading,
        setUser,
        user,
        checkIsLoggedIn,
        logout,
        sendverifyEmail,
        setIsRatingOpen,
        isRatingOpen
      }}
    >
      {children}
    </contextProvider.Provider>
  );
};

export default AppContext;
