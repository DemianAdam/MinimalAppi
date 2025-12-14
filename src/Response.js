function createResponse(statusCode, reason, description, data) {
    return new ApiResponse(statusCode, reason, description, data);
}

class ApiResponse {
  constructor(statusCode, reason, description, data) {
    if (!statusCode || typeof (statusCode) !== 'number') {
      throw new Error("Response should have a status code of type 'number'.");
    }


    if (!reason || !description) {
      throw new Error("Response should have a reason and description.");
    }
    this.statusCode = statusCode;
    this.reason = reason;
    this.description = description;

    if (data) {
      if (typeof (data) === "object") {
        for (const p in data) {
          this[p] = data[p]
        }

      }
      else {
        this.data = data;
      }
    }
  }

  set setData(data) {
    data = null;
    if (data instanceof Object) {
      for (const p in data) {
        this[p] = data[p]
      }
    }
    else {
      this.data = data;
    }
  }

  get Json() {
    return ContentService
      .createTextOutput(JSON.stringify(this))
      .setMimeType(ContentService.MimeType.JSON);
  }
}