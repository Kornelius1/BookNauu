import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { KineticText } from "@/components/ui/kinetic-text";


import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { login as loginService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginFormData) {
        try {
            const response = await loginService(data);
            login(response);

            if (response.user.role === "ROLE_ADMIN") {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/reservations", { replace: true });
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    }

    return (
        <div className="space-y-8">
            {/* Logo + Title */}
            <div className="text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black shadow-lg">
                    <CalendarDays size={26} />
                </div>
                <div className="flex justify-center">
                    <KineticText
                        text="BookNauu"
                        className="text-4xl font-semibold tracking-tight text-white"
                    />
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                    Sign in to your account
                </p>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="h-10 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                >
                    <FaGithub size={16} className="mr-2" />
                    GitHub
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="h-10 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                >
                    <FaGoogle size={16} className="mr-2" />
                    Google
                </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-xs text-zinc-500">OR</span>
                <div className="h-px flex-1 bg-zinc-800" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Input
                        className="h-11 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
                        placeholder="email@example.com"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        className="h-11 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button
                    disabled={isSubmitting}
                    className="h-11 w-full bg-white text-black transition-all hover:bg-zinc-200 hover:shadow-lg"
                >
                    {isSubmitting ? "Signing in..." : "Log in with email"}
                </Button>
            </form>

            <p className="text-center text-xs text-zinc-500">
                By continuing, you agree to our Terms and Privacy Policy.
            </p>
        </div>
    );
}