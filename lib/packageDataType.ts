export type packageDataType1 = {
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
