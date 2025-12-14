function createApi(endPoints, auth) {
    return new Api(endPoints, auth);
}

class Api {
    constructor(endPoints, auth) {
        if (endPoints === undefined) {
            throw new Error("Endpoints are required");
        }
        this.endPoints = endPoints;
        this.auth = auth;
    }

    handleRequest(request) {
        try {
            const endpoint = request.endpoint;
            if (!request.method || !endpoint) {
                return BadRequest.Json
            }

            const endpointInfo = this.endPoints[endpoint];

            if (!endpointInfo) {
                return NotFound.Json;
            }

            if (request.method !== endpointInfo.method) {
                return MethodNotAllowed.Json;
            }


            if (endpointInfo.handler === undefined) {
                return NotFound.Json;
            }

            if (endpointInfo.authRequired) {
                const validatedUser = this.auth(request.token);
                if (!validatedUser) {
                    return createResponse(401, "Unauthorized", "Invalid token").Json;
                }
                if (typeof (validatedUser) === 'string') {
                    return createResponse(401, "Unauthorized", validatedUser, { data: "none" }).Json;
                }

                if (endpointInfo.roles !== undefined && !endpointInfo.roles.includes(validatedUser.role)) {
                    return createResponse(403, "Forbidden", "Role not allowed", { allowedRoles: endpointInfo.roles, role: validatedUser.role }).Json;
                }

                if (!request.data) {
                    request.data = { loggedUser: validatedUser };
                }
                else {
                    request.data.loggedUser = validatedUser;
                }

            }
            const response = endpointInfo.handler(request.data);
            return response;
        } catch (error) {
            return createResponse(500, "Internal Server Error", `Name: ${error.name}. Message: ${error.message}. File: ${error.fileName}. Line: ${error.lineNumber}.`).Json;
        }
    }
}