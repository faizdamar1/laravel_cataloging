import FloatingActionButton from "@/components/floating-action-button";
import { PropsWithChildren } from "react";

export default function UserLayout({children}: PropsWithChildren) {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            {/* <div className="w-full max-w-sm mx-auto max-h-full p-4 rounded-2xl shadow-md"> */}
                {children}
            <FloatingActionButton />
            {/* </div> */}
        </div>
    );
}