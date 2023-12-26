
export interface mTransaction {

    amount: number;

    status?: string;

    orderChannel: string;


    transactionType?: string;

    description: string;

    merchant?: any;

    customer: any;

    loanTenor?: number;

    isTest: boolean;

    agentCode?: string;

}