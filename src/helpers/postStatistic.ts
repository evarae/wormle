const lambdaURL = "https://wormle.com/api/statistic";

export async function postStatistic (body: PostStatisticRequestBody): Promise<PostStatisticResponse> {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(body);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    try {
        const response = await fetch(lambdaURL, requestOptions);

        if (!response.ok) {
            return {
                successful: false,
                status: response.status
            }
        }

        const json: PostStatisticResponseBody = await response.json();
        return {
            successful: true,
            status: response.status,
            body: json
        }

    } catch (error) {
        return {
            successful: false,
            status: 500,
        }
    }
}

export type PostStatisticRequestBody = {
    date: string,
	moveCount: number,
	streak: number,
	secondsToComplete: number,
    hintsUsed: number
}

export interface PostStatisticResponse {
    successful: boolean,
    status: number,
    body?: PostStatisticResponseBody 
}

export interface PostStatisticResponseBody {
    moveCountBetterThanCount: number,
    playerCount: number,
    secondsToCompleteBetterThanCount: number
}