"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Eye, EyeOff } from "lucide-react";
import NocturneLogo from "../cinema/NocturneLogo";
import TheatreEntranceScene from "../cinema/TheatreEntranceScene";
import {
  DEFAULT_AVATAR,
  loadSavedAvatar,
  saveAvatarToStorage,
  saveStoredUser,
  UserProfile,
} from "../dashboard/avatarStorage";
import "../../src/auth.css";

interface AuthPageProps {
  initialMode?: "login" | "signup";
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [name, setName] = useState("Alex Vance");
  const [email, setEmail] = useState("alex@nocturne.cinema");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation and inline status feedback
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [passcodeHint, setPasscodeHint] = useState("");

  useEffect(() => {
    setMode(initialMode);
    setErrors({});
    setPasscodeHint("");
  }, [initialMode]);

  const validateField = (field: "name" | "email" | "password", val: string) => {
    if (field === "name" && mode === "signup" && !val.trim()) {
      return "Enter a display name for your auditorium seat.";
    }
    if (field === "email") {
      const trimmed = val.trim();
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "Enter an email formatted as name@example.com.";
      }
    }
    if (field === "password" && val.length < 4) {
      return "Enter a passcode of at least four characters.";
    }
    return undefined;
  };

  const handleFieldBlur = (field: "name" | "email" | "password", val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = {
      name: mode === "signup" ? validateField("name", name) : undefined,
      email: validateField("email", email),
      password: validateField("password", password),
    };
    setTouched({ name: true, email: true, password: true });
    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.email || nextErrors.password) {
      return;
    }

    setIsSubmitting(true);

    const avatar = loadSavedAvatar();
    const userProfile: UserProfile = {
      name: mode === "signup" ? (name.trim() || "Cinephile") : (name || "Alex Vance"),
      email: email.trim() || "alex@nocturne.cinema",
      tier: "VIP Director",
      isLoggedIn: true,
      avatarConfig: avatar,
    };

    saveStoredUser(userProfile);
    saveAvatarToStorage(avatar);

    setTimeout(() => {
      navigate("/dashboard");
    }, 350);
  };

  const handleDemoSignIn = () => {
    setIsSubmitting(true);
    const demoUser: UserProfile = {
      name: "Alex Vance",
      email: "alex@nocturne.cinema",
      tier: "VIP Director",
      isLoggedIn: true,
      avatarConfig: DEFAULT_AVATAR,
    };
    saveStoredUser(demoUser);
    saveAvatarToStorage(DEFAULT_AVATAR);

    setTimeout(() => {
      navigate("/dashboard");
    }, 300);
  };

  const handleForgotPasscode = () => {
    setPasscodeHint("Local preview: no mail server is connected, so use any passcode or the demo pass below.");
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="auth-brand" aria-label="Nocturne private cinema home">
          <NocturneLogo size={34} glow={false} />
          <span className="auth-brand-words">
            <strong className="auth-brand-name">Nocturne</strong>
            <span className="auth-brand-sub">Private cinema</span>
          </span>
        </Link>

        <Link to="/" className="auth-back-link">
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Back to theatre</span>
        </Link>
      </header>

      <main className="auth-main">
        <div className="auth-grid">
          <section className="auth-visual-col" aria-label="3D theatre entrance">
            <figure
              className="auth-stage-frame"
              aria-label="Interactive 3D exterior entrance to Nocturne Screen 04"
            >
              <TheatreEntranceScene entering={isSubmitting} />
            </figure>
          </section>

          <section className="auth-form-col" aria-labelledby="auth-heading">
            <div className="auth-tabs" role="tablist" aria-label="Account mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className="auth-tab"
                onClick={() => setMode("login")}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className="auth-tab"
                onClick={() => setMode("signup")}
              >
                Create pass
              </button>
            </div>

            <h1 id="auth-heading" className="auth-heading">
              {mode === "login" ? "Step into your seat" : "Create your pass"}
            </h1>
            <p className="auth-lead">
              {mode === "login"
                ? "Sign in to open your private screening room."
                : "Create an account to open your private screening room."}
            </p>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {mode === "signup" && (
                <div className="auth-field">
                  <label className="auth-label" htmlFor="auth-name">
                    Display name
                  </label>
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "auth-name-help" : undefined}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (touched.name) {
                        setErrors((prev) => ({ ...prev, name: validateField("name", e.target.value) }));
                      }
                    }}
                    onBlur={(e) => handleFieldBlur("name", e.target.value)}
                    placeholder="Alex Vance"
                    className="auth-input"
                  />
                  {errors.name && (
                    <p id="auth-name-help" className="auth-help auth-help--error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-email">
                  Email address
                </label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "auth-email-help" : undefined}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) {
                      setErrors((prev) => ({ ...prev, email: validateField("email", e.target.value) }));
                    }
                  }}
                  onBlur={(e) => handleFieldBlur("email", e.target.value)}
                  placeholder="name@nocturne.cinema"
                  className="auth-input"
                />
                {errors.email && (
                  <p id="auth-email-help" className="auth-help auth-help--error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="auth-field">
                <div className="auth-label-row">
                  <label className="auth-label" htmlFor="auth-password">
                    Passcode
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={handleForgotPasscode}
                      className="auth-text-action"
                    >
                      Forgot passcode?
                    </button>
                  )}
                </div>
                <div className="auth-input-wrap">
                  <input
                    id="auth-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="auth-password-help"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) {
                        setErrors((prev) => ({ ...prev, password: validateField("password", e.target.value) }));
                      }
                    }}
                    onBlur={(e) => handleFieldBlur("password", e.target.value)}
                    placeholder="At least 4 characters"
                    className="auth-input auth-input--with-toggle"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-toggle-vis"
                    aria-label={showPassword ? "Hide passcode" : "Show passcode"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </div>
                <p
                  id="auth-password-help"
                  className={`auth-help ${errors.password ? "auth-help--error" : ""}`}
                  aria-live="polite"
                >
                  {errors.password || passcodeHint}
                </p>
              </div>

              <label className="auth-check-row" htmlFor="auth-remember">
                <input
                  id="auth-remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in on this browser</span>
              </label>

              <div className="auth-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="auth-btn auth-btn--primary"
                >
                  {isSubmitting ? (
                    <span>Opening doors…</span>
                  ) : (
                    <>
                      <span>{mode === "login" ? "Enter theatre" : "Create pass"}</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDemoSignIn}
                  className="auth-btn auth-btn--quiet whitespace-nowrap"
                >
                  <span>Demo pass: Alex Vance</span>
                </button>
              </div>

              <p className="auth-switch-note">
                {mode === "login" ? "New to Nocturne?" : "Already have a pass?"}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="auth-switch-btn"
                >
                  {mode === "login" ? "Create a pass" : "Sign in"}
                </button>
              </p>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
