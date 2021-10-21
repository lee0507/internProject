import { graphConfig, subsConfig } from "./authConfig";

/**
 * @param accessToken 
 */

// 로그인 정보 받아오기
export async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

// 구독 정보 받아오기
export async function callSubs(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(subsConfig.subsEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

// 나머지 정보 받아오기(같은 함수로 재사용)
export async function callMT(accessToken, endpoint) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(endpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}