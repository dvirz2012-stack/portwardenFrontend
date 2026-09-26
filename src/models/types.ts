enum ResponseTypes {

    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    INFO = "INFO",
    PROMPT = "PROMPT"

}

export interface JsonResponse {

    message: string | null,
    data: any | null,
    type: ResponseTypes | null

}

export interface PortInfo {

    pid: number;
    port: number;
    processName: string;
    icon?: string;

}