import { Tweet, User } from "@prisma/client";
import { spawn } from "child_process";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import useSWR from "swr"

interface UserResponse {
    id: number;
    email: string;
    name: string;
    createdAt: string;
}

interface TweetPost {
    message: string;
    isLiked: boolean
}


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

interface TweetLike {
    
    isLiked: boolean
}
interface IUser{
    id: number;
    email: string;
    name: string;
    createdAt: string;
}
interface Message{
    id: number;
    userId: number;
    user: IUser
    message: string;
    isLiked: boolean;
    _count: {
        fav: number
    }
} 
    
interface TweetResponse {
    tweets: Message[];
    isLiked: boolean
}

const Tweets = () => {
    const {register, handleSubmit, reset} =useForm<TweetPost>()
    const router = useRouter()
    const { data } = useSWR<UserResponse>("api/users/me")
    const { data:tweetData, mutate} = useSWR<TweetResponse>("api/tweets")
    const { data:favData, mutate:favMutate} = useSWR<TweetResponse>(router.query.id ? `/api/tweets/${router.query.id}` : null)
    const [loading, setLoading] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const sortedTweets = tweetData?.tweets
    console.log(sortedTweets)
    console.log(tweetData, "트윗데이터")
    const isLoggedIn = data !== undefined
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/create-account")
        }
    },[isLoggedIn, router])
    
    const onValid = async (data: TweetPost) => {
        if (!loading) {
            if (!data.message) {
                return;
            }
            setLoading(true)
           

            await fetch("/api/tweets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }
            )
            setLoading(false)
        } 
        reset()
    }
    const onLike = (data:number) => {
        fetch(`/api/tweets/${data}/fav`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        }
        )
        if (!favData) return
        favMutate({...favData, isLiked: !favData.isLiked},false)
    }
    return (
        <div className="bg-black text-white w-full h-[200vh] min-h-screen flex flex-col relative">

          <div className="text-2xl font-bold fixed flex top-0 z-2 bg-black w-full h-[50px] items-center pl-5 ">
              <h1 className="">Tweet Z</h1>
          </div>
          <div className="ml-20">
                <div className="border border-red-400 w-[600px] h-[200px]  flex mt-[80px] flex flex-col">
                    <span className="m-2">{data?.name}</span>
                    <form onSubmit={handleSubmit(onValid)} className="flex flex-col items-center mt-5">
                        <input className="bg-black h-20 resize-y leading-sung p-2 w-full" type="textarea" placeholder="Tweet 내용을 적어서 친구들과 공유해 보세요." {...register("message")} />
                        <button className="border border-gray-500 mt-4 w-[20%] hover:bg-white hover:text-black">{loading ? "tweeting..." :"Go Tweet"}</button>
                    </form>
                </div>
                
                <div className="mt-10 w-[600px]">
                    {sortedTweets?.map(tweet =>
                        <div className=" p-2 border rounded-md mb-2 flex flex-col" key={tweet.id}>
                            <div className="flex justify-between mb-1 font-bold text-gray-400">
                                <span>{tweet.user.name}</span>
                                <span>{tweet.user.createdAt.slice(0,10)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{tweet.message}</span>
                                <div className="flex items-center">
                                    <a /* onClick={() => onLike(tweet.id)} */ className="flex items-center justify-center rounded-md mr-[2px] w-7 h-7 ">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                         </svg> 
                                        
                                    </a>
                                    <span className="mr-2">{ tweet._count.fav}</span>
                                    <a className="border px-3 py-1 rounded-md"  href={`/tweet/${tweet.id}`}>
                                            More
                                    </a>
                                    
                                </div>
                                
                                
                            </div>
                            
                        </div>
                    )}
                </div>
          </div>
          

        </div>
    )
}

export default Tweets