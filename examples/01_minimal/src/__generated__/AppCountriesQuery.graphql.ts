/**
 * @generated SignedSource<<e8f7073b8bfd111e10199c1d6135c1a8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AppCountriesQuery$variables = {};
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
    "alias": null,
    "args": null,
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppCountriesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppCountriesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "fcc57b51bad56a145681f3d77da8cd00",
    "id": null,
    "metadata": {},
    "name": "AppCountriesQuery",
    "operationKind": "query",
    "text": "query AppCountriesQuery {\n  countries {\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "f6331e1078a75233ad29a4581b4e4f0f";

export default node;
