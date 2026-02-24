import { useState } from 'react';
import { Download, Plus, DollarSign } from 'lucide-react';

export function InvoiceGenerator() {
  const [items, setItems] = useState([{ desc: "Instagram Reel Integration", price: 500 }]);
  
  const total = items.reduce((acc, item) => acc + item.price, 0);

  const addItem = () => setItems([...items, { desc: "", price: 0 }]);

  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-sm max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold flex items-center gap-2">
            📄 Smart Invoice
          </h2>
         <span className="text-sm text-muted-foreground">Invoice #0042</span>
      </div>

      {/* Bill To Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Bill To</label>
          <input type="text" placeholder="Brand Name" className="w-full p-2 border rounded bg-background mb-2" />
          <input type="email" placeholder="billing@brand.com" className="w-full p-2 border rounded bg-background" />
        </div>
        <div className="text-right">
          <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Date Due</label>
          <input type="date" className="p-2 border rounded bg-background" />
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Services</label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input 
              type="text" 
              placeholder="Description" 
              value={item.desc}
              className="flex-1 p-2 border rounded bg-background"
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].desc = e.target.value;
                setItems(newItems);
              }}
            />
            <div className="relative w-32">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input 
                type="number" 
                value={item.price}
                className="w-full p-2 pl-6 border rounded bg-background"
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].price = Number(e.target.value);
                  setItems(newItems);
                }}
              />
            </div>
          </div>
        ))}
        <button onClick={addItem} className="text-sm text-primary flex items-center gap-1 mt-2 hover:underline">
          <Plus className="w-3 h-3" /> Add Item
        </button>
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-center">
        <div>
           <div className="text-sm text-muted-foreground">Total Due</div>
           <div className="text-3xl font-bold text-primary">${total}</div>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90">
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>
    </div>
  );
}