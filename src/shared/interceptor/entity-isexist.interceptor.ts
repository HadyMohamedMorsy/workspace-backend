import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, throwError } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class EntityIsExistInterceptor {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    private reflector: Reflector, // Reflector will help read metadata
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { entity, idField } = this.reflector.get<{ entity: string; idField: string }>(
      "entity",
      context.getHandler(),
    );
    const id = request.body[idField] || request.params[idField];

    if (!id) {
      return throwError(() => new NotFoundException(`id not exist`));
    }

    const entityIsExist = await this.dataSource.getRepository(entity).findOne({ where: { id } });

    if (!entityIsExist) {
      return throwError(() => new NotFoundException(`this record is not found`));
    }

    return next.handle().pipe();
  }
}
