import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import axiosInstance from "../config/axios.config";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    try {
      const res = await axiosInstance.post("auth/local/register", data);
      console.log(res);
    } catch (error) {
      console.error(error);
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
        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
