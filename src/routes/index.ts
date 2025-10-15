import Page from "@/dashboard/page";
import NodeManagement from "@/dashboard/node-management";
import NotFound from "@/view/NotFound";
import { createBrowserRouter } from "react-router";
import LinkManagement from "@/dashboard/link-management";
import AlgorithmsManagement from "@/dashboard/algorithims-management";

export const routes = createBrowserRouter([
    {
        path: '/',
        Component: Page,
        children: [
            {
                path: '/nodes-management',
                Component: NodeManagement
            },
            {
                path: '/links-management',
                Component: LinkManagement
            },
            {
                path: '/algorithms-management',
                Component: AlgorithmsManagement
            }
        ]
    },
    {
        path: '*',
        Component: NotFound
    }
]);