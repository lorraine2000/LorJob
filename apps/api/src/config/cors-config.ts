import { BASE_LOCAL_API_URL, BASE_LOCAL_FRONTEND_URL } from "@jobi/constants";

const cleanOrigin = (origin: string) => origin?.replace(/;$/, "").trim();

const ALLOWED_ORIGINS = [
  "https://www.jobtrack.fr",
  process.env.NEXT_PUBLIC_API_URL,
  process.env.BASE_FRONTEND_URL,
  BASE_LOCAL_FRONTEND_URL,
  "http://127.0.0.1:3000",
  BASE_LOCAL_API_URL,
  "https://127.0.0.1:1981",
]
  .filter(Boolean)
  .map((origin) => cleanOrigin(origin!)); // Nettoie + filtre les undefined

const matchOrigin = (origin: string) => {
  const cleaned = cleanOrigin(origin);
  const matched = ALLOWED_ORIGINS.some((allowed) =>
    cleaned.startsWith(allowed)
  );
  console.log("🧩 Origin reçue:", origin);
  console.log("🔍 Origin nettoyée:", cleaned);
  console.log("✅ Match trouvé:", matched);
  return matched;
};

/*const matchOrigin =
  process.env.NODE_ENV === "production"
    ? (origin: string) => {
        const cleaned = cleanOrigin(origin);
        return true; (
          cleaned === "https://www.jobtrack.fr" ||
          cleaned === process.env.NEXT_PUBLIC_API_URL ||
          cleaned === process.env.BASE_FRONTEND_URL
        );
      }
    : (origin: string) => {
        const cleaned = cleanOrigin(origin);
        return (
          cleaned.startsWith(BASE_LOCAL_FRONTEND_URL) ||
          cleaned.startsWith("http://127.0.0.1:3000") ||
          cleaned.startsWith(BASE_LOCAL_API_URL) ||
          cleaned.startsWith("https://127.0.0.1:1981")
        );
      };
*/

export const corsConfig = {
  origin: (origin: string | undefined) => {
    if (!origin) return ""; // CORS simple
    return matchOrigin(origin) ? cleanOrigin(origin) : null;
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
