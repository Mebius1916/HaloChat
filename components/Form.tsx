"use client"
import Image from 'next/image'
import { Person, EmailOutlined, LockOutlined } from "@mui/icons-material"
import Link from 'next/link'
import logoImage from '../public/assets/logo.png'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import { SessionData } from '@/lib/type'
import { signIn } from "next-auth/react"
const Form = ({ type }: { type: string }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SessionData>();
  const router = useRouter();
  const onSubmit = async (data: SessionData) => {
    if (type === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/");
      } else {
        toast.error("Something went wrong");
      }
    }
    if (type === "login") {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      })
      if (res?.ok) {
        router.push("/chats");
      }
      if (res?.error) {
        toast.error("Invalid email or password");
      }
    }
  }
  return (
    <div className='w-full h-lvh flex items-center justify-center'>
      <div className="w-1/3 py-7 px-4 max-sm:w-5/6 max-lg:w-2/3 max-xl:w-1/2 
      flex flex-col items-center justify-center gap-6 bg-white rounded-3xl">
        <Image
          src={logoImage}
          alt='logo'
          width={100}
          height={100}
          priority
          className='w-52 h-auto'
        />
        <form className='flex flex-col items-center gap-5'
          onSubmit={handleSubmit(onSubmit)}>
          {/* 如果是register就显示用户名这一行 否则不显示 */}
          {type === 'register' && (
            <>
              <div className='flex items-center justify-between px-5 py-3 rounded-2xl cursor-pointer shadow-2xl'>
                <input
                  defaultValue=""
                  {...register("username", {
                    required: "User is required",
                    validate: (value) => {
                      if (value.length < 3 ||
                        !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                      ) {
                        return 'Username must be at least 3 characters and must contain at least one special character';
                      }
                    }
                  })}
                  type="text"
                  placeholder='Username'
                  className='w-[300px] max-sm:w-full bg-transparent outline-none'
                />
                <Person sx={{ color: "#737373" }} />
              </div>
              {errors.username && (
                <p className='text-red-500'>{errors.username.message as string}</p>
              )}
            </>
          )}
          <div>
            <div className='flex items-center justify-between px-5 py-3 rounded-2xl cursor-pointer shadow-2xl'>
              <input
                defaultValue=""
                {...register("email", {
                  required: "Email is required",
                  validate: (value) => {
                    if (value.length < 3 ||
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return 'Username must be at least 3 characters and must contain at least one special character';
                    }
                  }
                }
                )}
                type="email"
                placeholder='Email'
                className='w-[300px] max-sm:w-full bg-transparent outline-none'
              />
              <EmailOutlined sx={{ color: "#737373" }}></EmailOutlined>
              {errors.email && (
                <p className='text-red-500'>{errors.email.message as string}</p>
              )}
            </div>
          </div>
          <div>
            <div className='flex items-center justify-between px-5 py-3 rounded-2xl cursor-pointer shadow-2xl'>
              <input
                defaultValue=""
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => {
                    if (value.length < 3 ||
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return 'Username must be at least 3 characters and must contain at least one special character';
                    }
                  }
                })}
                type="password"
                placeholder='Password'
                className='w-[300px] max-sm:w-full bg-transparent outline-none'
              />
              <LockOutlined sx={{ color: "#737373" }}></LockOutlined>
              {errors.password && (
                <p className='text-red-500'>{errors.password.message as string}</p>
              )}
            </div>
          </div>
          <button
            className='w-full px-5 py-3 mt-5 mb-7 rounded-xl cursor-pointer  bg-blue-1 hover:bg-indigo-900 text-white text-body-bold'
            type='submit'
          >
            {type === 'register' ? "Join Free" : "Let's chat"}
          </button>
        </form>
        {type === 'register' ? (
          <Link href="/" className='text-base-medium hover:text-cyan-400'>
            <p className='text-center'>Already have an account? Sign In Here</p>
          </Link>
        ) : (
          <Link href="/register" className='text-base-medium hover:text-cyan-400'>
            <p className='text-center'>Don't have an account? Register Here</p>
          </Link>
        )}
      </div>
    </div>
  )
}
export default Form