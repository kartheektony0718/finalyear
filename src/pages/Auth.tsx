import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowLeft, Zap } from "lucide-react";

const Auth = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);

    try {

      /*
      ======================
      LOGIN
      ======================
      */

      if (isLogin) {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email,
              password
            })
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to login");
        }

        /*
        SAVE TOKEN + USER
        */

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));

        login(data.user, data.token);

        toast.success("Welcome back!");

        /*
        ROLE BASED REDIRECT
        */

        if (data.user.role === "admin") {

          navigate("/admin");

        } else {

          navigate("/dashboard");

        }

      }

      /*
      ======================
      REGISTER
      ======================
      */

      else {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email,
              password,
              name: fullName
            })
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to register");
        }

        toast.success("Account created! Please sign in.");

        setIsLogin(true);

      }

    } catch (error: any) {

      toast.error(error.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex bg-gradient-hero">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md"
        >

          <div className="flex items-center gap-3 mb-8">

            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>

            <span className="text-2xl font-display font-bold text-primary-foreground">
              SkillNect
            </span>

          </div>

          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">
            Build Your Career with AI
          </h1>

          <p className="text-lg text-primary-foreground/70">
            Create ATS resumes, prepare for interviews and grow your career with AI tools.
          </p>

        </motion.div>

      </div>

      {/* RIGHT SIDE LOGIN */}

      <div className="flex-1 flex items-center justify-center p-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >

          <div className="bg-card rounded-2xl p-8 shadow-glow border border-border">

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </button>

            <h2 className="text-2xl font-display font-bold mb-1">

              {isLogin ? "Welcome Back" : "Create Account"}

            </h2>

            <p className="text-muted-foreground mb-6">

              {isLogin
                ? "Sign in to continue"
                : "Start building your career"}

            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <AnimatePresence>

                {!isLogin && (

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >

                    <Label htmlFor="name">Full Name</Label>

                    <div className="relative mt-1">

                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

              {/* EMAIL */}

              <div>

                <Label>Email</Label>

                <div className="relative mt-1">

                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    type="email"
                    className="pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <Label>Password</Label>

                <div className="relative mt-1">

                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    type="password"
                    className="pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                </div>

              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >

                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}

              </Button>
<div className="flex justify-end">

  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-sm text-red-400 hover:underline"
  >
    Forgot Password?
  </button>

</div>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">

              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary ml-1 hover:underline"
              >

                {isLogin ? "Sign Up" : "Sign In"}

              </button>

            </p>

          </div>

        </motion.div>

      </div>

    </div>

  );

};

export default Auth;