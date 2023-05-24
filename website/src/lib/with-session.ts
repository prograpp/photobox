import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next";

type ApiRouteHandlers = {
  delete?: NextApiHandler;
  get?: NextApiHandler;
  post?: NextApiHandler;
  put?: NextApiHandler;
};

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "arbol",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  ttl: 86400, // 1 day
};

export const withSessionRoute = (handlers: ApiRouteHandlers) => {
  return withIronSessionApiRoute((req, res) => {
    let handler: NextApiHandler | undefined;
    if (req.method === "DELETE" && handlers.delete) {
      handler = handlers.delete;
    } else if (req.method === "GET" && handlers.get) {
      handler = handlers.get;
    } else if (req.method === "POST" && handlers.post) {
      handler = handlers.post;
    } else if (req.method === "PUT" && handlers.put) {
      handler = handlers.put;
    }
    if (handler === undefined) {
      res.status(405).send("Method Not Allowed");
      return;
    }

    return handler(req, res);
  }, sessionOptions);
};

export const withSessionSSR = <P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) => {
  return withIronSessionSsr((context) => {
    return handler(context);
  }, sessionOptions);
};
