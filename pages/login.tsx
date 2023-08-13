import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"

interface IForm {
    email: string;
  }


export default function Login() {
    const { register, handleSubmit } = useForm<IForm>()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const onValid = async (data: IForm) => {
        if (!loading) {
        setLoading(true) 
            const request = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(data)
            })
           
            if (request.status === 200) {
                router.push("/")
            } else {
                setLoading(false);
            }
        };
    }
    useEffect(()=>{},[])
    return (<div className="m-2">
        <h1 className="text-2xl font-bold mb-5">Log in</h1>
        <form onSubmit={handleSubmit(onValid)} className="flex flex-col">
            <label className="text-xl font-bold">Email</label>
            <input className="border border-solid border-blue-300  w-[30%] mb-2" type="text" {...register("email")} />
            <button className="border border-solid w-[30%]">
                {loading ? "Loading..." :"Log in"}
            </button>
        </form>
    </div>)
}