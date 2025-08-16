// utils/response.js
class Response {
  // Success response
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  // Error response
  static error(
    res,
    message = "Something went wrong",
    statusCode = 500,
    errors = []
  ) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      data: null,
      errors,
    });
  }

  // 404 handler
  static notFound(res, message = "Route not found") {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message,
    });
  }
}

export default Response;
