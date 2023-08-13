import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "../../../lib/withSession";
import db from "../../../lib/db"

export interface ResponseType {
    ok: boolean;
    [key: string]: any;
  }

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "POST") {
        const {
            body: { email, name }
        } = req
        
        const userDb = await db.user.findUnique({
            where: {
                email
            }
        })
        if (userDb) {
            return res.status(200).end()
        }
        await db.user.create({
            data: {
                name,
                email
            }
        })
        return res.status(201).end()
    }
   try{ 
    if (req.method === "GET") {
        const {
          session: { user },
        } = req;
  
        if (!user) {
          return res.status(401).json({ ok: false, error: "Unauthorized" });
        }
  
        const profile = await db.user.findUnique({
          where: {
            id: user.id,
          },
        });
  
        if (!profile) {
          return res.status(404).json({ ok: false, error: "Profile not found" });
        }
  
        return res.json({
          profile,
          ok: true,
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return res.status(500).json({ ok: false, error: "Internal Server Error" });
    }
    
}

 export default withApiSession(handler)