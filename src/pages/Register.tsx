import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

// Renders
const RegisterPage = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Register to get access!
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="Username" {...register("username")} />
        <Input placeholder="Email address" {...register("email")} />
        <Input placeholder="Password" {...register("password")} />

        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
