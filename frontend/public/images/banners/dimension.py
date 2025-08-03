import os
from PIL import Image

# --- Configuración ---

# Define los anchos de las imágenes que quieres generar.
# El script creará una versión para cada ancho especificado aquí.
GENERATED_SIZES = {
    'small': 480,   # Ancho en píxeles para la versión pequeña
    'large': 1024,  # Ancho en píxeles para la versión grande
}

# Calidad para la compresión WebP (0-100).
CALIDAD_WEBP = 80

# Directorio donde se ejecutará el script ('.' es el directorio actual).
DIRECTORIO_RAIZ = "."

# --- Inicio del Script ---
print(f"Iniciando optimización y reemplazo de imágenes en '{DIRECTORIO_RAIZ}'...")
print(f"Generando versiones con anchos: {list(GENERATED_SIZES.values())}px")
print("¡ADVERTENCIA! Los archivos originales serán eliminados tras el éxito del proceso.")
print("-" * 50)

# Construir una lista de sufijos a ignorar
sufijos_a_ignorar = [f'-{ancho}w.webp' for ancho in GENERATED_SIZES.values()]

for root, dirs, files in os.walk(DIRECTORIO_RAIZ):
    for nombre_archivo in files:
        if nombre_archivo.lower().endswith(".webp") and not any(nombre_archivo.lower().endswith(sufijo) for sufijo in sufijos_a_ignorar):
            
            ruta_original = os.path.join(root, nombre_archivo)
            nombre_base, extension = os.path.splitext(ruta_original)

            try:
                with Image.open(ruta_original) as img:
                    ancho_original, alto_original = img.size
                    
                    print(f"\nProcesando y reemplazando: {ruta_original} ({ancho_original}x{alto_original})")

                    # Iterar sobre cada tamaño que queremos generar
                    for size_name, target_width in GENERATED_SIZES.items():
                        
                        # AVISO: Agrandar una imagen pequeña (upscaling) puede reducir su calidad visual.
                        # Esta sección ahora SIEMPRE genera la imagen, sin importar el tamaño original.
                        
                        ratio = target_width / ancho_original
                        nuevo_alto = int(alto_original * ratio)
                        
                        img_procesada = img.resize((target_width, nuevo_alto))
                        
                        nueva_ruta = f"{nombre_base}-{target_width}w.webp"
                        
                        img_procesada.save(nueva_ruta, 'webp', quality=CALIDAD_WEBP)
                        print(f"  ✅ Creado '{size_name}': {nueva_ruta} ({target_width}x{nuevo_alto})")

                # ¡ACCIÓN DE BORRADO! Se ejecuta solo si el bloque 'with' se completó sin errores.
                os.remove(ruta_original)
                print(f"  🗑️ Original eliminado: {nombre_archivo}")

            except Exception as e:
                print(f"  ❌ Error al procesar {ruta_original}. El archivo original NO fue eliminado. Error: {e}")

print("-" * 50)
print("\nProceso finalizado.")