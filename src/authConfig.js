/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig = {
    auth: {
        clientId: "1752caa0-e914-42e2-8fb3-173bb4b8c923",
        authority: "https://login.microsoftonline.com/785087ba-1e72-4e7d-b1d1-4a9639137a66",
        redirectUri: "http://localhost:3000/"
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {		
                    case LogLevel.Error:		
                        console.error(message);		
                        return;		
                    case LogLevel.Info:		
                        console.info(message);		
                        return;		
                    case LogLevel.Verbose:		
                        console.debug(message);		
                        return;		
                    case LogLevel.Warning:		
                        console.warn(message);		
                        return;		
                }	
            }	
        }	
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["User.Read"]
};
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

export const dataRequest = {
    scopes: ["https://management.azure.com/user_impersonation"]
};
export const subsConfig = {
    subsEndpoint: "https://management.azure.com/subscriptions?api-version=2020-01-01"
};
export const rgConfig = {
    rgEndpoint: "https://management.azure.com/subscriptions/bbdeb974-4734-49c2-81d1-68c39d85cbf1/resourcegroups?api-version=2021-04-01",
    rgEndpoint1: "https://management.azure.com/subscriptions/",
    rgEndpoint2: "/resourcegroups?api-version=2021-04-01"
};
export const vmConfig = {
    vmEndpoint: "https://management.azure.com/subscriptions/bbdeb974-4734-49c2-81d1-68c39d85cbf1/resourceGroups/rgLee/providers/Microsoft.Compute/virtualMachines?api-version=2021-03-01",
    vmEndpoint1: "https://management.azure.com",
    vmEndpoint2: "/providers/Microsoft.Compute/virtualMachines?api-version=2021-03-01"
};
export const mtConfig = {
    mtEndpoint: "https://management.azure.com/{resourceUri}/providers/Microsoft.Insights/metrics?api-version=2018-01-01",
    mtEndpoint1: "https://management.azure.com",
    mtEndpointCPU: "/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Percentage CPU&timespan=2021-09-30T07:08/2021-09-30T08:08",
    mtEndpointNetworkIn: "/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Network In Total&timespan=2021-09-30T07:08/2021-09-30T08:08",
    mtEndpointNetworkOut: "/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Network Out Total&timespan=2021-09-30T07:08/2021-09-30T08:08",
    mtEndpointDiskRead: "/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Disk Read Bytes&timespan=2021-09-30T07:08/2021-09-30T08:08",
    mtEndpointDiskWrite: "/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Disk Write Bytes&timespan=2021-09-30T07:08/2021-09-30T08:08",
    mtEndpointDiskReadOperation: "/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Disk Read Operations/Sec&timespan=2021-09-30T07:08/2021-09-30T08:08",
    mtEndpointDiskWriteOperation: "/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Disk Write Operations/Sec&timespan=2021-09-30T07:08/2021-09-30T08:08",
    mtEndpointMemory: "/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Available Memory Bytes&timespan=2021-09-30T07:08/2021-09-30T08:08"
};



