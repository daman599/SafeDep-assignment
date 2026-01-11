"use client";

import { fetchPackageData } from "@/index";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
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

const PackageDetails = ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center gap-1">
            <div className="size-2 bg-[#069c85] rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-lg font-bold">{title}: </span>
            {children}
        </div >
    );
}

export default function PackageData() {
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
        <div className="flex items-center justify-center h-screen my-10">
            <div className="flex flex-col items-start justify-center p-4 rounded-xl gap-2">
                <h1 className="text-2xl font-semibold text-white">Package Details</h1>
                <div className="flex flex-col items-start justify-center mt-4 gap-1.5">
                    <PackageDetails title={"Name"}>
                        <span className="text-base font-medium text-gray-200/50" >{packageData?.packageVersion.package.name} </span>
                    </PackageDetails>

                    <PackageDetails title={"Ecosystem"}>
                        <span className="text-base font-medium text-gray-200/50">{packageData?.packageVersion.package.ecosystem}</span>
                    </PackageDetails>

                    <PackageDetails title={"Version"}>
                        <span className="text-base font-medium text-gray-200/50">{packageData?.packageVersion.version} </span>
                    </PackageDetails>

                    <PackageDetails title={"Published Date"}>
                        <span className="text-base font-medium text-gray-200/50">{packageData?.insight.packagePublishedAt}</span>
                    </PackageDetails>

                    <PackageDetails title={"Registries"}>
                        <a href={packageData?.insight.registries[0]} className="text-base font-medium text-gray-200/50" >{packageData?.insight.registries[0]} </a>
                    </PackageDetails>

                    <PackageDetails title={"Dependencies"}>
                        <span className="text-base font-medium text-gray-200/50">Total {packageData?.insight.dependencies.length} dependencies</span>
                    </PackageDetails>

                    <div className="flex flex-col items-start justify-center gap-1">
                        <div className="flex items-center justify-center gap-1">
                            <div className="size-2 bg-[#069c85] rounded-full animate-pulse"></div>
                            <span className="text-gray-300 text-lg font-bold">Vulnerabilities: </span>
                        </div>

                        {packageData?.insight.vulnerabilities.map((vul, i) => (
                            <div key={i} className="flex items-center justify-center gap-1 ml-7">
                                <div className="size-2 bg-orange-600/50 rounded-full "></div>
                                <span className="text-base font-medium text-gray-200/50">{vul.summary}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-start justify-center gap-1">
                        <div className="flex items-center justify-center gap-1">
                            <div className="size-2 bg-[#069c85] rounded-full animate-pulse"></div>
                            <span className="text-gray-300 text-lg font-bold">Project Insights:</span>
                        </div>

                        {packageData?.insight.projectInsights.map((insight, i) =>
                            <div key={i} className="flex flex-col items-start justify-center gap-1 ml-7">
                                <span className="text-base font-medium text-gray-200/50"> Forks: {insight.forks}</span>
                                <span className="text-base font-medium text-gray-200/50"> Stars : {insight.stars}</span>
                                <span className="text-base font-medium text-gray-200/50"> Open Issues: {insight.issues.open}</span>
                                <span className="text-base font-medium text-gray-200/50"> Url : <a href={insight.project.url}>
                                    {packageData?.insight.projectInsights[0].project.url}</a></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}