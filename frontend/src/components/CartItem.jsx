export default function CartItem({ item, onRemove, onChangeQuantity }) {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>{item.product_name}</div>
      <div className="flex gap-2 items-center">
        <input type="number" value={item.quantity} min="1" 
               onChange={(e) => onChangeQuantity(item.id, e.target.value)} 
               className="w-16 border rounded p-1" />
        <button onClick={() => onRemove(item.id)} className="text-red-500">Remove</button>
      </div>
    </div>
  );
}
