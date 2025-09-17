import Page from "@/dashboard/page";
import NodeManagement from "@/dashboard/node-management";
import NotFound from "@/view/NotFound";
import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
    {
        path: '/',
        Component: Page,
        children: [
            {
                path: '/nodes-management',
                Component: NodeManagement
            },
        ]
    },
    {
        path: '*',
        Component: NotFound
    }
]);