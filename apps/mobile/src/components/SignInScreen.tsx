import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthActions } from "@convex-dev/auth/react";

export function SignInScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignIn = flow === "signIn";

  const handleSubmit = async () => {
    setError(null);
    if (!email || !password) {
      setError("Email et mot de passe requis.");
      return;
    }
    if (!isSignIn && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      // Same Password provider + flow contract as the web app.
      await signIn("password", { email, password, flow });
    } catch {
      setError(
        isSignIn
          ? "Échec de la connexion. Vérifiez vos identifiants."
          : "Échec de l'inscription. L'email est peut-être déjà utilisé."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1 justify-center px-6"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text className="text-3xl font-bold text-center text-gray-900">
          {isSignIn ? "Connexion" : "Inscription"}
        </Text>
        <Text className="mt-2 mb-8 text-center text-gray-500">
          {isSignIn
            ? "Connectez-vous à votre compte"
            : "Créez un nouveau compte"}
        </Text>

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
          placeholder="Mot de passe"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        {!isSignIn && (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
            placeholder="Confirmer le mot de passe"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />
        )}

        {error && (
          <Text className="text-red-600 mb-4 text-center">{error}</Text>
        )}

        <Pressable
          className="bg-blue-600 rounded-lg py-3 items-center active:opacity-80"
          style={loading ? { opacity: 0.6 } : undefined}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">
              {isSignIn ? "Se connecter" : "S'inscrire"}
            </Text>
          )}
        </Pressable>

        <Pressable
          className="mt-6 items-center"
          onPress={() => {
            setFlow(isSignIn ? "signUp" : "signIn");
            setError(null);
          }}
          disabled={loading}
        >
          <Text className="text-blue-600">
            {isSignIn
              ? "Pas de compte ? S'inscrire"
              : "Déjà un compte ? Se connecter"}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
