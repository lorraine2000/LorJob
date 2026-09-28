"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { LoadingButton } from "apps/platform/src/components/ui/loading-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "apps/platform/src/components/ui/card";
import { Input } from "apps/platform/src/components/ui/input";
import { signInSchema } from "packages/schemas/signForm.schema";
import z from "zod";
import { useCallback } from "react";
import { useUserStore } from "apps/platform/src/lib/store/user-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "apps/platform/src/lib/clients/auth-client";
import {
  getAPIErrorMessage,
  getBetterAuthErrorMessage,
} from "packages/utils/errors";
import { honoClient } from "apps/platform/src/lib/clients/hono-client";
import { emailSchema } from "packages/schemas/email.schema";

type SignInFormValues = z.infer<typeof signInSchema>;
type emailType = z.infer<typeof emailSchema>;

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const setUser = useUserStore((state) => state.setValue);
  const router = useRouter();


  const sendOtp = useCallback(async (email: emailType) => {
    await authClient.emailOtp
      .sendVerificationOtp({ email, type: "email-verification" })
      .then(() => toast.success(`Code de vérification envoyé à ${email}`))
      .catch((error) => toast.error(getAPIErrorMessage(error)));
  }, []);

  const onSubmit = useCallback(
    async (signInData: SignInFormValues) => {
      try {
        const response = await authClient.signIn.email({
          email: signInData.email,
          password: signInData.password,
        });
        if (response.error) {
          if (response.error.code === "EMAIL_NOT_VERIFIED") {
            sendOtp(signInData.email);
            toast.success(
              "Un code de vérification vous a été envoyé par email."
            );
            router.push(`/verify-email?email=${signInData.email}`);
            return;
          }
          toast.error(
            getBetterAuthErrorMessage({
              status: response.error.status,
              code: response.error.code,
              message: response.error.message,
            })
          );
          return;
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        toast.error(
          getBetterAuthErrorMessage({
            status: 500,
            code: "UNKNOWN_ERROR",
            message: "An unknown error occurred",
          })
        );
        return;
      }

      const userResponse = await honoClient.api.user.platform.session.$get();
      if (!userResponse.ok) {
        const { message } = await userResponse.json();
        toast.error(message);
        return;
      }

      const data = await userResponse.json();
      setUser({ isInitialized: true, user: data });
      toast.success("Connexion réussie !");
      if (data.emailVerified) {
        router.push("/dashboard");
      }
    },
    [setUser, router, sendOtp]
  );

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bienvenue</CardTitle>
            <CardDescription>
              Connectez-vous avec votre compte Apple ou Google
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  {/* Apple / Google LoadingButtons */}
                  <LoadingButton variant="outline" className="w-full">
                    Se connecter avec Apple
                  </LoadingButton>
                  <LoadingButton variant="outline" className="w-full">
                    Se connecter avec Google
                  </LoadingButton>
                </div>

                <div className="relative text-center text-sm">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Ou connectez-vous avec votre compte
                  </span>
                  <div className="absolute inset-0 top-1/2 border-t border-border z-0" />
                </div>

                {/* Email */}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mot de passe</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <LoadingButton type="submit" className="w-full" isLoading={isSubmitting} >
                  Login
                </LoadingButton>

                <div className="text-center text-sm">
                  Vous n&apos;avez pas de compte ?{" "}
                  <a href="/sign-up" className="underline underline-offset-4">
                    Inscrivez-vous
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          En cliquant sur continuer, vous acceptez nos{" "}
          <a href="#">Conditions d&apos;utilisation</a> et{" "}
          <a href="#">Politique de confidentialité</a>.
        </div>
      </div>
    </div>
  );
}
