import { z } from "zod";

/**
 * Schema for validating contact information.
 *
 * @property {string} name - The name of the contact.
 * @property {string} phone - The phone number of the contact, must be at least 10 characters long.
 * @property {string} relation - The relation of the contact to the user.
 */
export const ContactSchema = z.object({
  name: z.string(),
  phone: z.string().min(10),
  relation: z.string(),
});

/**
 * Schema for validating updated contact information.
 * Extends the ContactSchema with an additional id field.
 *
 * @property {number} id - The unique identifier of the contact.
 */
export const ContactUpdateSchema = ContactSchema.extend({
  id: z.number(),
});

/**
 * Type definition for contact data transfer object.
 * Inferred from ContactSchema.
 */
export type ContactDTO = z.infer<typeof ContactSchema>;

/**
 * Type definition for updated contact data transfer object.
 * Inferred from ContactUpdateSchema.
 */
export type ContactUpdateDTO = z.infer<typeof ContactUpdateSchema>;
