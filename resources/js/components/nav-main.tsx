import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { menuItems, Method } from '@/lib/menu';
import { isSameUrl } from '@/lib/utils';

import { Link, usePage } from '@inertiajs/react';

export function NavMain() {
    const page = usePage();
    const user = page.props.auth.user;

    return (
        <SidebarGroup className="">
            <SidebarMenu>
                {menuItems.map((section) => (
                    <div className="flex flex-col gap-2" key={section.title}>
                        <span className="text-gray-400 font-light my-4">
                            {section.visible.includes(user.role) === true ? section.title : ''}
                        </span>

                        {section.items.map((item) => {
                            if (!item.visible.includes(user.role)) return null;

                            return (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isSameUrl(page.url, item.href)}
                                        tooltip={{ children: item.label }}
                                    >
                                        <Link
                                            href={item.href}
                                            method={item.method as Method}
                                            prefetch
                                        >
                                            {item.icon}
                                            <span className="">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </div>
                ))}

            </SidebarMenu>
        </SidebarGroup>
    );
}
