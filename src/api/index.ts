/* eslint-disable @typescript-eslint/no-explicit-any */
import app from "../app";


export default async function handler(req: any, res: any) {
  app(req, res); // Forward request to Express app
}
