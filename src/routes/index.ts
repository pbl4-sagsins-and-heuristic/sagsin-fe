import Page from "@/dashboard/page";
import NodeManagement from "@/dashboard/node-management";
import NotFound from "@/view/NotFound";
import { createBrowserRouter } from "react-router";
import LinkManagement from "@/dashboard/link-management";
import AlgorithmsManagement from "@/dashboard/algorithims-management";
import EarthDemo from "@/dashboard/earth-demo";
import TimelinesManagement from "@/dashboard/timelines-management";

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
            },
            {
                path: '/',
                Component: EarthDemo
            },
            {
                path: '/timelines-management',
                Component: TimelinesManagement
            }
        ]
    },
    {
        path: '*',
        Component: NotFound
    }
]);