import { ParsedUrlQuery } from 'querystring';

interface Params extends ParsedUrlQuery {
  idAgency: string;
  idMotorized: string;
}
