"use client";

import { fetchPackageData } from "@/index";
import Link, { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader } from "@/component/loader";
import { Error } from "@/component/error";

type packageDataType = {
    packageVersion: {
        package: {
            ecosystem: string,
            name: string,
        },
        version: string,
    },
    insight: {
        dependencies: {
            package: {
                ecosystem: string,
                name: string,
            },
            version: string,
        }[],
        packagePublishedAt: string,
        registries: string[],
        vulnerabilities: {
            summary: string,
        }[],
        projectInsights: {
            forks: string,
            stars: string,
            issues: {
                open: string,
            },
            project: {
                url: string,
            }
        }[]
    }
}

export default function PageData() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const { ecosystem, name, version } = useParams<{ ecosystem: string, name: string, version: string }>();
    const [packageData, setPackageData] = useState<packageDataType | null>(null);

    useEffect(() => {
        async function callFunc() {
            const response = await fetchPackageData(ecosystem, name, version);
            console.log(response);

            if (response?.insight && Object.keys(response.insight).length === 0) {
                setError(true);
            }
            else {
                setPackageData(response);
            }
            setLoading(false);
        }
        callFunc();
    }, [])

    if (error) return <Error />

    if (loading) return <Loader />

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-start justify-center p-4 bg-gray-300/10 rounded-xl w-100">
                <h1 className="text-2xl font-semibold text-white">Package Details</h1>
                <div className="flex flex-col items-start justify-center mt-4 gap-1">
                    <span>Name: {packageData?.packageVersion.package.name}</span>
                    <span>Ecosystem: {packageData?.packageVersion.package.ecosystem}</span>
                    <span>Version: {packageData?.packageVersion.version}</span>

                    <span>Published Date: {packageData?.insight.packagePublishedAt}</span>
                    <span>Registries: {packageData?.insight.registries[0]} </span>
                    <span>Dependencies : Total {packageData?.insight.dependencies.length} dependencies</span>
                    <span>Vulnerabilities: {packageData?.insight.vulnerabilities[0].summary}</span>

                    <div className="flex flex-col items-start justify-center gap-1">
                        Project Insights:
                        <span> Forks: {packageData?.insight.projectInsights[0].forks}</span>
                        <span> Stars : {packageData?.insight.projectInsights[0].stars}</span>
                        <span> Open Issues: {packageData?.insight.projectInsights[0].issues.open}</span>
                        <span> Url : {packageData?.insight.projectInsights[0].project.url}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}