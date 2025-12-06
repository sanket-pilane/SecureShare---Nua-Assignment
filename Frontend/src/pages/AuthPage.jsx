import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaGoogle,
  FaSpinner,
  FaLock,
  FaExclamationCircle,
} from "react-icons/fa";

import AuthContext from "../context/AuthContext";

// UI Components
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs";
import { LottieAnimation } from "../components/LottieAnimation";
import { TypewriterEffect } from "../components/TypewriterEffect";

// Placeholder Animation (Replace with your actual import or keep null)
const aiBrainAnimation = null;

export default function AuthPage() {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation States
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateForm = (type) => {
    let newErrors = {};
    let isValid = true;

    // Email Validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password Validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (type === "signup") {
      if (!name.trim()) {
        newErrors.name = "Full Name is required";
        isValid = false;
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const onTabChange = () => {
    // Reset everything when switching tabs
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm("login")) return;

    setLoading(true);
    const result = await login({ email, password });
    if (result.success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm("signup")) return;

    setLoading(true);
    const result = await register({ name, email, password });
    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    toast.info("Google OAuth requires backend integration.");
  };

  return (
    <motion.div
      className="grid min-h-screen w-full lg:grid-cols-2 bg-slate-950 text-slate-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Column 1: The Form */}
      {/* Added px-4 for mobile padding */}
      <div className="flex items-center justify-center p-4 md:p-12">
        <Tabs
          defaultValue="login"
          className="w-full max-w-md"
          onValueChange={onTabChange}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="border-slate-800 bg-slate-900/50">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription className="text-slate-400">
                    Welcome back! Please login to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      disabled={loading}
                      className={
                        errors.email ? "border-red-500 focus:ring-red-500" : ""
                      }
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <FaExclamationCircle /> {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors({ ...errors, password: null });
                      }}
                      disabled={loading}
                      className={
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <FaExclamationCircle /> {errors.password}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 mt-2">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading && (
                      <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Login
                  </Button>
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase"></div>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-slate-800 bg-slate-900/50">
              <form onSubmit={handleSignUp}>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription className="text-slate-400">
                    Create an account to get started with SecureShare.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: null });
                      }}
                      disabled={loading}
                      className={
                        errors.name ? "border-red-500 focus:ring-red-500" : ""
                      }
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <FaExclamationCircle /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      disabled={loading}
                      className={
                        errors.email ? "border-red-500 focus:ring-red-500" : ""
                      }
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <FaExclamationCircle /> {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {" "}
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password)
                            setErrors({ ...errors, password: null });
                        }}
                        disabled={loading}
                        className={
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }
                      />
                      {errors.password && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <FaExclamationCircle /> {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword)
                            setErrors({ ...errors, confirmPassword: null });
                        }}
                        disabled={loading}
                        className={
                          errors.confirmPassword
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <FaExclamationCircle /> {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 mt-2">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading && (
                      <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden bg-slate-900 border-l border-slate-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="p-6 bg-slate-800/50 rounded-full border border-slate-700 backdrop-blur-sm mb-8 shadow-2xl">
            {aiBrainAnimation ? (
              <LottieAnimation
                animationData={aiBrainAnimation}
                className="w-64 h-64"
              />
            ) : (
              <FaLock className="w-32 h-32 text-blue-500" />
            )}
          </div>

          <h1 className="text-4xl font-bold mb-2">SecureShare</h1>
          <div className="text-xl text-slate-400 mt-2 h-8">
            <TypewriterEffect />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
