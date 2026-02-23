import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import InputErrorMessage from "../components/InputErrorMessage";
import Input from "../components/ui/Input";
import { LOGIN_FORM } from "../data";
import { loginSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import Button from "../components/ui/Button";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);

    try {
      const { status, data: resData } = await axiosInstance.post(
        "auth/local",
        data,
      );
      if (status === 200) {
        toast.success("You will navigate to the home page after 2 seconds", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-contetn",
          },
        });

        localStorage.setItem("loggedInUser", JSON.stringify(resData));

        setTimeout(() => location.replace("/"), 2000);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 1500,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renederLoginForm = LOGIN_FORM.map(
    ({ name, placeholder, type, validation }, idx) => (
      <div key={idx}>
        <Input
          {...register(name, validation)}
          placeholder={placeholder}
          type={type}
        />
        {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
      </div>
    ),
  );

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renederLoginForm}
        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
