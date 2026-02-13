import { useEffect, useState } from "react";
import TicketsPerCollection from "../mock/TicketsPerCollection.json";
export function DataTickets() {
    const [dataTicket, setDataTicket] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getDataTicket() {
            const ticketsPerCollection = TicketsPerCollection;
            
            
        }
        getDataTicket();
    }, []);
}