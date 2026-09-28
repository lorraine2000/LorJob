// routes/cloudinary.ts
import { Hono } from 'hono';
import { getSignedUploadParams } from '@jobi/api-utils/cloudinary';

export const cloudinaryService = new Hono()
.get('/signature', async (c) => {
  const signatureData = getSignedUploadParams();
  return c.json(signatureData);
});
