"use client";

import Swal from "sweetalert2";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Input, Checkbox, Form, Button } from "antd";
import { useEffect, useContext, useState } from "react";

import { getBuildVersionText } from "@/utils";
import { useGetLogo, useLoginMutation } from "@/queries";

import { EyeShowIcon, EyeHideIcon } from "@/assets/icons/actions";

import { UserContext } from "@/contexts/UserContext";

const { Item, useForm } = Form;

export default function Page() {
  const [form] = useForm();
  const { setUser } = useContext(UserContext);

  const { data: logoUrl } = useGetLogo();
  const { mutate, data, isSuccess, isPending, isError } = useLoginMutation();
  const isLoading = isPending && !isSuccess && !isError;

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => mutate(values);

  useEffect(() => {
    if (data) {
      const { success, msg } = data || {};

      if (!success) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: msg,
        });
      } else {
        const store = data?.success || {};
        const permissions = JSON.parse(store?.permission_slug);

        setUser({ permissions, ...store });
        redirect(permissions.includes("dash-view") ? "/dashboard" : "/jobs");
      }
    }
  }, [data, setUser]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#3598dc] p-5">
      <div className="bg-white rounded shadow p-8 w-full sm:w-[350px]">
        <div>
          {logoUrl && (
            <Image
              alt="logo"
              width={500}
              height={500}
              src={logoUrl}
              className="mx-auto"
              style={{ width: 174 }}
            />
          )}
        </div>
        <div className="text-3xl font-medium text-[#7a7a7a] text-center mt-7 mb-6">
          Sign In
        </div>
        <div>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Item
              rules={[{ required: true, message: "Enter email" }]}
              name="email"
            >
              <Input placeholder="Email" name="email" size="large" />
            </Item>
            <Item
              rules={[{ required: true, message: "Enter password" }]}
              name="password"
            >
              <Input
                size="large"
                name="password"
                placeholder="Password"
                type={!showPassword ? "password" : "text"}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="border-0 p-0 m-0 cursor-pointer text-gray-300"
                  >
                    {showPassword ? <EyeHideIcon /> : <EyeShowIcon />}
                  </button>
                }
              />
            </Item>

            <Item name="rememberMe" noStyle>
              <Checkbox
                onChange={(e) =>
                  form.setFieldValue(
                    "remember_me",
                    e.target.checked ? "1" : "0",
                  )
                }
                className="font-semibold"
              >
                Remember me?
              </Checkbox>
            </Item>

            <Button
              block
              htmlType="submit"
              disabled={isLoading}
              className="!bg-[#3598dc] !text-white !font-bold mt-2"
            >
              {isLoading ? "Signing In" : "Sign In"}
            </Button>
          </Form>
        </div>
        <div className="text-center text-sm font-medium mt-3 pb-5">
          {getBuildVersionText()}
        </div>
      </div>
    </div>
  );
}
