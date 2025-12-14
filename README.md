# MinimalAppi

A minimalist, zero-dependency library for building robust APIs with Google Apps Script. It provides a simple yet powerful structure for handling routing, authentication, HTTP methods, and standardized JSON responses.

## Features

*   **Endpoint Routing**: Easily map URL endpoints to specific handler functions.
*   **HTTP Method Handling**: Differentiates between `GET` and `POST` requests.
*   **Built-in Authentication**: Optional, token-based authentication for securing endpoints.
*   **Role-Based Access Control**: Restrict endpoint access to specific user roles.
*   **Standardized JSON Responses**: A set of pre-defined (`Success`, `NotFound`, `BadRequest`, etc.) and custom responses.
*   **Error Handling**: Catches and formats server errors into a standard JSON response.
*   **Zero Dependencies**: Just copy the code into your Google Apps Script project.

## Project Setup

1.  Create a new Google Apps Script project.
2.  Create the following five script files in your project:
    *   `Api.js`
    *   `Endpoint.js`
    *   `MethodHandler.js`
    *   `Response.js`
    *   `Responses.js`
3.  Copy the contents of each file from this repository into the corresponding file in your Apps Script project.
4.  Create a `Code.gs` file where you will write your API logic.

## Quick Start Example

Here is a complete example of a simple API. You can place this code in your `Code.gs` file.

```javascript
// --- 1. Define Your Endpoint Handlers ---

// This function will handle requests to the 'get-public-info' endpoint.
function getPublicInfo(data) {
  const response = createResponse(200, "Success", "Public data fetched successfully.");
  response.data = { message: "This is public information!", receivedData: data };
  return response.Json;
}

// This function will handle requests to the 'get-user-data' endpoint and requires authentication.
function getUserData(data) {
  // The 'loggedUser' object is automatically added to the data payload after successful authentication.
  const { loggedUser } = data;
  
  const response = createResponse(200, "Success", "Private user data fetched successfully.");
  response.data = {
    message: `Hello, ${loggedUser.name}! Your role is '${loggedUser.role}'.`,
    userProfile: loggedUser
  };
  return response.Json;
}


// --- 2. Define Your Authentication Logic ---

// This function validates a token. It's called for any endpoint where `authRequired` is true.
function myAuthFunction(token) {
  // In a real application, you would validate the token against a database or a service like Firebase/JWT.
  const users = {
    "token_for_admin_user": { name: "Alice", role: "admin" },
    "token_for_viewer_user": { name: "Bob", role: "viewer" }
  };

  if (!token) {
    return "Token not provided."; // Return a string for a specific auth error message
  }

  const user = users[token];
  
  // Return the user object on success, or null/false on failure.
  return user ? user : null;
}


// --- 3. Define Your API Endpoints ---

// Map endpoint names to their handler functions, methods, and authentication requirements.
const endPoints = {
  'get-public-info': createEndpoint(getPublicInfo, "GET", false),
  'get-user-data': createEndpoint(getUserData, "POST", true, ["admin", "viewer"]), // auth is required, roles 'admin' or 'viewer' allowed
  'admin-only-action': createEndpoint(getUserData, "POST", true, ["admin"]) // auth is required, only role 'admin' allowed
};


// --- 4. Create the API Instance ---

// Pass the endpoints map and the authentication function to create the API.
const api = createApi(endPoints, myAuthFunction);


// --- 5. Implement doGet and doPost ---

// These are the main entry points for your Google Apps Script Web App.
function doGet(e) {
  return Get(e, api);
}

function doPost(e) {
  return Post(e, api);
}
```

## How to Use

### 1. Deploy as a Web App

*   In the Apps Script editor, click `Deploy` > `New deployment`.
*   Select `Web app` as the deployment type.
*   For `Execute as`, choose `Me`.
*   For `Who has access`, choose `Anyone`. This does **not** mean anyone can access your data; it just means anyone can send a request to the script's URL. Your API's authentication logic will control access.
*   Click `Deploy`. Copy the provided Web app URL.

### 2. Making Requests

Use the Web app URL you just copied.

#### GET Request

`GET` requests pass data via query parameters. The `data` parameter should be a URL-encoded JSON string.

**Example:** Calling the `get-public-info` endpoint.

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?endpoint=get-public-info&data={"id":123}
```

**Response:**
```json
{
  "statusCode": 200,
  "reason": "Success",
  "description": "Public data fetched successfully.",
  "data": {
    "message": "This is public information!",
    "receivedData": {
      "id": 123
    }
  }
}
```

#### POST Request

`POST` requests send a JSON payload in the request body.

**Example:** Calling the protected `get-user-data` endpoint.

**URL:** `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

**Method:** `POST`

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "endpoint": "get-user-data",
  "token": "token_for_admin_user",
  "data": {
    "somePayload": "someValue"
  }
}
```

**Response:**
```json
{
  "statusCode": 200,
  "reason": "Success",
  "description": "Private user data fetched successfully.",
  "data": {
    "message": "Hello, Alice! Your role is 'admin'.",
    "userProfile": {
      "name": "Alice",
      "role": "admin"
    }
  }
}
```

## API Reference

### Core Functions

#### `createApi(endPoints, auth)`
Creates and returns a new API instance.
*   `endPoints` (Object): An object mapping endpoint names to their definitions created by `createEndpoint`.
*   `auth` (Function): Your custom authentication function. It receives the `token` from the request and should return a user object upon success, `null`/`false` on failure, or a `string` for a specific error message.

#### `createEndpoint(fn, method, authRequired, roles)`
Creates an endpoint definition object.
*   `fn` (Function): The handler function to execute for this endpoint. It receives the `data` payload from the request.
*   `method` (String): The required HTTP method (`"GET"` or `"POST"`).
*   `authRequired` (Boolean): If `true`, the `auth` function will be called to validate the request's token. Defaults to `false`.
*   `roles` (Array<String>): An optional array of user roles that are allowed to access this endpoint. If authentication succeeds, the returned user object must have a `role` property that is included in this array.

#### `createResponse(statusCode, reason, description, data)`
Creates a custom `ApiResponse` object.
*   `statusCode` (Number): The HTTP status code (e.g., `200`).
*   `reason` (String): The HTTP reason phrase (e.g., `"Success"`).
*   `description` (String): A developer-friendly description of the response.
*   `data` (Object | any): The payload to be returned.

### Standard Responses
The library includes a set of pre-configured, immutable responses for common scenarios.

*   `Success` (200)
*   `Created` (201)
*   `NoContent` (204)
*   `BadRequest` (400)
*   `Unauthorized` (401)
*   `Forbidden` (403)
*   `NotFound` (404)
*   `MethodNotAllowed` (405)
*   `InternalServerError` (500)

**Usage:**
```javascript
function findItem(data) {
    const item = someDatabaseLookup(data.id);
    if (!item) {
        return NotFound.Json; // Returns a standard 404 response
    }
    // ...
}