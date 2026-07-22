import { MenuItem } from "@/types";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Building2, ScanBarcode, UserCheckIcon } from "lucide-react";

export type Method = "get" | "post" | "put" | "delete"

export const menuItems: { title: string; visible: number[]; items: MenuItem[] }[] = [
    {
        title: "MENU",
        visible: [0, 1],
        items: [
            {
                icon: <HomeIcon width={20} height={20} />,
                label: "Dashboard",
                href: "/dashboard",
                method: "get",
                visible: [0, 1],
            },
            {
                icon: <Building2 width={20} height={20} />,
                label: "Item",
                href: "/admin/item",
                method: "get",
                visible: [1],
            },
        ]
    },
    {
        title: "Master",
        visible: [1],
        items: [
            {
                icon: <UserCheckIcon width={20} height={20} />,
                label: "User",
                href: "/admin/user",
                method: "get",
                visible: [1],
            },
        ]
    },
];
