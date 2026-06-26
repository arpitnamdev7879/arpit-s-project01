import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
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
} as const

export type DataKey = {tag: "Complaint", values: readonly [u64]} | {tag: "Counter", values: void} | {tag: "Admin", values: void} | {tag: "CitizenComplaints", values: readonly [string]} | {tag: "DepartmentComplaints", values: readonly [string]};


export interface Complaint {
  citizen: string;
  created_at: u64;
  deadline: u64;
  department: string;
  description: string;
  id: u64;
  officer: Option<string>;
  resolved_at: Option<u64>;
  status: string;
  title: string;
  urgency: u32;
}

export interface Client {
  /**
   * Construct and simulate a get transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get: ({complaint_id}: {complaint_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Complaint>>

  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  init: ({admin}: {admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a assign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  assign: ({admin, complaint_id, officer}: {admin: string, complaint_id: u64, officer: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a submit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  submit: ({citizen, department, title, description, urgency, deadline}: {citizen: string, department: string, title: string, description: string, urgency: u32, deadline: u64}, options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a resolve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  resolve: ({officer, complaint_id}: {officer: string, complaint_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a escalate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  escalate: ({admin, complaint_id}: {admin: string, complaint_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_by_citizen transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_by_citizen: ({citizen}: {citizen: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<Complaint>>>

  /**
   * Construct and simulate a get_by_department transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_by_department: ({department}: {department: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<Complaint>>>

  /**
   * Construct and simulate a get_department_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_department_count: ({department}: {department: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAADZ2V0AAAAAAEAAAAAAAAADGNvbXBsYWludF9pZAAAAAYAAAABAAAH0AAAAAlDb21wbGFpbnQAAAA=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAACUNvbXBsYWludAAAAAAAAAEAAAAGAAAAAAAAAAAAAAAHQ291bnRlcgAAAAAAAAAAAAAAAAVBZG1pbgAAAAAAAAEAAAAAAAAAEUNpdGl6ZW5Db21wbGFpbnRzAAAAAAAAAQAAABMAAAABAAAAAAAAABREZXBhcnRtZW50Q29tcGxhaW50cwAAAAEAAAAQ",
        "AAAAAAAAAAAAAAAEaW5pdAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
        "AAAAAQAAAAAAAAAAAAAACUNvbXBsYWludAAAAAAAAAsAAAAAAAAAB2NpdGl6ZW4AAAAAEwAAAAAAAAAKY3JlYXRlZF9hdAAAAAAABgAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAAAAAApkZXBhcnRtZW50AAAAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAHb2ZmaWNlcgAAAAPoAAAAEwAAAAAAAAALcmVzb2x2ZWRfYXQAAAAD6AAAAAYAAAAAAAAABnN0YXR1cwAAAAAAEAAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAd1cmdlbmN5AAAAAAQ=",
        "AAAAAAAAAAAAAAAGYXNzaWduAAAAAAADAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAADGNvbXBsYWludF9pZAAAAAYAAAAAAAAAB29mZmljZXIAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAGc3VibWl0AAAAAAAGAAAAAAAAAAdjaXRpemVuAAAAABMAAAAAAAAACmRlcGFydG1lbnQAAAAAABAAAAAAAAAABXRpdGxlAAAAAAAAEAAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAHdXJnZW5jeQAAAAAEAAAAAAAAAAhkZWFkbGluZQAAAAYAAAABAAAABg==",
        "AAAAAAAAAAAAAAAHcmVzb2x2ZQAAAAACAAAAAAAAAAdvZmZpY2VyAAAAABMAAAAAAAAADGNvbXBsYWludF9pZAAAAAYAAAAA",
        "AAAAAAAAAAAAAAAIZXNjYWxhdGUAAAACAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAADGNvbXBsYWludF9pZAAAAAYAAAAA",
        "AAAAAAAAAAAAAAAOZ2V0X2J5X2NpdGl6ZW4AAAAAAAEAAAAAAAAAB2NpdGl6ZW4AAAAAEwAAAAEAAAPqAAAH0AAAAAlDb21wbGFpbnQAAAA=",
        "AAAAAAAAAAAAAAARZ2V0X2J5X2RlcGFydG1lbnQAAAAAAAABAAAAAAAAAApkZXBhcnRtZW50AAAAAAAQAAAAAQAAA+oAAAfQAAAACUNvbXBsYWludAAAAA==",
        "AAAAAAAAAAAAAAAUZ2V0X2RlcGFydG1lbnRfY291bnQAAAABAAAAAAAAAApkZXBhcnRtZW50AAAAAAAQAAAAAQAAAAQ=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get: this.txFromJSON<Complaint>,
        init: this.txFromJSON<null>,
        assign: this.txFromJSON<null>,
        submit: this.txFromJSON<u64>,
        resolve: this.txFromJSON<null>,
        escalate: this.txFromJSON<null>,
        get_by_citizen: this.txFromJSON<Array<Complaint>>,
        get_by_department: this.txFromJSON<Array<Complaint>>,
        get_department_count: this.txFromJSON<u32>
  }
}