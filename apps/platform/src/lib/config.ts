export const isDevelopment = process.env.NODE_ENV === "development";

const apiBaseUrl = isDevelopment
  ? process.env.NEXT_PUBLIC_NGROK_URL
    ? process.env.NEXT_PUBLIC_NGROK_URL
    : `http://localhost:${process.env.PORT || 1981}`
  : process.env.NEXT_PUBLIC_API_URL;
if (!apiBaseUrl) throw new Error("Missing API_URL for production build");

console.log("info", "Next Init", { apiBaseUrl, isDevelopment });
export const honoBaseUrl = apiBaseUrl.trim();
