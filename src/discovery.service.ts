import {
  Injectable,
  // OnModuleInit
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';

@Injectable()
// export class AppDiscoveryService implements OnModuleInit {
export class AppDiscoveryService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit() {
    const controllers = this.discoveryService.getControllers();
    controllers.forEach((wrapper) => {
      const { instance } = wrapper;

      if (instance) {
        this.metadataScanner
          .getAllMethodNames(instance)
          .map((methodName) =>
            console.log(`${instance.constructor.name}#${methodName}`),
          );
      }
    });
  }
}
