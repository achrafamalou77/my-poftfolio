"use client";

interface Props {
    slug: string;
    initialCount: number;
}

export default function ViewCounter({ initialCount }: Props) {
    return <span>{initialCount} views</span>;
}
