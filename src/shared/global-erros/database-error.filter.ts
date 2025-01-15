import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { request, Response } from "express";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const error = exception as any;

    const errorMessages = {
      UQ_6236cfa94a940a14729b69d4e64: "The phone number is already taken.",
      UQ_589d633a38525c92dd87f1ee93b: "The WhatsApp number is already registered.",
      UQ_e53ef0697f9d5d933fa075be1c3: "The phone number is already taken.",
      UQ_dbb467625f453730336a9136d6c: "The WhatsApp number is already registered.",
      UQ_6d09f7c3e4ddf573f842bfa51c7: "The Facebook is already registered.",
      UQ_96c8a2ca6771f4e66d01e5270eb: "The Website is already registered.",
      UQ_7dc7f95dd5c92a645c93a9417ba: "Instagram is already registered.",
      UQ_5b43f77b200fd08d92dbf00c5f3: "Linkedin is already registered.",
      UQ_99c39b067cfa73c783f0fc49a61: "The code is already taken.",
      UQ_8e1f623798118e629b46a9e6299: "The phone number is already taken.",
    };

    // Check if the constraint is in the errorMessages object
    if (error.code === "23505" && error.constraint in errorMessages) {
      const message = errorMessages[error.constraint];

      return response.status(409).json({
        statusCode: 409,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
      });
    }

    // Return a generic error response if no specific constraint is found
    return response.status(500).json({
      message: "Unable to process your request at the moment, please try again later.",
      description: `Error connecting to the database: ${exception.message}`,
    });
  }
}
