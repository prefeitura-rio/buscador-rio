"use client";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback } from "react";

export const useReCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getReCaptchaToken = useCallback(async (): Promise<string | null> => {
    if (!executeRecaptcha) {
      console.log("reCAPTCHA not available");
      return null;
    }

    try {
      const token = await executeRecaptcha("submit");
      return token;
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      return null;
    }
  }, [executeRecaptcha]);

  return { getReCaptchaToken, isReady: !!executeRecaptcha };
};
