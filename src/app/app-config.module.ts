import { NgModule, InjectionToken } from "@angular/core";
import { environment } from "../environments/environment";

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export class AppConfig {
  externalAuthEndpoint: string;
  fileserverBaseURL: string;
  production: boolean;
  disabledDatasetColumns: string[];
  archiveWorkflowEnabled: boolean;
  editMetadataEnabled: boolean;
  editPreviewEnabled: boolean;
  facility: string;
  shoppingCartEnabled: boolean;
}

export const APP_DI_CONFIG: AppConfig = {
  externalAuthEndpoint: environment.externalAuthEndpoint,
  fileserverBaseURL: environment["fileserverBaseURL"] || null,
  production: environment.production,
  disabledDatasetColumns: environment["disabledDatasetColumns"] || [],
  archiveWorkflowEnabled: environment["archiveWorkflowEnabled"] || null,
  editMetadataEnabled: environment["editMetadataEnabled"] || null,
  editPreviewEnabled: environment["editPreviewEnabled"] || null,
  facility: environment["facility"] || null,
  shoppingCartEnabled: environment["shoppingCartEnabled"] || false
};

@NgModule({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: APP_DI_CONFIG
    }
  ]
})
export class AppConfigModule {}
