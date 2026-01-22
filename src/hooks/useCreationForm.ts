import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import type { ZodSchema } from "zod";

interface UseCreationFormOptions<T> {
  defaultValues: T;
  mutationFn: (value: T) => Promise<any>;
  schema: ZodSchema;
  redirectTo?: string;
  onSuccess?: (result: any) => void;
}

export function useCreationForm<T>({
  defaultValues,
  mutationFn,
  schema,
  redirectTo = "/feed",
  onSuccess,
}: UseCreationFormOptions<T>) {
  const navigate = useNavigate();

  return useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        // Filtrer les champs système de Convex avant l'envoi (retirer creator_id et les champs commençant par _)
        const cleanValue = Object.fromEntries(
          Object.entries(value as Record<string, any>).filter(
            ([key]) => !key.startsWith("_") && key !== "creator_id"
          )
        ) as T;

        const result = await mutationFn(cleanValue);
        onSuccess?.(result);
        navigate({ to: redirectTo });
      } catch (error) {
        console.error("Erreur lors de la création:", error);
      }
    },
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: schema as any,
    },
  });
}
