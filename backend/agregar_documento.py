# agregar_documento.py

import os
from pymongo import MongoClient
from bson.objectid import ObjectId
from typing import List, Dict, Any
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # Si dotenv no está instalado, procede sin él

def insertar_bebida(
    alcoholic_beverage: str,
    type_: str,
    subtype: str,
    brand: str,
    name: str,
    description: str,
    route: str,
    modal: bool,
    sizes: List[Dict[str, Any]],
    _id: str = None,
    uri: str = None,
    db_name: str = None,
    collection_name: str = None
) -> ObjectId:
    """
    Inserta un documento de bebida en la colección de MongoDB especificada.

    Parámetros:
    - alcoholic_beverage (str): Categoría de la bebida alcohólica.
    - type_ (str): Tipo de bebida (e.g., whiskey).
    - subtype (str): Subtipo de bebida (e.g., scotch).
    - brand (str): Marca de la bebida.
    - name (str): Nombre de la bebida.
    - description (str): Descripción de la bebida.
    - route (str): Ruta o URL amigable.
    - modal (bool): Indicador modal.
    - sizes (List[Dict[str, Any]]): Lista de tamaños disponibles.
    - _id (str, opcional): ID del documento. Si no se proporciona, MongoDB lo generará.
    - uri (str, opcional): URI de conexión a MongoDB. Si no se proporciona, se usa la variable de entorno MONGODB_URI.
    - db_name (str, opcional): Nombre de la base de datos. Si no se proporciona, se usa la variable de entorno DB_NAME.
    - collection_name (str, opcional): Nombre de la colección. Si no se proporciona, se usa la variable de entorno COLLECTION_NAME.

    Retorna:
    - ObjectId: El ID del documento insertado.
    """

    # Cargar variables de entorno si no se proporcionan
    uri = uri or os.getenv('MONGODB_URI')
    db_name = db_name or os.getenv('DB_NAME')
    collection_name = collection_name or os.getenv('COLLECTION_NAME')

    if not uri:
        raise ValueError("La URI de MongoDB no está especificada.")

    if not db_name:
        raise ValueError("El nombre de la base de datos no está especificado.")

    if not collection_name:
        raise ValueError("El nombre de la colección no está especificado.")

    # Crear una instancia del cliente
    client = MongoClient(uri)

    # Seleccionar la base de datos y la colección
    db = client[db_name]
    collection = db[collection_name]

    # Construir el documento
    documento = {
        "alcoholicBeverage": alcoholic_beverage,
        "type": type_,
        "subtype": subtype,
        "brand": brand,
        "name": name,
        "description": description,
        "route": route,
        "modal": modal,
        "sizes": sizes
    }

    # Si se proporciona un _id, añadirlo al documento
    if _id:
        documento["_id"] = ObjectId(_id)

    try:
        # Insertar el documento
        resultado = collection.insert_one(documento)
        print(f'Documento insertado con _id: {resultado.inserted_id}')
        return resultado.inserted_id
    except Exception as e:
        print(f'Error al insertar el documento: {e}')
        raise e
    finally:
        # Cerrar la conexión
        client.close()

if __name__ == "__main__":
    # Ejemplo de uso de la función

    # Definir los tamaños
    tamaños = [
        {
            "id": "0496390",
            "size": "2L",
            "price": 5.99,
            "img": "liquors-webp/others/coca-cola/coca-cola-2L.webp",
            "inventory": 2,
            "size_ml": 750,
            "_id": str(ObjectId())
        },
    ]

    # Insertar una bebida
    try:
        nuevo_id = insertar_bebida(
            alcoholic_beverage="Alcoholic Beverages",
            type_="other",
            subtype="other",
            brand="coca-cola",
            name="Coca-Cola",
            description="Coca-Cola is a carbonated soft drink produced by The Coca-Cola Company.",
            route="coca-cola",
            modal=False,
            sizes=tamaños
            # Puedes añadir _id si lo deseas, por ejemplo: _id="6795a977e71eed0350aa05eb"
        )
    except Exception as error:
        print(f"Ocurrió un error: {error}")