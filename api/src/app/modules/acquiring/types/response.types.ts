export interface IAcquiringStart {
  errorCode?: number;
  errorMessage?: string;
  formUrl: string;
  orderId: string;
}

export interface IAcquiringStatus {
  errorCode?: number;
  errorMessage?: string;
  orderNumber: string;
  orderStatus?: number;
  actionCode: number;
  actionCodeDescription: string;
  userMessage?: string;
  amount: number;
  currency?: number;
  date: string;
  depositeddate?: string;
  orderDescription?: string;
  ip?: string;
  authRefNum?: string;
  refundedDate?: number;
  reverseddate?: number;
  paymentWay?: string;
  avsCode?: string;
  refund?: boolean;
  authDateTime?: string;
  terminalId?: string;
  refunds?: IRefunds[];
  attributes?: IAttributes[];
  transactionAttributes?: ITransactionAttributes[];
  merchantOrderParams?: IMerchantOrderParams[];
  cardAuthInfo?: ICardAuthInfo;
  secureAuthInfo?: ISecureAuthInfo;
  bindingInfo?: IBindingInfo;
  paymentAmountInfo?: IPaymentAmountInfo;
  bankInfo?: IBankInfo;
  payerData?: IPayerData;
  dccInfo?: IDccInfo;
  pluginInfo?: IPluginInfo;
}

interface IRefunds {
  date?: string;
  externalRefundId?: string;
  approvalCode?: string;
  actionCode?: number;
  referenceNumber?: string;
  amount?: string;
}

interface IAttributes {
  name?: string;
  value?: string;
}

interface ITransactionAttributes {
  name?: string;
  value?: string;
}

interface IMerchantOrderParams {
  name?: string;
  value?: string;
}

interface ICardAuthInfo {
  maskedPan?: string;
  expiration?: number;
  cardholdername?: string;
  approvalCode?: string;
  paymentSystem: string;
  product: string;
  productCategory: string;
}

interface ISecureAuthInfo {
  eci?: number;
  authTypeIndicator?: string;
  cavv?: string;
  xid?: string;
  threeDSProtocolVersion?: string;
  rreqTransStatus?: string;
  aresTransStatus?: string;
}

interface IBindingInfo {
  clientId?: string;
  bindingId?: string;
  authDateTime?: string;
  authRefNum?: string;
  terminalId?: string;
}

interface IPaymentAmountInfo {
  approvedAmount?: number;
  depositedAmount?: number;
  refundedAmount?: number;
  paymentState?: string;
}

interface IBankInfo {
  bankName?: string;
  bankCountryCode?: string;
  bankCountryName?: string;
}

interface IPayerData {
  email?: string;
  phone?: string;
  postAddress?: string;
}

interface IDccInfo {
  originalCurrencyAlphaCode?: string;
  originalCurrencyNumericCode?: string;
  originalAmount?: string;
  formattedvalue_?: string;
  value?: string;
  convertedCurrencyAlphaCode?: string;
  convertedCurrencyNumericCode?: string;
  convertedAmount?: string;
  formattedvalue?: string;
  conversionRate?: string;
  feePercentage?: string;
  directConversionRate?: string;
  additionalParams?: any;
}

interface IPluginInfo {
  name?: string;
  params?: any;
}

export interface IOrderBundle {
  orderCreationDate?: string;
  customerDetails?: ICustomerDetails;
  cartItems?: ICartItems;
}

// export interface IOrderBundle {
//   cartItems: {
//     items: {
//       positionId: number;
//       name: string;
//       quantity: { value: number; measure: string };
//       itemAmount: number;
//       itemCode: string;
//     }[];
//   };
// }

interface ICustomerDetails {
  email: string;
  phone: string;
  contact?: string;
  fullName?: string;
  passport?: number;
  deliveryInfo?: IDeliveryInfo;
  inn?: number;
}

interface IDeliveryInfo {
  deliveryType?: string;
  country: string;
  city: string;
  postAddress: string;
}

interface ICartItems {
  items: {
    positionId: number;
    name: string;
    quantity: { value: number; measure: string };
    itemAmount: number;
    itemCode: string;
  }[];
}

//obj
export interface IQuantity {
  value: string;
  measure: string;
}

//obj
export interface IItemDetails {
  itemDetailsParams?: any;
}

//obj
export interface ITax {
  taxType: number;
  taxSum: number;
}

export interface IItemAttributes {
  paymentMethod: number;
  userData?: string;
  agent_info: IAgent_info;
  supplier_info: ISupplier_info;
}

interface ISupplier_info {
  phones?: string[];
  name?: string;
  inn?: string;
}

interface IAgent_info {
  type?: number;
  paying: IAgent_info_paying;
  paymentsOperator: IAgent_info_paymentsOperator;
  MTOperator?: IAgent_info_MTOperator;
}

interface IAgent_info_paying {
  operation?: string;
  phones?: string[];
}

interface IAgent_info_paymentsOperator {
  phones?: string[];
}

interface IAgent_info_MTOperator {
  phones?: string[];
  name?: string;
  address?: string;
  inn?: string;
}

export interface IDiscount {
  discountType: string;
  discountValue: number;
}

export interface IAgentInterest {
  interestType: string;
  interestValue: number;
}
