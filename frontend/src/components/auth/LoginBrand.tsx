import { motion } from "framer-motion";

export default function LoginBrand() {

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: -30,
            }}

            animate={{
                opacity: 1,
                x: 0,
            }}

            transition={{
                duration: 0.6,
                ease: "easeOut",
            }}

            className="
                hidden
                lg:block
                text-white
                max-w-lg
            "
        >

            <h1
                className="
                    text-5xl
                    font-bold
                    tracking-tight
                "
            >
                Smart Reservation
            </h1>


            <p
                className="
                    mt-6
                    text-lg
                    text-white/80
                "
            >
                Manage reservations,
                rooms, and schedules
                in one integrated platform.
            </p>


            <div
                className="
                    mt-10
                    space-y-4
                "
            >

                <Feature>
                    Room Management
                </Feature>

                <Feature>
                    Online Reservation
                </Feature>

                <Feature>
                    Payment Integration
                </Feature>

                <Feature>
                    Calendar Synchronization
                </Feature>

            </div>


        </motion.div>
    );
}


function Feature({
                     children,
                 }: {
    children: React.ReactNode
}) {

    return (
        <div
            className="
                flex
                items-center
                gap-3
                text-white/90
            "
        >

            <div
                className="
                    h-2
                    w-2
                    rounded-full
                    bg-white
                "
            />

            <span>
                {children}
            </span>

        </div>
    );
}