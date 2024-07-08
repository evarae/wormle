const lambdaURL = "https://to4zu3blqohst2nhk5xd6kjpd40cdnja.lambda-url.us-east-1.on.aws/";

export async function postStatistic (body: PostStatisticRequestBody): Promise<PostStatisticResponse> {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(body);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    const response = await fetch(lambdaURL, requestOptions);

    if (response.ok && response.body !== null) {
        const json: PostStatisticResponseBody = await response.json();
        return {
            successful: true,
            status: response.status,
            body: json
        }
    }

    return {
        successful:false,
        status: response.status
    }
}

type PostStatisticRequestBody = {
    date: string,
	moveCount: number,
	streak: number,
	secondsToComplete: number
}

export interface PostStatisticResponse {
    successful: boolean,
    status: number,
    body?: PostStatisticResponseBody 
}

interface PostStatisticResponseBody {
    moveCountBetterThanCount: number,
    playerCount: number,
    secondsToCompleteBetterThanCount: number
}