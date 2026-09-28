"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { AUTH_EMAIL_EXPIRATION_MINUTES, OTP_LENGTH } from "@jobi/constants";
import {
  getAPIErrorMessage,
  getBetterAuthErrorMessage,
  getErrorMessage,
} from "@jobi/utils/errors";
import { formatTime } from "@jobi/utils/helpers";
import { AuthContainer } from "apps/platform/src/components/pages/auth-container";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "apps/platform/src/components/ui/input-otp";
import { authClient } from "apps/platform/src/lib/clients/auth-client";
import { honoClient } from "apps/platform/src/lib/clients/hono-client";
import { useUserStore } from "apps/platform/src/lib/store/user-store";
import { LoadingButton } from "apps/platform/src/components/ui/loading-button";

// ✅ Schéma de validation Zod
const schema = z.object({
  otp: z
    .string()
    .length(OTP_LENGTH, `Le code doit comporter ${OTP_LENGTH} chiffres.`)
    .regex(/^\d+$/, "Le code doit contenir uniquement des chiffres."),
});

type FormValues = z.infer<typeof schema>;

export default function SignUpVerifyEmailPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SignUpVerifyEmailContent />
    </Suspense>
  );
}

function SignUpVerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const userData = useUserStore((state) => state.value);
  const setUser = useUserStore((state) => state.setValue);
  const [timeLeft, setTimeLeft] = useState(AUTH_EMAIL_EXPIRATION_MINUTES * 60);

  const [isLoading, setIsLoading] = useState(true);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
  });
  useEffect(() => {
    if (!email) return;

    if (userData.isInitialized) {
      if (userData.user?.emailVerified) {
        // déjà vérifié
        router.push("/dashboard");
      } else {
        setIsLoading(false);
      }
    }
  }, [email, userData.isInitialized, userData.user, router]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const resendOtp = useCallback(async () => {
    if (!email) return;
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      if (response.error)
        throw new Error(getBetterAuthErrorMessage(response.error));
      toast.success("Un nouveau code vous a été envoyé.");
      setTimeLeft(AUTH_EMAIL_EXPIRATION_MINUTES * 60);
    } catch (err) {
      toast.error(getAPIErrorMessage(err));
    }
  }, [email]);

  if (!email) {
    router.push("/sign-up");
    return null;
  }

  if (isLoading || !userData.isInitialized) {
    return (
      <div className="w-full h-full flex items-center justify-center mt-52">
        <Loader2 className="animate-spin text-foreground" size={32} />
      </div>
    );
  }

  const onSubmit = async ({ otp }: FormValues) => {
    try {
      const response = await authClient.emailOtp.verifyEmail({ email, otp });
      const error = response.error;
      if (error) throw new Error(getBetterAuthErrorMessage(error));

      let updatedUser = userData.user;//098448

      if (!updatedUser) {
        const session = await honoClient.api.user.platform.session.$get();
        if (!session.ok) return null;
        updatedUser = await session.json();
      }

      setUser({ ...userData, user: updatedUser });

      toast.success("Votre email a bien été vérifié !");
      if (updatedUser.emailVerified) {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AuthContainer
      title="Vérifiez votre email"
      subtitle={`Un code de validation a été envoyé à ${email}. Veuillez le saisir ci-dessous.`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="otp" className="text-sm text-white font-medium">
            Code de vérification
          </label>
          <InputOTP
            maxLength={OTP_LENGTH}
            value={watch("otp")}
            onChange={(value) => setValue("otp", value)}
          >
            <InputOTPGroup>
              {Array.from({ length: OTP_LENGTH }, (_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {errors.otp && (
            <span className="text-red-500 text-sm mt-1">
              {errors.otp.message}
            </span>
          )}
        </div>

        <LoadingButton type="submit" variant="default" disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Vérification..." : "Vérifier mon email"}
        </LoadingButton>
      </form>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {timeLeft > 0 ? (
          <p>
            Vous pourrez renvoyer un code dans{" "}
            <span className="font-semibold text-white">
              {formatTime(timeLeft)}
            </span>
          </p>
        ) : (
          <LoadingButton
            type="submit"
            variant="default"
            onClick={resendOtp}
            className="font-medium"
          >
            Renvoyer le code
          </LoadingButton>
        )}
      </div>
    </AuthContainer>
  );
}
