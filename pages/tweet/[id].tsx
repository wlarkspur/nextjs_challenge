import { User } from "@prisma/client"
import { useRouter } from "next/router"
import useSWR, { useSWRConfig } from "swr"

interface TweetResponse {
    fav: {
        id: number;
        userId: number;
        tweetId: number;
    }
    id: number
    message: string
    user: User
    userId: number
    isLiked: boolean;
}

const TweetsId = () => {
    const router = useRouter();
    const {mutate } = useSWRConfig();
    const { data, mutate:boundMutate } = useSWR<TweetResponse>(router.query.id ? `/api/tweets/${router.query.id}` : null)
    const favClick = () => {
        fetch(`/api/tweets/${router.query.id}/fav`, {
            method: "POST",
            headers: {
                "ContentType":"application/json"
            },
            body:JSON.stringify({})
        })
        
        if (!data) return;
        
        boundMutate((prev) => prev && { ...prev, isLiked: !prev?.isLiked }, false)
        
        console.log(data)
    }
    console.log(data, data?.isLiked)
    return (
        <div className="bg-black w-screen h-screen">
            <div className="p-5 ">
            <h1 className="text-white font-bold">Tweet Message</h1>
            <div className="h-1 w-[275px] border-t-2 border-red-400 my-2"></div>
            <div className="text-white">
                <span>{data?.message}</span>
                <span>{data?.userId}</span>
                    {data?.isLiked ?  <button onClick={favClick} 
                    className="ml-16 border px-3 py-1 rounded-md bg-white text-black font-bold">
                    Like
                </button> : <button onClick={favClick} 
                    className="ml-16 border px-3 py-1 rounded-md bg-black text-white ">
                    Like
                </button> }
            </div>
            
                </div>
        </div>
    )
}

export default TweetsId