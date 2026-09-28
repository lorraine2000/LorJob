/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LOCALES } from "@jobi/constants";
import { ProfileValues } from "@jobi/types/profil";
import { ProfilSchema } from "@jobi/schemas/profil.schema";
import { uploadImageToCloudinary } from "@jobi/utils/upload-image";
import { unknownErrorMessages } from "@jobi/i18n/errors/unknown";
import { useLocaleStore } from "@jobi/hooks/store/settings-store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "apps/platform/src/components/ui/card";
import { Input } from "apps/platform/src/components/ui/input";
import { Label } from "apps/platform/src/components/ui/label";
import { Button } from "apps/platform/src/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "apps/platform/src/components/ui/select";
import { Form, FormMessage } from "apps/platform/src/components/ui/form";

import { Pencil, Loader2 } from "lucide-react";
import { ImagePicker } from "apps/platform/src/components/image-picker";
import { useUserStore } from "apps/platform/src/lib/store/user-store";
import { toast } from "sonner";
import { honoClient } from "apps/platform/src/lib/clients/hono-client";
import { PlatformUserData } from "packages/api-types";
import { LoadingButton } from "apps/platform/src/components/ui/loading-button";

export default function ProfilePage() {
  const locale = useLocaleStore((state) => state.value);
  const user = useUserStore((state) => state.value.user);
  const setUser = useUserStore((state) => state.setValue);
  const resetUser = useUserStore((state) => state.reset);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(ProfilSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      objectif_quotidien: 0,
      preferredLocale: "fr",
      image: undefined,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const watchedValues = watch();

  const hasChanges = useMemo(() => {
    if (!user) return false;

    const firstNameChanged =
      watchedValues.firstName.trim() !== user.firstName.trim();
    const lastNameChanged =
      watchedValues.lastName.trim() !== user.lastName.trim();
    const objectifChanged =
      watchedValues.objectif_quotidien !== (user.objectif_quotidien ?? 0);
    const localeChanged =
      watchedValues.preferredLocale !== user.preferredLocale;
    const imageChanged =
      !!watchedValues.image && watchedValues.image.length > 0;

    console.log(
      "objectif quotidient: ",
      watchedValues.objectif_quotidien,
      typeof watchedValues.objectif_quotidien
    );
    return (
      firstNameChanged ||
      lastNameChanged ||
      objectifChanged ||
      localeChanged ||
      imageChanged
    );
  }, [watchedValues, user]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        objectif_quotidien: user.objectif_quotidien ?? 0,
        preferredLocale: user.preferredLocale === "en" ? "en" : "fr",
        image: undefined,
      });
      setLoading(false);
    }
  }, [user, reset]);

  const onSubmit = useCallback(
    async (values: ProfileValues) => {
      try {
        let fileUpload;
        if (values.image?.length) {
          fileUpload = await uploadImageToCloudinary(values.image[0]);
          if (!fileUpload) {
            fileUpload = user?.image || null;
            toast.error(
              unknownErrorMessages[locale].unexpectedError(
                "Erreur lors de l'upload de l'image"
              )
            );
          }
        } else {
          fileUpload = user?.image || null;
        }
        const response = await honoClient.api.user.$patch({
          json: {
            firstName: values.firstName,
            lastName: values.lastName,
            objectif_quotidien: values.objectif_quotidien,
            preferredLocale: values.preferredLocale,
            image: fileUpload,
          },
        });
        if (!response.ok) {
          const error = await response.json();
          toast.error(
            unknownErrorMessages[locale].unexpectedError(
              error.message || "Erreur lors de la mise à jour du profil"
            )
          );
          return;
        }
        const updatedUser: PlatformUserData = await response.json();
        resetUser();
        setUser({
          isInitialized: true,
          user: updatedUser,
        });
        toast.success("Profil mis à jour avec succès");
      } catch (error) {
        toast.error(
          unknownErrorMessages[locale].unexpectedError(
            "Erreur lors de la mise à jour du profil"
          )
        );
      }
      setIsEditing(false);
    },
    [locale]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto mt-8 p-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-semibold">
          Profil de {user?.firstName} {user?.lastName}
        </CardTitle>
        <Button
          variant="outline"
          onClick={() => setIsEditing((prev) => !prev)}
          size="sm"
        >
          <Pencil className="w-4 h-4 mr-1" />
          {isEditing ? "Annuler" : "Modifier"}
        </Button>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImagePicker value={field.value} onChange={field.onChange} />
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <FormMessage>{errors.firstName.message}</FormMessage>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <FormMessage>{errors.lastName.message}</FormMessage>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectif_quotidien">Objectif quotidien</Label>
                <Input
                  id="objectif_quotidien"
                  type="number"
                  step={1}
                  {...register("objectif_quotidien", {
                    valueAsNumber: true,
                    min: 1,
                  })}
                />
                {errors.objectif_quotidien && (
                  <FormMessage>{errors.objectif_quotidien.message}</FormMessage>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLocale">Langue préférée</Label>
                <Controller
                  name="preferredLocale"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCALES.map((locale) => (
                          <SelectItem key={locale.value} value={locale.value}>
                            {locale.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.preferredLocale && (
                  <FormMessage>{errors.preferredLocale.message}</FormMessage>
                )}
              </div>

              <CardFooter className="p-0">
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Mise à jour..."
                  disabled={!hasChanges || isSubmitting}
                >
                  Mettre à jour
                </LoadingButton>
              </CardFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  user?.image !== "" && user?.image !== null
                    ? user?.image
                    : "/default-user.svg"
                }
                alt="Photo de profil"
                className="w-24 h-24 rounded-full object-cover border shadow"
              />
              <div className="space-y-1">
                <p className="font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Langue :{" "}
                  {
                    LOCALES.find((l) => l.value === user?.preferredLocale)
                      ?.label
                  }
                </p>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-muted-foreground">
              <p>
                <span className="text-foreground font-medium">Prénom :</span>{" "}
                {user?.firstName}
              </p>
              <p>
                <span className="text-foreground font-medium">Nom :</span>{" "}
                {user?.lastName}
              </p>
              <p>
                <span className="text-foreground font-medium">
                  Objectif quotidien :
                </span>{" "}
                {user?.objectif_quotidien ?? "Non défini"}
              </p>
              <p>
                <span className="text-foreground font-medium">
                  Langue préférée :
                </span>{" "}
                {LOCALES.find((l) => l.value === user?.preferredLocale)?.label}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
