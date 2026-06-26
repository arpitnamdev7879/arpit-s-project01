import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CAIN3UH2KIVGAY55LSGRD5I37HI3N3OWXXL2B5PBNM4WWP22BWHLBM53",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAADZ2V0AAAAAAEAAAAAAAAADGNvbXBsYWludF9pZAAAAAYAAAABAAAH0AAAAAlDb21wbGFpbnQAAAA=",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAACUNvbXBsYWludAAAAAAAAAEAAAAGAAAAAAAAAAAAAAAHQ291bnRlcgAAAAAAAAAAAAAAAAVBZG1pbgAAAAAAAAEAAAAAAAAAEUNpdGl6ZW5Db21wbGFpbnRzAAAAAAAAAQAAABMAAAABAAAAAAAAABREZXBhcnRtZW50Q29tcGxhaW50cwAAAAEAAAAQ",
            "AAAAAAAAAAAAAAAEaW5pdAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
            "AAAAAQAAAAAAAAAAAAAACUNvbXBsYWludAAAAAAAAAsAAAAAAAAAB2NpdGl6ZW4AAAAAEwAAAAAAAAAKY3JlYXRlZF9hdAAAAAAABgAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAAAAAApkZXBhcnRtZW50AAAAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAHb2ZmaWNlcgAAAAPoAAAAEwAAAAAAAAALcmVzb2x2ZWRfYXQAAAAD6AAAAAYAAAAAAAAABnN0YXR1cwAAAAAAEAAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAd1cmdlbmN5AAAAAAQ=",
            "AAAAAAAAAAAAAAAGYXNzaWduAAAAAAADAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAADGNvbXBsYWludF9pZAAAAAYAAAAAAAAAB29mZmljZXIAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAGc3VibWl0AAAAAAAGAAAAAAAAAAdjaXRpemVuAAAAABMAAAAAAAAACmRlcGFydG1lbnQAAAAAABAAAAAAAAAABXRpdGxlAAAAAAAAEAAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAHdXJnZW5jeQAAAAAEAAAAAAAAAAhkZWFkbGluZQAAAAYAAAABAAAABg==",
            "AAAAAAAAAAAAAAAHcmVzb2x2ZQAAAAACAAAAAAAAAAdvZmZpY2VyAAAAABMAAAAAAAAADGNvbXBsYWludF9pZAAAAAYAAAAA",
            "AAAAAAAAAAAAAAAIZXNjYWxhdGUAAAACAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAADGNvbXBsYWludF9pZAAAAAYAAAAA",
            "AAAAAAAAAAAAAAAOZ2V0X2J5X2NpdGl6ZW4AAAAAAAEAAAAAAAAAB2NpdGl6ZW4AAAAAEwAAAAEAAAPqAAAH0AAAAAlDb21wbGFpbnQAAAA=",
            "AAAAAAAAAAAAAAARZ2V0X2J5X2RlcGFydG1lbnQAAAAAAAABAAAAAAAAAApkZXBhcnRtZW50AAAAAAAQAAAAAQAAA+oAAAfQAAAACUNvbXBsYWludAAAAA==",
            "AAAAAAAAAAAAAAAUZ2V0X2RlcGFydG1lbnRfY291bnQAAAABAAAAAAAAAApkZXBhcnRtZW50AAAAAAAQAAAAAQAAAAQ="]), options);
        this.options = options;
    }
    fromJSON = {
        get: (this.txFromJSON),
        init: (this.txFromJSON),
        assign: (this.txFromJSON),
        submit: (this.txFromJSON),
        resolve: (this.txFromJSON),
        escalate: (this.txFromJSON),
        get_by_citizen: (this.txFromJSON),
        get_by_department: (this.txFromJSON),
        get_department_count: (this.txFromJSON)
    };
}
