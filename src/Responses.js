var Success =
  new
    ApiResponse(200,
      "Success",
      "The request has succeeded."
    )


var Created = Object.freeze(
  new
    ApiResponse(201,
      "Created",
      "The request has been fulfilled and has resulted in one or more new resources being created.")
)

var NoContent = Object.freeze(
  new
    ApiResponse(204,
      "No Content",
      "The server successfully processed the request and is not returning any content."
    )
)

var BadRequest = Object.freeze(
  new
    ApiResponse(400,
      "Bad Request",
      "The server could not understand the request due to invalid syntax."
    )
)

var Unauthorized = Object.freeze(
  new
    ApiResponse(401,
      "Unauthorized",
      "The client must authenticate itself to get the requestedApiResponse."
    )
)

var Forbidden = Object.freeze(
  new
    ApiResponse(403,
      "Forbidden",
      "The client does not have access rights to the content."
    )
)

var NotFound = Object.freeze(
  new
    ApiResponse(404,
      "Not Found",
      "The server cannot find the requested resource."
    )
)

var MethodNotAllowed = Object.freeze(
  new
    ApiResponse(405,
      "Method Not Allowed",
      "The request method is known by the server but has been disabled and cannot be used."
    )
)

var InternalServerError = Object.freeze(
  new
    ApiResponse(500,
      "Internal Server Error",
      "The server has encountered a situation it doesn't know how to handle."
    )
)