import { motion } from "framer-motion";

export default function WelcomeBanner({ user }) {
    return (
        <motion.div 
            className="bg-gradient-to-r from-teal-700 to-teal-400 text-white p-6 rounded-xl shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
                        <div className="flex items-center gap-4">
                            <img
                                src={user?.profile_picture || '/images/default-avatar.png'}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                alt="profile"
                            />
                            <h2 className="text-2xl font-semibold">Welcome back, {user?.username || 'there'}!</h2>
                        </div>
            <p className="mt-1 opacity-90">
                Your health, your wealth! Here's a quick look at your recent activity.
            </p>
        </motion.div>
    );
}