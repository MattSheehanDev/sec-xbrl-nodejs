
namespace Attributes {

    export const statements = {
        // Statement of Financial Position & Parenthetical
        BalanceSheetRoot: 'StatementOfFinancialPositionAbstract',
        // Income Statement & Other Comprehensive Income
        IncomeStatementRoot: 'IncomeStatementAbstract',
        // Statement of Stockholders Equity
        StockholdersEquityRoot: 'StatementOfStockholdersEquityAbstract',
        // Statement of Cash Flows
        CashFlowRoot: 'StatementOfCashFlowsAbstract',
        // Statement of Direct Cash Flows
        DirectCashFlowRoot: 'OperatingCashFlowsDirectMethodAbstract',
        // Statement of Partners Capital
        PartnersCapitalRoot: 'StatementOfPartnersCapitalAbstract'
    }


    export const types = {
        money: 'xbrli:monetaryItemType',
        str: 'xbrli:stringItemType',
        shares: 'xbrli:sharesItemType',
        perShare: 'num:perShareItemType',
        date: 'xbrli:dateItemType'
    }

    export const units = {
        usd: 'usd',
        usdPerShare: 'usdPerShare',
        shares: 'shares'
    }

}

export default Attributes;

