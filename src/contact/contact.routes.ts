import { FastifyInstance } from "fastify";
import { z, ZodError } from "zod";
import { ContactService } from "./contact.service";

export async function contactRoutes(app: FastifyInstance) {
  const objContacts = new ContactService();

  app.get("/:id", async (request, reply) => {
    try {
      const zodSchema = z.object(
        { id: z.string().uuid("UUID invalid") },
        { required_error: "User`s ID missing" },
      );

      const { id } = zodSchema.parse(request.params);

      const contact = await objContacts.getContactById(id);
      return reply.status(200).send(contact);
    } catch (e) {
      console.log(e);
      let msgError = e instanceof ZodError ? e.errors[0].message : "";
      if (!msgError) {
        msgError = e instanceof Error ? e.message : "Unknown error";
      }
      return reply.status(400).send({ error: msgError });
    }
  });

  app.get("/user/:id", async (request, reply) => {
    try {
      const zodSchemaParams = z.object(
        {
          id: z.string().uuid("UUID invalid"),
        },
        { required_error: "User ID required" },
      );

      const { id } = zodSchemaParams.parse(request.params);

      const contacts = await objContacts.getContactsByUser(id);
      return reply.status(200).send(contacts);
    } catch (e) {
      console.log(e);
      let msgError = e instanceof ZodError ? e.errors[0].message : "";
      if (!msgError) {
        msgError = e instanceof Error ? e.message : "Unknown error";
      }
      return reply.status(400).send({ error: msgError });
    }
  });

  app.post("/", async (request, reply) => {
    try {
      const zodSchema = z.object(
        {
          name: z.string({ required_error: "Name is required" }),
          email: z.string().email("e-mail is invalid"),
          phone: z.string({ required_error: "phone is required" }),
          user_id: z.string({ required_error: "user id required" }).uuid("ID invalid"),
        },
        { required_error: "Contact`s data missing" },
      );

      const { name, email, phone, user_id } = zodSchema.parse(request.body);

      const emailExists = await objContacts.getContactByEmail(email);

      if (emailExists) {
        throw new Error("E-mail already exists");
      }

      const inserted = await objContacts.createContact({ name, email, phone, user_id });
      return reply.status(201).send(inserted);
    } catch (e) {
      console.log(e);
      let msgError = e instanceof ZodError ? e.errors[0].message : "";
      if (!msgError) {
        msgError = e instanceof Error ? e.message : "Unknown error";
      }
      return reply.status(400).send({ error: msgError });
    }
  });

  app.delete("/:id", async (request, reply) => {
    try {
      const zodSchema = z.object(
        { id: z.string().uuid("UUID invalid") },
        { required_error: "User`s ID missing" },
      );

      const { id } = zodSchema.parse(request.params);

      const deleted = await objContacts.deleteContact(id);

      return reply.status(200).send(deleted);
    } catch (e) {
      console.log(e);
      let msgError = e instanceof ZodError ? e.errors[0].message : "";
      if (!msgError) {
        msgError = e instanceof Error ? e.message : "Unknown error";
      }
      return reply.status(400).send({ error: msgError });
    }
  });

  app.patch("/:id", async (request, reply) => {
    try {
      const zodSchemaParams = z.object(
        { id: z.string({ required_error: "Contact ID missing" }).uuid("UUID invalid") },
        { required_error: "User`s ID missing" },
      );

      const { id } = zodSchemaParams.parse(request.params);

      const zodSchemaBody = z.object(
        {
          name: z.optional(z.string()),
          email: z.optional(z.string().email("e-mail is invalid")),
          phone: z.optional(z.string()),
        },
        { required_error: "Contact`s data missing" },
      );

      const { name, email, phone } = zodSchemaBody.parse(request.body);

      const oldData = await objContacts.getContactById(id);

      if (!oldData) {
        throw new Error("Contact not found");
      }

      const updated = await objContacts.updateContact(id, {
        name: name || oldData.name,
        email: email || oldData.email,
        phone: phone || oldData.phone,
      });

      return reply.status(200).send(updated);
    } catch (e) {
      console.log(e);
      let msgError = e instanceof ZodError ? e.errors[0].message : "";
      if (!msgError) {
        msgError = e instanceof Error ? e.message : "Unknown error";
      }
      return reply.status(400).send({ error: msgError });
    }
  });
}
