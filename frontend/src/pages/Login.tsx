import { motion } from "motion/react";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
    return (
        <main className="relative flex min-h-screen items-center justify-center bg-black px-6">

            {/*
              Latar Belakang Cahaya Manual murni dengan Tailwind CSS
              - circle_at_0%_0% memastikan pusat cahaya ada di pojok kiri atas secara presisi
              - rgba 0.12 memberikan intensitas putih yang pas dan tidak terlalu menyilaukan
              - transparent_60% membuat cahaya memudar secara halus sebelum mencapai tengah layar
            */}
            <div
                className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(255,255,255,0.12)_0%,_transparent_60%)]"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-sm"
            >
                <LoginForm />
            </motion.div>

        </main>
    );
}