export enum Code {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    SERVER_ERROR = 500
}

export const createResponse = (statusCode: number, body?: string) => {
  return {
    body,
    headers: {
      'Content-Type': 'application/json;'
    },
    statusCode
  }
}
