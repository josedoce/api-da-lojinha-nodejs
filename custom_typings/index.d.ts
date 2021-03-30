declare namespace Express {
    interface Request {
      usuario: {
        id: string | object,
        token: string;
      };
    }
}