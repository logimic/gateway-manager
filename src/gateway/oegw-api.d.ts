/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface DownloadScriptRequest {
  /**
   * Message type.
   */
  mType: "downloadScript";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  req: {
    /**
     * Name of script.
     */
    name?: string;
    [k: string]: any;
  };
  [k: string]: any;
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface DownloadScriptResponse {
  /**
   * Message type.
   */
  mType: "downloadScript";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  rsp: {
    /**
     * Name of script.
     */
    name: string;
    /**
     * Java Script code.
     */
    script?: string;
    /**
     * Status of readign script.
     */
    status: number;
    [k: string]: any;
  };
  [k: string]: any;
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GetScenarioListRequest {
  /**
   * Message type
   */
  mType: "getScenarioList";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  req: {
    [k: string]: any;
  };
  [k: string]: any;
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GetScenarioListResponse {
  /**
   * Message type.
   */
  mType: "getScenarioList";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  rsp: {
    /**
     * Array of filenames
     */
    files?: string[];
    /**
     * Name of active script...
     */
    activeScript?: string;
    [k: string]: any;
  };
  [k: string]: any;
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GetVersionRequest {
  /**
   * Requests version of Open Edge Gateway server
   */
  mType: "getVersion";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  req: {
    [k: string]: any;
  };
  [k: string]: any;
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GetVersionResponse {
  /**
   * Requests version of Open Edge Gateway server
   */
  mType: "getVersion";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  rsp: {
    /**
     * Version og Open Edge Gateway server software
     */
    version: string;
    [k: string]: any;
  };
  [k: string]: any;
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface TemplateRequest {
  /**
   * Message type - replace 'template' with any your mType
   */
  mType: "template";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  req: {
    [k: string]: any;
  };
  [k: string]: any;
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface TemplateResponse {
  /**
   * Message type - replace 'template' with any your mType
   */
  mType: "template";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  rsp: {
    [k: string]: any;
  };
  [k: string]: any;
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface UploadScriptRequest {
  /**
   * Message type.
   */
  mType: "uploadScript";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  req: {
    /**
     * Name of script.
     */
    name?: string;
    /**
     * Java Script code.
     */
    script?: string;
    [k: string]: any;
  };
  [k: string]: any;
}
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface UploadScriptResponse {
  /**
   * Message type.
   */
  mType: "uploadScript";
  /**
   * Message identification for binding request with response.
   */
  msgId: string;
  rsp: {
    /**
     * Name of script.
     */
    name: string;
    /**
     * Status of readign script.
     */
    status: number;
    [k: string]: any;
  };
  [k: string]: any;
}
