"use client";

import Loader from "@/components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import React, { ReactNode, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { SessionData } from "@/lib/type";
const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user as SessionData;
  const [loading, setLoading] = useState(true);//加载中。。。

  //因为加载session需要时间，所以使用useEffect
  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);//加载完成
  }, [user]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors: error },

  } = useForm();

  const uploadPhoto = (result: any) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const updateUser = async (data: SessionData) => {
    setLoading(true);//加载中。。。
    try {
      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);//加载完成
      // window.location.reload();
      console.log(user);

    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>

      <form className="lex flex-col gap-9" onSubmit={handleSubmit(updateUser as SubmitHandler<FieldValues>)}>
        <div className="input">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {error?.username && (
          <p className="text-red-500">{error.username.message as ReactNode}</p>
        )}

        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/person.jpg"
            }
            alt="profile"
            className="w-40 h-40 rounded-full my-16"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={uploadPhoto}
            uploadPreset="kdm7bzdm"
          >
            <p className="text-body-bold">Upload new photo</p>
          </CldUploadButton>
        </div>

        <button className="flex items-center justify-center rounded-xl p-3 bg-gradient-to-l
         from-blue-1 to-blue-3 text-body-bold text-white w-[100%]" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
