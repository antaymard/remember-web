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
        const result = await mutationFn(value);
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
