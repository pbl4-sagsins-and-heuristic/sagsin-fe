import { SocketConnection } from "@/socket/socket";
import { useEffect, useMemo, useState } from "react";
import type { Socket } from "socket.io-client";
import LinkDetail from "@/components/links/link-detail";

export default function LinkManagement() {
    const [links, setLinks] = useState<any[]>([]);
    const [srcQuery, setSrcQuery] = useState("");
    const [destQuery, setDestQuery] = useState("");

    const filtered = useMemo(() => {
        const s = srcQuery.trim().toLowerCase();
        const d = destQuery.trim().toLowerCase();
        return links.filter((l) => {
            const src = (l.srcNode || "").toLowerCase();
            const dest = (l.destNode || "").toLowerCase();
            const srcOk = !s || src.includes(s);
            const destOk = !d || dest.includes(d);
            return srcOk && destOk;
        });
    }, [links, srcQuery, destQuery]);

    useEffect(() => {
        const socket: Socket = SocketConnection.getInstance();
        const handleLinkUpdate = (data: any) => {
            if (Array.isArray(data)) setLinks(data);
            else if (data) setLinks([data]);
        };
        socket.on("link-updated", handleLinkUpdate);
        socket.emit("get-links");
        return () => {
            socket.off("link-updated", handleLinkUpdate);
        };
    }, []);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="bg-muted/50 rounded-xl p-6 min-h-[70vh] w-full">
                <h2 className="text-xl font-bold mb-4">Links Management</h2>
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <input
                        type="text"
                        value={srcQuery}
                        onChange={(e) => setSrcQuery(e.target.value)}
                        placeholder="Search source (hostname or IP)"
                        className="w-full md:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring"
                    />
                    <input
                        type="text"
                        value={destQuery}
                        onChange={(e) => setDestQuery(e.target.value)}
                        placeholder="Search destination (hostname or IP)"
                        className="w-full md:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring"
                    />
                </div>
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1">
                        {filtered.map((l) => (
                            <LinkDetail key={l._id || `${l.srcNode}-${l.destNode}`} link={l} />
                        ))}
                    </div>
                ) : (
                    <div className="text-muted-foreground">No links found.</div>
                )}
            </div>
        </div>
    );
}