import pandas as pd
import json

inventory = pd.read_csv('inventory.txt', sep='\t')
inventory['QTY_ON_HND'] = inventory['QTY_ON_HND'].fillna(0)
with open('products.json', 'r') as file:
    data = json.load(file)

for type in data['types']:
    for subtype in type['subtypes']:
        for products in subtype['products']:
            for product in products['products']:
                for size in product['sizes']:
                    try:
                        size['inventory'] = int(inventory[inventory['BARCODE'] == size['id']]['QTY_ON_HND'].values[0])
                    except:
                        size['inventory'] = 0

                    try: 
                        size['price'] = float(inventory[inventory['BARCODE'] == size['id']]['PRICE_C'].values[0])
                    except: 
                        size['price'] = 100000 


with open('data_final.json', 'w') as file:
    json.dump(data, file, indent=4)

