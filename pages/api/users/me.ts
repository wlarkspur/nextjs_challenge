import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "../../../lib/withSession";
import db from "../../../lib/db"

export interface ResponseType {
    
    [key: string]: any;
  }

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "GET") {
        const {
            session: { user }
        } = req;
        
        if (!user?.id) {
            return res.status(401).json({ok: false, error: "Unauthorized (("})
        }
        const dbUser = await db.user.findUnique({
            where: {
                id: user?.id
            }
        });
        if (!dbUser) {
            return res.status(404).end();
        }
        return res.send({ ok:true, ...dbUser });
    
    }
       
}

export default withApiSession(handler)