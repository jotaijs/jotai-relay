/**
 * @generated SignedSource<<a00fba1822e3747633509e7535c0da5d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CountryFilterInput = {
  code?: StringQueryOperatorInput | null;
  continent?: StringQueryOperatorInput | null;
  currency?: StringQueryOperatorInput | null;
};
export type StringQueryOperatorInput = {
  eq?: string | null;
  glob?: string | null;
  in?: ReadonlyArray<string | null> | null;
  ne?: string | null;
  nin?: ReadonlyArray<string | null> | null;
  regex?: string | null;
};
export type AppCountriesQuery$variables = {
  filter?: CountryFilterInput | null;
};
export type AppCountriesQuery$data = {
  readonly countries: ReadonlyArray<{
    readonly name: string;
  }>;
};
export type AppCountriesQuery = {
  response: AppCountriesQuery$data;
  variables: AppCountriesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filter"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "filter",
        "variableName": "filter"
      }
    ],
    "concreteType": "Country",
    "kind": "LinkedField",
    "name": "countries",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AppCountriesQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AppCountriesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "11f9c4f05031ba86112beb46f16fb079",
    "id": null,
    "metadata": {},
    "name": "AppCountriesQuery",
    "operationKind": "query",
    "text": "query AppCountriesQuery(\n  $filter: CountryFilterInput\n) {\n  countries(filter: $filter) {\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "9c4afe5e7cb82d3ec7aff5768a489db1";

export default node;
