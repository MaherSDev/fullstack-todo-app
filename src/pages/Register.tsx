import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { registerSchema } from "../validation/index";
import axiosInstance from "../config/axios.config";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    setIsLoading(true)

    try {
      const {status} = await axiosInstance.post("auth/local/register", data);
      if(status === 200){
        toast.success("You will navigate to the login page after 2 seconds to login!", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-contetn"
          }
        })
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`,{
        position: "bottom-center",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  };

  console.log(errors);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Register to get access!
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {REGISTER_FORM.map(({ name, placeholder, type, validation }, idx) => (
          <div key={idx}>
            <Input
              {...register(name, validation)}
              placeholder={placeholder}
              type={type}
            />
            {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
          </div>
        ))}
        <Button fullWidth isLoading={isLoading}>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
