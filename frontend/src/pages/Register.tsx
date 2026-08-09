import { motion } from "motion/react";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {

    return (

        <main
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                bg-zinc-950
                px-6
            "
        >

            {/*
              Latar Belakang Cahaya Manual murni dengan Tailwind CSS
              Sama dengan halaman Login.
            */}

            <div
                className="
                    absolute
                    inset-0
                    z-0
                    bg-[radial-gradient(circle_at_0%_0%,_rgba(255,255,255,0.12)_0%,_transparent_60%)]
                "
            />


            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}

                animate={{
                    opacity: 1,
                    y: 0,
                }}

                transition={{
                    duration: 0.5,
                }}

                className="
                    z-10
                    w-full
                    max-w-sm
                "
            >

                <RegisterForm />

            </motion.div>


        </main>

    );
}