import { APIAuthError } from "@jobi/enums/errors/api-errors";
import { z } from "zod";

export const emailSchema = z.string().email({ message: APIAuthError.EMAIL_FORMAT_INVALID });