Backend Pseudocode — r-products

1. User Authentication

- register(phone, password, name):
  validate phone & password
  if phone exists: return error
  user = UserAccount(phone_number=phone, name=name)
  user.set_password(password)
  save user
  return ok

- login(phone, password):
  user = get user by phone
  if not user or not check_password(password): return error
  token = create_jwt_for(user)
  return token

2. Product Listing

- list_products(filters, page, page_size):
  query = Product.objects.filter(is_active=True)
  apply filters (category, price_range, search)
  order & paginate
  return serialized products

- get_product(product_id):
  product = Product.objects.get(id=product_id)
  return serialized product

3. Wishlist

- add_to_wishlist(user, product_id):
  if Wishlist.objects.filter(user=user, product_id=product_id).exists():
    return already_exists
  create Wishlist(user=user, product_id=product_id)
  return ok

- remove_from_wishlist(user, product_id):
  Wishlist.objects.filter(user=user, product_id=product_id).delete()
  return ok

4. Create Order

- create_order(user, order_data):
  validate cart items and stock
  calculate item prices and subtotal
  apply coupon if any (validate coupon.is_valid())
  total_price = subtotal - coupon_discount
  order = Order.objects.create(user=user, total_price=total_price, status='pending', ...)
  for item in cart:
    OrderItem.objects.create(order=order, product_snapshot_fields...)
    reduce Product.stock accordingly
  enqueue notification task (order created)
  return order

5. Payment Webhook

- handle_payment_webhook(payload):
  verify signature
  order_id = payload.order_ref
  if payload.status == 'success':
    order.status = 'processing'
    order.save()
    enqueue notification
  else:
    order.status = 'pending' or 'cancelled'
    order.save()

6. Reviews

- add_review(user, order_id, rating, review, product_ids=None):
  ensure user ordered those products (optional)
  ProductReview.objects.create(user=user, order_id=order_id, rating=rating, review=review, product_ids=product_ids)
  return ok

7. Coupons

- validate_coupon(code, amount):
  coupon = Coupon.objects.filter(code=code, active=True).first()
  if not coupon or not coupon.is_valid(): return invalid
  discount_amount = coupon.apply_discount(amount)
  return discount_amount

8. Activity Logging

- log_action(action_type, order=None, performed_by=None, action_text):
  ActivityLog.objects.create(action_type=action_type, order=order, performed_by=performed_by, action=action_text)

9. Notifications (async worker)

- send_order_email(order_id):
  order = Order.objects.get(id=order_id)
  build email
  send via email provider

10. Admin operations

- admin_update_stock(product_id, delta):
  product = Product.objects.get(id=product_id)
  product.stock = max(0, product.stock + delta)
  product.save()


This pseudocode serves as a reference for implementing API endpoints and background workers.
