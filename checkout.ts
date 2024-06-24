
interface Products {
    SKU: string,
    Name: string,
    Price: number
}

interface PricingRule {
    applyRule(items: Map<string, number>): void;
}

let products:Products[] =[
    {
        "SKU":"ipd",
        "Name":"Super iPad",
        "Price": 549.99
    },
    {
        "SKU":"mbp",
        "Name":"MacBook Pro",
        "Price": 1399.99
    },
    {
        "SKU":"atv",
        "Name":"Apple TV",
        "Price": 109.50
    },
    {
        "SKU":"vga",
        "Name":"VGA adapter",
        "Price": 30.00
    }
]
export class checkout {
    private scannedItems:any;
    private pricingRules:PricingRule[];
    constructor(pricingRules){
        this.scannedItems=new Map();
        this.pricingRules=pricingRules;
    }

    scan(item:string){
        if(this.scannedItems.has(item)){
            this.scannedItems.set(item,this.scannedItems.get(item)+1)
        }else{
            this.scannedItems.set(item,1)
        }
    }

    total(){
        let total=0
        this.applyPricingRules()
        console.log("items in cart-->",this.scannedItems);
        this.scannedItems.forEach((value:any,key:any)=> {
            const product= products.find((item)=> item.SKU==key)
            if(product){
                total+=value*product.Price;
            }
        });
        return `$${total}`;
    }

    private applyPricingRules() {
        this.pricingRules.forEach(rule => {
            rule.applyRule(this.scannedItems);
        });
    }
}

class BulkDiscountPricingRule implements PricingRule {
    private sku: string;
    private bulkQuantity: number;
    private bulkPrice: number;

    constructor(sku: string, bulkQuantity: number, bulkPrice: number) {
        this.sku = sku;
        this.bulkQuantity = bulkQuantity;
        this.bulkPrice = bulkPrice;
    }

    applyRule(items: Map<string, number>): void {
      if(items.has(this.sku)){
        const quantity = items.get(this.sku);
        if(quantity>this.bulkQuantity){
            products.forEach((item)=>{
                if(item.SKU==this.sku){
                    item.Price=this.bulkPrice;
                }
            })        
        }
      }
    }
}
class BuyXGetYFreePricingRule implements PricingRule {
    private sku: string;
    private x: number;
    private y: number;

    constructor(sku: string, x: number, y: number) {
        this.sku = sku;
        this.x = x;
        this.y = y;
    }
    applyRule(items: Map<string, number>): void {
        if (items.has(this.sku)) {
            const quantity = items.get(this.sku)!;
            const freeItems = Math.floor(quantity / this.x);
            console.log("freeItems-->",freeItems,quantity-freeItems)
            items.set(this.sku, quantity - freeItems);
        }
    }
}

//Testing with sample data
const pricingRules: PricingRule[] = [
    new BuyXGetYFreePricingRule("atv", 3, 1),
    new BulkDiscountPricingRule("ipd", 4, 499.99) 
];
let order1= new checkout(pricingRules);
order1.scan("atv");
order1.scan("ipd");
order1.scan("ipd");
order1.scan("ipd");
order1.scan("ipd");
order1.scan("ipd");
order1.scan("atv");
order1.scan("atv");
order1.scan("atv");
console.log(products)
console.log(order1.total())