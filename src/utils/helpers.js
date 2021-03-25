import { parse } from "querystring";
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

export const getPageQuery = () => parse(window.location.href.split("?")[1]);
