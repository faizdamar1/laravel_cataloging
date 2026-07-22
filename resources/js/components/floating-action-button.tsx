import { Link } from "@inertiajs/react";
import { HomeIcon } from "lucide-react";

export default function FloatingActionButton() {
    return (
        <Link
            href='/dashboard'
            className="fixed bottom-4 right-4 w-12 h-12 bg-forest-500 text-white rounded-full 
                       shadow-lg lg:hidden flex items-center justify-center hover:bg-forest-600 
                       active:scale-95 transition-all z-10"
        >
            <HomeIcon />
        </Link>
    );
}