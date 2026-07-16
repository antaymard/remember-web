import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";
import toast from "react-hot-toast";

export const Route = createFileRoute("/signin")({
  component: RouteComponent,
});

function PasswordInput({
  id,
  name,
  placeholder,
  disabled,
  showPassword,
  onToggleVisibility,
}: {
  id: string;
  name: string;
  placeholder: string;
  disabled: boolean;
  showPassword: boolean;
  onToggleVisibility: () => void;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        autoComplete="off"
        required
        className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        tabIndex={-1}
      >
        {showPassword ? <TbEyeOff size={18} /> : <TbEye size={18} />}
      </button>
    </div>
  );
}

function RouteComponent() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    if (step === "signUp") {
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas.");
        setIsLoading(false);
        return;
      }
      formData.delete("confirmPassword");
    }

    try {
      await signIn("password", formData);
      navigate({ to: "/" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : step === "signIn"
          ? "Échec de la connexion. Vérifiez vos identifiants."
          : "Échec de l'inscription. L'email est peut-être déjà utilisé."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {step === "signIn" ? "Connexion" : "Inscription"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === "signIn"
              ? "Connectez-vous à votre compte"
              : "Créez un nouveau compte"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                disabled={isLoading}
              />
            </div>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Mot de passe"
              disabled={isLoading}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((v) => !v)}
            />
            {step === "signUp" && (
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                disabled={isLoading}
                showPassword={showConfirmPassword}
                onToggleVisibility={() => setShowConfirmPassword((v) => !v)}
              />
            )}
          </div>

          <input name="flow" type="hidden" value={step} />

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Chargement..."
                : step === "signIn"
                ? "Se connecter"
                : "S'inscrire"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setStep(step === "signIn" ? "signUp" : "signIn");
                setError(null);
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
            >
              {step === "signIn"
                ? "Pas de compte ? S'inscrire"
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
