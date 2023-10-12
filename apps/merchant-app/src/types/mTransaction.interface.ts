
export interface mTransaction {

    amount: number;

    status?: string;

    orderChannel: string;

    description: string;

    mid: number;

    customer: any;

    loanTenor?: number;

    isTest: boolean;

    agentCode?: string;

}