import { fastify } from "fastify";
import { userRoutes } from "./user/user.routes";
import { contactRoutes } from "./contact/contact.routes";

const app = fastify();

app.register(userRoutes, { prefix: "/users" });
app.register(contactRoutes, { prefix: "/contacts" });

app.listen({ port: 3000 }).then(() => console.log("Server up and running"));
