import { useForm } from "react-hook-form"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";


interface IForm {
    name?: string;
    email: string;
  }

const CreateAccount = () => {
    const router = useRouter()
    const { register, handleSubmit } = useForm<IForm>()
    const [loading, setLoading] = useState(false);
    const { data } = useSWR("/api/users/me")
    useEffect(() => {
        if (data && data.ok) {
            router.replace("/")
        }
    },[data,router])
    
    const onValid = async (data: IForm) => {
        if (!loading) {
            setLoading(true);
            const request = await fetch("/api/users/create-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (request.status === 201) {
                alert("Created new account, please log in.")
            }
            if (request.status !== 405) {
                router.push("/login")
            }
            setLoading(false)
        }
    }
    return (
        <div className="flex flex-col h-full m-5">
            <h1 className="text-lg font-bold mb-5">Create Account</h1>
            <form onSubmit={handleSubmit(onValid)} className="flex flex-col">
                <div className="w-2">
                    <label className="p-2 text-blue-500" htmlFor="name">Name</label>
                    <input className="border border-solid border-blue-300" type="text"{...register("name")} />
                </div>
                <div className="w-2 ">
                    <label className="p-2 text-blue-500" htmlFor="email">Email</label>
                    <input className="border border-solid border-blue-300" type="text"{...register("email")} />
                </div>
                <button className="border border-solid border-blue-500 mt-5 w-40 ">
                    {loading ? "loading...":"Create Account"}</button>
            </form>
        </div>
    )
} 

export default CreateAccount