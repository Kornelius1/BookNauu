import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { KineticText } from "@/components/ui/kinetic-text";

import {
    registerSchema,
    type RegisterFormData,
} from "@/schemas/auth.schema";

import {
    register as registerService,
} from "@/services/auth.service";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function RegisterForm() {

    const navigate = useNavigate();

    const [registerError, setRegisterError] =
        useState("");


    const {
        control,
        register,
        handleSubmit,

        formState: {
            errors,
            isSubmitting,
        },

    } = useForm<RegisterFormData>({

        resolver: zodResolver(registerSchema),

        defaultValues: {

            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",

        },

    });


    /*
     * Watch fields.
     *
     * Digunakan untuk menghapus
     * server error ketika user
     * mulai memperbaiki form.
     */

    const fullName = useWatch({
        control,
        name: "fullName",
    });


    const email = useWatch({
        control,
        name: "email",
    });


    const password = useWatch({
        control,
        name: "password",
    });


    const confirmPassword = useWatch({
        control,
        name: "confirmPassword",
    });


    /*
     * Clear server error
     * ketika user mengubah form.
     */

    useEffect(() => {

        if (registerError) {

            setRegisterError("");

        }

    }, [
        fullName,
        email,
        password,
        confirmPassword,
    ]);


    async function onSubmit(
        data: RegisterFormData
    ) {

        setRegisterError("");


        try {

            await registerService(data);


            /*
             * Register berhasil.
             *
             * User belum otomatis login.
             * Kita arahkan kembali ke login.
             */

            navigate("/login", {

                replace: true,

                state: {
                    registered: true,
                },

            });


        } catch (error) {

            console.error(
                "Registration failed",
                error
            );


            if (axios.isAxiosError(error)) {

                const status =
                    error.response?.status;


                /*
                 * Validation error
                 */

                if (status === 400) {

                    setRegisterError(
                        error.response?.data?.message ??
                        "Invalid registration data."
                    );

                    return;
                }


                /*
                 * Email already exists
                 */

                if (status === 409) {

                    setRegisterError(
                        "An account with this email already exists."
                    );

                    return;
                }


                /*
                 * Forbidden
                 */

                if (status === 403) {

                    setRegisterError(
                        "You don't have permission to register."
                    );

                    return;
                }


                /*
                 * Server error
                 */

                if (status === 500) {

                    setRegisterError(
                        "Server error. Please try again later."
                    );

                    return;
                }


                /*
                 * Generic backend error
                 */

                setRegisterError(
                    error.response?.data?.message ??
                    "Unable to create your account."
                );

                return;

            }


            /*
             * Unknown error
             */

            setRegisterError(
                "Unexpected error occurred."
            );

        }

    }


    return (

        <div className="space-y-8">


            {/* Logo + Title */}

            <div className="text-center">

                <div
                    className="
                        mx-auto
                        mb-5
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-white
                        text-black
                        shadow-lg
                    "
                >

                    <CalendarDays size={26} />

                </div>


                <div className="flex justify-center">

                    <KineticText
                        text="BookNauu"
                        className="
                            text-4xl
                            font-semibold
                            tracking-tight
                            text-white
                        "
                    />

                </div>


                <p
                    className="
                        mt-2
                        text-sm
                        text-zinc-400
                    "
                >

                    Create your account

                </p>

            </div>



            {/* Social Registration */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                "
            >

                <Button
                    type="button"
                    variant="outline"
                    className="
                        h-10
                        border-zinc-800
                        bg-zinc-900
                        text-zinc-200
                        hover:bg-zinc-800
                    "
                >

                    <FaGithub
                        size={16}
                        className="mr-2"
                    />

                    GitHub

                </Button>


                <Button
                    type="button"
                    variant="outline"
                    className="
                        h-10
                        border-zinc-800
                        bg-zinc-900
                        text-zinc-200
                        hover:bg-zinc-800
                    "
                >

                    <FaGoogle
                        size={16}
                        className="mr-2"
                    />

                    Google

                </Button>

            </div>



            {/* Divider */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className="
                        h-px
                        flex-1
                        bg-zinc-800
                    "
                />


                <span
                    className="
                        text-xs
                        text-zinc-500
                    "
                >

                    OR

                </span>


                <div
                    className="
                        h-px
                        flex-1
                        bg-zinc-800
                    "
                />

            </div>



            {/* Form */}

            <form
                onSubmit={
                    handleSubmit(onSubmit)
                }

                className="
                    space-y-4
                "
            >


                {/* Full Name */}

                <div>

                    <Input
                        className="
                            h-11
                            border-zinc-800
                            bg-zinc-900
                            text-white
                            placeholder:text-zinc-500
                            focus-visible:ring-blue-500
                        "

                        type="text"

                        placeholder="Full name"

                        autoComplete="name"

                        {...register("fullName")}
                    />


                    {errors.fullName && (

                        <p
                            className="
                                mt-1
                                text-xs
                                text-red-400
                            "
                        >

                            {
                                errors.fullName.message
                            }

                        </p>

                    )}

                </div>



                {/* Email */}

                <div>

                    <Input
                        className="
                            h-11
                            border-zinc-800
                            bg-zinc-900
                            text-white
                            placeholder:text-zinc-500
                            focus-visible:ring-blue-500
                        "

                        type="email"

                        placeholder="email@example.com"

                        autoComplete="email"

                        {...register("email")}
                    />


                    {errors.email && (

                        <p
                            className="
                                mt-1
                                text-xs
                                text-red-400
                            "
                        >

                            {
                                errors.email.message
                            }

                        </p>

                    )}

                </div>



                {/* Password */}

                <div>

                    <Input
                        className="
                            h-11
                            border-zinc-800
                            bg-zinc-900
                            text-white
                            placeholder:text-zinc-500
                            focus-visible:ring-blue-500
                        "

                        type="password"

                        placeholder="Password"

                        autoComplete="new-password"

                        {...register("password")}
                    />


                    {errors.password && (

                        <p
                            className="
                                mt-1
                                text-xs
                                text-red-400
                            "
                        >

                            {
                                errors.password.message
                            }

                        </p>

                    )}

                </div>



                {/* Confirm Password */}

                <div>

                    <Input
                        className="
                            h-11
                            border-zinc-800
                            bg-zinc-900
                            text-white
                            placeholder:text-zinc-500
                            focus-visible:ring-blue-500
                        "

                        type="password"

                        placeholder="Confirm password"

                        autoComplete="new-password"

                        {...register(
                            "confirmPassword"
                        )}
                    />


                    {errors.confirmPassword && (

                        <p
                            className="
                                mt-1
                                text-xs
                                text-red-400
                            "
                        >

                            {
                                errors.confirmPassword.message
                            }

                        </p>

                    )}

                </div>



                {/* Server Error */}

                {registerError && (

                    <div
                        className="
                            rounded-lg
                            border
                            border-red-500/20
                            bg-red-500/10
                            px-4
                            py-3
                            text-sm
                            text-red-400
                        "
                    >

                        {registerError}

                    </div>

                )}



                {/* Submit */}

                <Button
                    type="submit"
                    disabled={isSubmitting}

                    className="
                        h-11
                        w-full
                        bg-white
                        text-black
                        transition-all
                        hover:bg-zinc-200
                        hover:shadow-lg
                    "
                >

                    {
                        isSubmitting
                            ? "Creating account..."
                            : "Create account"
                    }

                </Button>

            </form>



            {/* Login Link */}

            <p
                className="
                    text-center
                    text-sm
                    text-zinc-500
                "
            >

                Already have an account?{" "}

                <Link
                    to="/login"
                    className="
                        font-medium
                        text-white
                        underline-offset-4
                        hover:underline
                    "
                >
                    Log in
                </Link>

            </p>



            {/* Terms */}

            <p
                className="
                    text-center
                    text-xs
                    text-zinc-500
                "
            >

                By creating an account, you agree to our{" "}

                <span className="text-zinc-400">
                    Terms
                </span>

                {" "}and{" "}

                <span className="text-zinc-400">
                    Privacy Policy
                </span>

                .

            </p>


        </div>

    );
}