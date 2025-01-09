import { FastifyInstance } from "fastify";
import { z, ZodError } from "zod";
import { UserService } from "./user.service";

export async function userRoutes(app: FastifyInstance) {
  const objUser = new UserService();

  app.get("/", async (request, reply) => {
    try {
      const users = await objUser.getAllUsers();
      reply.status(200).send(users);
    } catch (e) {
      const msgError = e instanceof Error ? e.message : e;
      return reply.status(400).send({ error: msgError });
    }
  });

  app.post("/", async (request, reply) => {
    try {
      const zodSchema = z.object(
        {
          name: z.string({ message: "name required" }),
          email: z.string({ message: "e-mail required" }).email("invalid e-mail"),
        },
        { required_error: "Name and email required" },
      );

      const validatedBody = zodSchema.parse(request.body);

      const inserted = await objUser.createUser({
        name: validatedBody.name,
        email: validatedBody.email,
      });

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
      const zodObject = z.object({
        id: z.string().uuid("invalid uuid"),
      });

      const { id } = zodObject.parse(request.params);

      const deleted = await objUser.deleteUser(id);
      return reply.status(200).send(deleted);
    } catch (e) {
      let msgError = e instanceof ZodError ? e.errors[0].message : "";
      if (!msgError) {
        msgError = e instanceof Error ? e.message : "Unknown error";
      }
      return reply.status(400).send({ error: msgError });
    }
  });

  app.patch("/:id", async (request, reply) => {
    try {
      const zodParams = z.object({ id: z.string().uuid("invalid UUID") });

      const zodBody = z.object(
        {
          name: z.optional(z.string()),
          email: z.optional(z.string().email("Invalid email")),
        },
        { required_error: "None data received to update" },
      );

      const { id } = zodParams.parse(request.params);

      const { name, email } = zodBody.parse(request.body);

      const userExists = await objUser.getUserById(id);

      if (!userExists) {
        throw new Error("User not found");
      }

      const updated = await objUser.updateUser(id, {
        name: name || userExists.name,
        email: email || userExists.email,
      });

      return updated;
    } catch (e) {
      let msgError = e instanceof ZodError ? e.errors[0].message : "";
      if (!msgError) {
        msgError = e instanceof Error ? e.message : "Unknown error";
      }
      return reply.status(400).send({ error: msgError });
    }
  });
}
