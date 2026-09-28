"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { signUpFormSchemaClient } from "@jobi/schemas/signForm.schema";
import { uploadImageToCloudinary } from "@jobi/utils/upload-image";

import { Label } from "@radix-ui/react-label";
import { ImagePicker } from "apps/platform/src/components/image-picker";
import { Button } from "apps/platform/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "apps/platform/src/components/ui/card";
import { Input } from "apps/platform/src/components/ui/input";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { honoClient } from "apps/platform/src/lib/clients/hono-client";
import {
  APIContentfulStatusCode,
  APICheckEmailResult,
} from "packages/enums/api";

import { apiAuthErrorMessages } from "packages/i18n/errors/api-auth";
import { apiUserErrorMessages } from "packages/i18n/errors/api-user";
import { unknownErrorMessages } from "packages/i18n/errors/unknown";
import { getKnownError } from "packages/utils/errors";

import { toast } from "sonner";
import { useLocaleStore } from "packages/hooks/store/settings-store";
import { betterAuthErrorMessages } from "packages/i18n/errors/better-auth";

type FormData = z.infer<typeof signUpFormSchemaClient>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpFormSchemaClient),
    defaultValues: {
      objectif_quotidien: 10,
    },
  });

  const locale = useLocaleStore((state) => state.value);
  const router = useRouter();

  const handleEmailCheck = useCallback(
    async (email: string) => {
      const response = await honoClient.api.auth["check-email"].$post({
        json: { email },
      });
      if (response.status === APIContentfulStatusCode.CONFLICT) {
        const data = await response.json();
        const error = getKnownError(data.message, [
          apiAuthErrorMessages,
          apiUserErrorMessages,
        ]);
        toast.error(error.message);
        router.push("/sign-in");
        return false;
      }

      const data = await response.text();
      if (data === APICheckEmailResult.EMAIL_AVAILABLE) return true;
      if (data === APICheckEmailResult.EMAIL_UNVERIFIED) {
        router.push("/verify-email");
        return false;
      }
      toast.error(unknownErrorMessages[locale].unknownError);
      return false;
    },
    [locale]
  );

  const onSubmit = useCallback(
    async (data: FormData) => {
      const file = data.image?.[0];

      try {
        let imageUrl: string | undefined;
        const available = await handleEmailCheck(data.email);
        if (available === false) return;
        if (available === null) {
          toast.error(betterAuthErrorMessages[locale].EMAIL_NOT_VERIFIED);
          return;
        }

        if (data.image) {
          const fileUpload = await uploadImageToCloudinary(file);
          if (!fileUpload) {
            toast.error(
              unknownErrorMessages[locale].unexpectedError(
                "Erreur lors de l'upload de l'image"
              )
            );
            return;
          } else {
            imageUrl = fileUpload;
          }
        } else {
          imageUrl = "";
        }

        const response = await honoClient.api.auth["sign-up"].$post({
          json: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            objectif_quotidien: data.objectif_quotidien,
            image: imageUrl,
          },
        });
        if (response.status === APIContentfulStatusCode.CREATED) {
          toast.success("Inscription réussie !");
          router.push(`/verify-email?email=${data.email}`);
        } else {
          const errorData = await response.json();
          const error = getKnownError(errorData.message, [
            apiAuthErrorMessages,
            apiUserErrorMessages,
          ]);
          toast.error(error.email?.message ?? "Erreur inconnue");
        }
      } catch (error) {
        console.error("Sign up error:", error);
        toast.error(
          unknownErrorMessages[locale].unexpectedError("Erreur inconnue")
        );
      }
    },
    [locale]
  );

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="flex max-h-[600px] flex-col overflow-hidden">
          <CardHeader className="text-center shrink-0">
            <CardTitle className="text-xl">Bienvenue</CardTitle>
            <CardDescription>
              Inscrivez-vous avec votre compte Apple ou Google
            </CardDescription>
          </CardHeader>

          <div className="flex-1 overflow-y-auto px-6">
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 pb-6"
              >
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full">
                    S’inscrire avec Apple
                  </Button>
                  <Button variant="outline" className="w-full">
                    S’inscrire avec Google
                  </Button>
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Ou inscrivez-vous avec
                  </span>
                </div>

                <div className="space-y-4">
                  {/* 🎯 Image Picker */}
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <ImagePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.image?.message &&
                    typeof errors.image.message === "string" && (
                      <p className="text-sm text-red-500">
                        {errors.image.message}
                      </p>
                    )}

                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="objectif_quotidien">
                      Objectif quotidien
                    </Label>
                    <Input
                      id="objectif_quotidien"
                      type="number"
                      step={1}
                      {...register("objectif_quotidien", {
                        valueAsNumber: true,
                        min: 1,
                      })}
                      placeholder="Combien de candidature comptez vous faire par jour?"
                    />
                    {errors.objectif_quotidien && (
                      <p className="text-sm text-red-500">
                        {errors.objectif_quotidien.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="m@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Mot de passe</Label>
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
                </div>

                <div className="mt-4 flex justify-center">
                  <Button type="submit" className="w-60">
                    S’inscrire
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>

          <div className="text-center text-sm p-4 shrink-0">
            Vous avez déjà un compte ?{" "}
            <a href="/sign-in" className="underline underline-offset-4">
              Connectez-vous
            </a>
          </div>
        </Card>

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance mt-4 *:[a]:underline *:[a]:underline-offset-4">
          En cliquant sur continuer, vous acceptez nos{" "}
          <a href="#">Conditions d&apos;utilisation</a> et{" "}
          <a href="#">Politique de confidentialité</a>.
        </div>
      </div>
    </div>
  );
}
