"use client";

interface Props {
    chart: string;
}

export default function Mermaid({ chart }: Props) {
    return (
        <div className="my-8 overflow-x-auto rounded-lg border bg-muted/50 p-4">
            <pre className="text-sm">
                <code>{chart}</code>
            </pre>
            <p className="mt-2 text-xs text-muted-foreground italic text-center">
                (Mermaid diagram rendering placeholder)
            </p>
        </div>
    );
}
