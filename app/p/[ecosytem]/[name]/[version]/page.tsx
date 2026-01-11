"use client";

import { fetchPackageData } from "@/index";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader } from "@/component/loader";

export default function PageData() {
    const [loading, setLoading] = useState<boolean>(true);
    const { ecosytem, name, version } = useParams<{ ecosytem: string, name: string, version: string }>();
    const [packageData, setPackageData] = useState("");

    useEffect(() => {
        async function callFunc() {
            const response = await fetchPackageData(ecosytem, name, version);
            console.log(response);
            setLoading(false);
        }
        callFunc();
    }, [])

    if (loading) {
        return <Loader />
    }

    return (
        <div>{packageData}</div>
    );
}