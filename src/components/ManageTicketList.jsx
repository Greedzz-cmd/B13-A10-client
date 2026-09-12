import { ManageTicketCard } from "./ManageTicketCard";

export function ManageTicketList({ tickets, onApprove, onReject }) {
    return (
        <section className="flex flex-col gap-3 md:hidden" aria-label="Ticket management cards">
            {tickets.map((ticket) => (
                <ManageTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onApprove={() => onApprove(ticket.id)}
                    onReject={() => onReject(ticket.id)}
                />
            ))}
        </section>
    );
}