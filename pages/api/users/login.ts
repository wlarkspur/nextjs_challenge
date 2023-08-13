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
    if (req.method === "POST") {
        const {
            body: { email }
        } = req;
        const user = await db.user.findUnique({
            where: {
                    email
                }
        })
        if (!user) {
            return res.status(404).end();
        }
        
        req.session.user = {
            id: user.id
        }
        await req.session.save();
        res.send({ok:true})
        return res.status(200).end()
    }
    return res.status(405).end()
       
}

export default withApiSession(handler)