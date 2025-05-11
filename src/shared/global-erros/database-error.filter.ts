import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { QueryFailedError } from "typeorm";
import { Request } from "express";

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const error = exception as any;

    if (error?.code === "23505") {
      return this.handleDuplicateKeyError(error, request, response);
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: "Database operation failed",
      error: this.extractErrorDetails(error),
    });
  }

  private handleDuplicateKeyError(error: any, request: Request, response: Response) {
    const fieldName = this.extractFieldName(error);
    const value = this.extractDuplicateValue(error);

    return response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: `${fieldName} '${value}' already exists`,
      error: "Duplicate key violation",
    });
  }

  private extractFieldName(error: any): string {
    if (error.constraint) {
      const constraint = error.constraint.toLowerCase();
      if (constraint.includes("email")) return "Email";
      if (constraint.includes("username")) return "Username";
    }

    if (error.detail) {
      const match = error.detail.match(/Key \((.*?)\)=/);
      if (match) return match[1].split("_").join(" ");
    }

    return "Field";
  }

  private extractDuplicateValue(error: any): string {
    if (error.detail) {
      const match = error.detail.match(/\)=\((.*?)\)/);
      if (match) return match[1];
    }
    return "value";
  }

  private extractErrorDetails(error: any): string {
    return error.message || "Unknown database error";
  }
}
