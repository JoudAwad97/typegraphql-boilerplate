import { LoginResolver } from "./modules/user/Login";
import "reflect-metadata";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
// @ts-ignore
import { buildSchema, formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import session from "express-session";

import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import { ConfirmResolver } from "./modules/user/ConfirmUser";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, ConfirmResolver],
    // checking for authorization SOLUTION 1
    authChecker: ({ context: { req } }, roles) => {
      // roles --> can be passed from the @Authorization decorator
      // here we can read the user from context
      // and check his permission in the db against the `roles` argument
      // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

      if (req.session.userId) return true;

      return false; // or false if access is denied
    },
  });

  const plugins = [];

  // add graphql playground
  plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());

  const apolloServer = new ApolloServer({
    schema,
    plugins,
    formatError: formatArgumentValidationError,
    context: ({ req }: any) => ({ req }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      // the URL of the client side
      origin: "http://localhost:3000",
    })
  );

  // added this line
  await apolloServer.start();

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "secretforthecookie",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  apolloServer.applyMiddleware({ app });
  app.listen(4000, async () => {
    console.log(`Server started on http://localhost:4000/graphql`);
  });
};

main();
