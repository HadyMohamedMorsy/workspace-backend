import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { error } from "console";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    let message: string = exception.message;

    // Check if the exception is a BadRequestException (validation errors)
    if (exception instanceof BadRequestException) {
      const responseBody = exception.getResponse();

      if (Array.isArray(responseBody["message"])) {
        message = Array.isArray(responseBody["message"])
          ? responseBody["message"].join(", ")
          : responseBody["message"];
      }
    }

    // Return the custom response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error,
    });
  }
}
