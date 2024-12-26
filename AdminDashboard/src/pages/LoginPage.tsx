import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { logUser } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/http/api";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useTokenStore } from "@/zustandStore";
export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<logUser>();
  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      console.log("Login Succesfull", response);
      //after successful login we will store the token in zustand store for later use
      useTokenStore.getState().setToken(response.data.accesToken);
      console.log("Token", useTokenStore.getState().token);
      navigate("/home");
    },
  });
  const onSubmit = async (data: logUser) => {
    const email = data.email;
    const password = data.password;
    // this is basically the same as the fetch request in the previous example making server call with the help of axios instance
    mutation.mutate({ email, password });
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account <br />{" "}
            {mutation.isError && (
              <p className="text-red-500 text-sm">{mutation.error.message}</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 5,
                    message: "Password has min 5 characters.. ",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              <span className="ml-2">Login</span>
            </Button>
          </form>
          {/* <Link to={"http://localhost:8080/auth/google"}>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </Link> */}
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to={"/auth/register"} className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

