
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "../../../../lib/withSession";
import db from "../../../../lib/db"

export interface ResponseType {
    [key: string]: any;
  }

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        query: { id },
        session: { user }
        } = req

    if (req.method === "POST") {
        const alreadyExists = await db.fav.findFirst({
            where: {
                tweetId: +id,
                userId: user?.id
            }
        });
        if (alreadyExists) {
            await db.fav.delete({
                where: {
                    id: alreadyExists.id
                }
            })
        } else {
            await db.fav.create({
                data: {
                    user: {
                        connect: {
                            id: user?.id
                        }
                    },
                    tweet: {
                        connect: {
                            id: +id
                        }
                    }
                }
            })
        }
        res.json({ok:true})
    }
    if (req.method === "GET") {
        return res.json({error: "This request is not permitted, only PUT request allowed."})
    }
}

export default withApiSession(handler)