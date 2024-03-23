const purchaseProductsModule = require("../moduls/productDetails");
const soldProductsModule = require("../moduls/invoiceModule");

const dataInfo = async (req, res) => {
    try {
        const purchaseProducts = await purchaseProductsModule.find({});
        const soldProducts = await soldProductsModule.find({});
          
        const purchaseProductsArray = purchaseProducts[0]?.arr || [];
        const soldProductsArray = soldProducts[0]?.arr || [];

        const sumpurchaseProducts = calculateSum(purchaseProductsArray);
        const sumsoldProducts = calculateSumInvoice(soldProductsArray);
     
        const differenceObject = calculateDifference(sumpurchaseProducts, sumsoldProducts);
       
        res.status(200).json({
            data: differenceObject,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Request failed',
        });
    }
};
const calculateSum = (productArray) => {
    const sumProducts = {};

    productArray.forEach((item) => {
        const { product_Name: productName, status, noOfUnit, batchNo } = item;
        const quantity = parseInt(noOfUnit, 10);

        if (status === "Approved") {
            if (!sumProducts[productName]) {
                sumProducts[productName] = [];
            }
            const existingBatch = sumProducts[productName].find(batch => batch.batchNo === batchNo);
            if (existingBatch) {
                existingBatch.quantity += quantity;
            } else {
                sumProducts[productName].push({ batchNo, quantity });
            }
        }
    });

    return sumProducts;
};
const calculateSumInvoice = (productArray) => {
    const sumProducts = {};

    productArray.forEach((item) => {
        const { product_Name: productName, status, noOfUnit } = item;
        const quantity = parseInt(noOfUnit, 10);

        if (status === "Approved") {
            sumProducts[productName] = (sumProducts[productName] || 0) + quantity;
        }
    });

    return sumProducts;
};


const calculateDifference = (sumpurchaseProducts, sumsoldProducts) => {
    const differenceObject = {};


    Object.keys(sumpurchaseProducts).forEach((productName) => {
   
        const purchaseQuantities = [...sumpurchaseProducts[productName]];

       
        let totalSoldQuantity = sumsoldProducts[productName] || 0;


        for (let i = purchaseQuantities.length - 1; i >= 0; i--) {
            const batch = purchaseQuantities[i];
            const remainingSoldQuantity = totalSoldQuantity - batch.quantity;

        
            if (remainingSoldQuantity <= 0) {
                batch.quantity -= totalSoldQuantity;
                break;
            } else {
                
                batch.quantity = 0;
                totalSoldQuantity = remainingSoldQuantity;
            }
        }

        differenceObject[productName] = purchaseQuantities;
     
    });
    for (let key in differenceObject) {
        differenceObject[key] = differenceObject[key].filter(obj => obj.quantity !== 0 );
      }
      console.log(differenceObject)
    return differenceObject;
   
};







module.exports = { dataInfo };
