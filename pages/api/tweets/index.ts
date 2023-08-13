

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
    const {
        session: { user },
        body:{message}
    } = req;
    if (req.method === "POST") {
        if (!user?.id) {
            return res.status(401).json({ok: false, error: "Unauthorized (("})
        }
        const tweetContents = await db.tweet.create({
            data: {
                message,        
                user: {
                    connect: {
                        id: user.id
                    }
                },
                
            }
        });
        if (!tweetContents) {
            return res.status(404).end();
        }
        res.send({ ...tweetContents });
        return res.redirect("/")
    }
    if (req.method === "GET") {
        
        const tweets = await db.tweet.findMany({
            include: {
                user: true,
                _count: {
                    select: {
                        fav:true
                    }
                }
            }
        })
    
        res.json({tweets})
    }
}

export default withApiSession(handler)