import authentication from "./authentication/authentication";
import * as reportService from "./reportService";
import preferencesService from "./preferences";

export { 
  authentication as auth, 
  reportService as reports, 
  preferencesService as preferences 
};


const services = {
  authentication,
  reports: reportService,
  preferences: preferencesService,
};

export default services;
