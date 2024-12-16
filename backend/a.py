from pymongo import MongoClient

def get_distinct_subtypes(mongo_uri, db_name, collections):
    """
    Obtiene todos los valores distintos de 'subtype' de las colecciones especificadas.

    :param mongo_uri: URI de conexión a MongoDB
    :param db_name: Nombre de la base de datos
    :param collections: Lista de nombres de colecciones
    :return: Conjunto de subtipos únicos
    """
    try:
        # Conectar al cliente de MongoDB
        client = MongoClient(mongo_uri)
        db = client[db_name]

        unique_subtypes = set()

        for collection_name in collections:
            collection = db[collection_name]
            # Obtener valores distintos de 'subtype' en la colección actual
            subtypes = collection.distinct('subtype')
            unique_subtypes.update(subtypes)
            print(f"Subtipos de la colección '{collection_name}': {subtypes}")

        return unique_subtypes

    except Exception as e:
        print(f"Error al obtener subtipos distintos: {e}")
    finally:
        # Cerrar la conexión
        client.close()

if __name__ == "__main__":
    # Configuración
    MONGO_URI = "mongodb://localhost:27017/"  # Reemplaza con tu URI de MongoDB
    DATABASE_NAME = "tu_nombre_de_base_de_datos"  # Reemplaza con el nombre de tu base de datos
    COLLECTIONS = [
        "coleccion1",
        "coleccion2",
        "coleccion3",
        # Agrega más nombres de colecciones según sea necesario
    ]

    # Obtener subtipos distintos
    subtypes = get_distinct_subtypes(MONGO_URI, DATABASE_NAME, COLLECTIONS)

    if subtypes:
        print("\nTodos los subtipos distintos:")
        for subtype in sorted(subtypes):
            print(f"- {subtype}")
    else:
        print("No se encontraron subtipos distintos.")