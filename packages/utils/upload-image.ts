import { honoClient } from '@jobi/platform/src/lib/clients/hono-client';

export async function uploadImageToCloudinary(file: File) {
  const res = await honoClient.api.cloudinary.signature.$get();
  const { signature, timestamp, cloudName, apiKey } = await res.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey!);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new Error(data.error?.message || "Erreur lors de l'upload");
  }

  return data.secure_url;
}
