
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "../../../../lib/withSession";
import db from "../../../../lib/db"
import TweetsId from "../../../tweet/[id]";

export interface ResponseType {
    [key: string]: any;
  }

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        query:{id},
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
                }
            }
        });
        if (!tweetContents) {
            return res.status(404).end();
        }
        res.send({ ...tweetContents });
        return res.redirect("/")
    }
    if (req.method === "GET") {
        
        const tweets = await db.tweet.findFirst({
            where: {
                id: +id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                    }
                },
                fav: true
                
            }
        })
        const isLiked = Boolean(
            await db.fav.findFirst({
            where: {
                tweetId: tweets?.id,
                userId: user?.id
                },
                select: {
                    id: true
                }
            })
        )
        res.json({...tweets, isLiked})
    }
}

export default withApiSession(handler)