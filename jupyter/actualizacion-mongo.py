import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# MongoDB connection URI
uri = "mongodb+srv://josedago1163:JcXOf3zRRUFOPbCr@orders.o5e4n.mongodb.net/?retryWrites=true&w=majority&appName=orders"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Database and collection
db = client['el-gato-tuerto']
collection = db.products  # Access 'products' collection within 'orders' database

# Load data from JSON file
try:
    with open('data_final.json', 'r') as file:
        data = json.load(file)  # Load JSON data

    # Traverse the JSON structure to reach the products
    products_to_insert = []
    for type_entry in data.get("types", []):
        for subtype in type_entry.get("subtypes", []):
            for brand in subtype.get("products", []):
                for product in brand.get("products", []):
                    # Add the product to the list, including some contextual information
                    product_document = {
                        "alcoholicBeverage": data["alcoholicBeverages"],
                        "type": type_entry["type"],
                        "subtype": subtype["subtype"],
                        "brand": brand["brand"],
                        **product  # Add the product details
                    }
                    products_to_insert.append(product_document)
    
    # Insert the products as individual documents
    if products_to_insert:
        collection.insert_many(products_to_insert)
        print("Data successfully loaded into the 'products' collection in the 'orders' database!")
    else:
        print("No products found to insert.")

except json.JSONDecodeError:
    print("Error: Failed to decode JSON. Ensure 'data_final.json' is correctly formatted.")
except FileNotFoundError:
    print("Error: 'data_final.json' file not found.")
except Exception as e:
    print(f"An error occurred: {e}")