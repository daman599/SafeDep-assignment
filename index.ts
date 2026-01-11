"use server"

import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb.js";
import { InsightService } from "@buf/safedep_api.connectrpc_es/safedep/services/insights/v2/insights_connect.js";
import { createPromiseClient, Interceptor } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";

function authenticationInterceptor(token: string, tenant: string): Interceptor {
    return (next) => async (req) => {
        req.header.set("authorization", token);
        req.header.set("x-tenant-id", tenant);
        return await next(req);
    };
}

function actualEcosystem(ecosystem: string): Ecosystem {
    switch (ecosystem.toLowerCase()) {
        case "npm": return Ecosystem.NPM;
        case "pypi": return Ecosystem.PYPI;
        case "maven": return Ecosystem.MAVEN;
        case "go": return Ecosystem.GO;
        case "cargo": return Ecosystem.CARGO;
        case "nuget": return Ecosystem.NUGET;
        case "rubygems": return Ecosystem.GITHUB_REPOSITORY;
        case "rubygems": return Ecosystem.GITHUB_ACTIONS;
        case "rubygems": return Ecosystem.HOMEBREW;
        case "rubygems": return Ecosystem.OPENVSX;
        case "rubygems": return Ecosystem.PACKAGIST;
        case "rubygems": return Ecosystem.TERRAFORM;
        case "rubygems": return Ecosystem.TERRAFORM_PROVIDER;
        case "rubygems": return Ecosystem.TERRAFORM_MODULE;
        case "rubygems": return Ecosystem.VSCODE;
        case "rubygems": return Ecosystem.CARGO;
        case "rubygems": return Ecosystem.HOMEBREW;
        default: return Ecosystem.UNSPECIFIED;
    }
}

export async function fetchPackageData(ecosystem: string, name: string, version: string) {
    // Validate environment variables
    const token = process.env.SAFEDEP_API_KEY;
    if (!token) {
        console.error("SAFEDEP_API_KEY is required");
        process.exit(1);
    }

    const tenantId = process.env.SAFEDEP_TENANT_ID;
    if (!tenantId) {
        console.error("SAFEDEP_TENANT_ID is required");
        process.exit(1);
    }

    // Create transport with authentication
    const transport = createConnectTransport({
        baseUrl: "https://api.safedep.io",
        httpVersion: "1.1",
        interceptors: [authenticationInterceptor(token, tenantId)]
    });

    // Create client and make API call
    const client = createPromiseClient(InsightService, transport);
    const res = await client.getPackageVersionInsight({
        packageVersion: {
            package: {
                ecosystem: actualEcosystem(ecosystem),
                name: name,
            },
            version: version,
        }
    });
    console.log(res.toJson());
    return res.toJson();
}