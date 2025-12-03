# Delivery & Payment Flow - Updated

## Overview
The delivery and payment flow has been refactored to provide a cleaner, separated user experience:

1. **Cart Page**: Users select products and proceed to delivery information (no payment options here)
2. **Delivery Information Page**: Users fill delivery details and choose if they want to pay now
3. **Payment Modal** (if Pay Now selected): Users select payment method and enter payment details

## Changes Made

### Backend Changes

#### `backend/order/models.py`
- Updated `Payment` model comments to clarify supported methods: `card`, `nagad`, `rocket`, `bkash`, `cash_on_delivery`

#### `backend/order/views.py` - `OrderBillingView`
- Added `pay_now` boolean field to request payload
- **If `pay_now = true`**: 
  - Validates payment method and required fields
  - Creates Payment record with transaction ID
  - Sets order status to `pending`
  - Logs payment activity
- **If `pay_now = false`**:
  - No payment record created (Cash on Delivery)
  - Sets order status to `pending`
  - Logs "Cash on Delivery" activity

### Frontend Changes

#### `frontend/src/pages/Cart.jsx`
- **Removed**: All payment-related UI (payment method selector, card/mobile fields, payment modal)
- **Simplified**: `handleConfirmOrder` now only creates order and navigates to billing page
- Button text changed to "Proceed to Billing"
- Removed unused state: `showPayment`, `paymentMethod`, `cardInfo`, `mobileInfo`, `paymentLoading`, `orderPayloadState`

#### `frontend/src/pages/OrderBilling.jsx`
- **Renamed**: "Billing Information" → "Delivery Information"
- **Added**: `payNow` checkbox state and `showPaymentModal` state
- **Separated UI**: Delivery form and payment form are now on different pages/modal
- **Delivery Form**: Contains only delivery-related fields (name, phone, address, city, postal code)
- **Payment Modal**: Shows after delivery form submission if `payNow` is checked
  - Payment method selector (Card, Nagad, Rocket, BKash)
  - Card Fields: card_number, expiry, cvc, cardholder_name
  - Mobile Banking Fields: mobile_number, password
  - "Confirm Payment" button
- **Submit Flow**:
  1. User fills delivery information
  2. User checks/unchecks "Pay Now"
  3. User clicks "Confirm Delivery Information"
  4. If Pay Now checked: Payment modal appears
  5. If Pay Now unchecked: Order confirmed with Cash on Delivery directly

## User Flow

### Flow 1: Cash on Delivery
1. User adds products to cart
2. User clicks "Proceed to Billing" in cart
3. Order is created with status "start"
4. User navigates to Delivery Information page
5. User fills delivery information (name, phone, address, city, postal code)
6. User leaves "Pay Now" unchecked
7. User clicks "Confirm Delivery Information"
8. Order is confirmed with Cash on Delivery
9. Order status changes to "pending"
10. Success message shown
11. User redirected to order details page

### Flow 2: Online Payment
1. User adds products to cart
2. User clicks "Proceed to Billing" in cart
3. Order is created with status "start"
4. User navigates to Delivery Information page
5. User fills delivery information (name, phone, address, city, postal code)
6. User checks "Pay Now" checkbox
7. User clicks "Confirm Delivery Information"
8. **Payment modal appears**
9. User selects payment method (Card/Nagad/Rocket/BKash)
10. User fills payment details in the modal
11. User clicks "Confirm Payment"
12. Payment record created with transaction ID
13. Order status changes to "pending"
14. Success message with transaction ID shown
15. User redirected to order details page

## API Payload

### POST `/api/order/{order_id}/billing/`

```json
{
  "phone": "01712345678",
  "first_name": "John",
  "last_name": "Doe",
  "address1": "123 Main St",
  "address2": "Apt 4B",
  "city": "Dhaka",
  "postal_code": "1200",
  "pay_now": true,
  "payment_method": "card",
  "card_number": "4111111111111111",
  "expiry": "12/25",
  "cvc": "123",
  "cardholder_name": "John Doe"
}
```

For mobile banking (nagad/rocket/bkash):
```json
{
  ...billing fields...,
  "pay_now": true,
  "payment_method": "nagad",
  "mobile_number": "01712345678",
  "password": "1234"
}
```

For cash on delivery:
```json
{
  ...billing fields...,
  "pay_now": false
}
```

## Response

### Success Response
```json
{
  "success": true,
  "message": "Order and payment confirmed successfully",
  "order_id": 123,
  "transaction_id": "txn_abc123def456",
  "payment_method": "card"
}
```

Or for cash on delivery:
```json
{
  "success": true,
  "message": "Order confirmed with Cash on Delivery",
  "order_id": 123,
  "payment_method": "cash_on_delivery"
}
```
