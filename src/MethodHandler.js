function Get(e, api) {

    try {
        const request = {
            method: "GET",
            data: e.parameter.data && JSON.parse(e.parameter.data),
            endpoint: e.parameter.endpoint,
            token: e.parameter.token
        }
        const result = api.handleRequest(request);
        return result;
    } catch (error) {
        return createResponse(500, "Internal Server Error", error.message).Json;
    }

}

function Post(e, api) {


    try {
        const parsedPostData = JSON.parse(e.postData.contents);
        const request = {
            method: "POST",
            data: parsedPostData.data,
            endpoint: parsedPostData.endpoint,
            token: parsedPostData.token
        }
        const result = api.handleRequest(request);
        return result;
    } catch (error) {
        return createResponse(500, "Internal Server Error", error.message).Json;
    }
}