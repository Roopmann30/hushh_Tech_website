import authentication from "./authentication/authentication";
import * as reportService from "./reportService";
import preferencesService from "./preferences";

export { 
  authentication as auth, 
  reportService as reports, 
  preferencesService as preferences 
};

/**
 * Legacy default export maintained for backward compatibility with 
 * existing components. New implementations should use named imports.
 */
const services = {
  authentication,
  reports: reportService,
  preferences: preferencesService,
};

export default services;
