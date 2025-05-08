import { ZodError } from "zod";

export function formatZodError(error: ZodError) {
  return Object.entries(error.flatten().fieldErrors).flatMap(
    ([field, messages]) =>
      messages?.map((message) => ({ field, message })) ?? []
  );
}
