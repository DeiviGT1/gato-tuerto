import os
from PIL import Image

# --- Configuración ---
# Dimensiones máximas: la imagen se redimensionará para caber en este marco.
max_ancho = 720
max_alto = 1200

# Calidad para la compresión WebP (0-100). Un valor más bajo significa un archivo más pequeño.
# 80 es un buen balance entre calidad y tamaño.
calidad_webp = 80

# Directorio donde se ejecutará el script ('.' es el directorio actual).
directorio_raiz = "."

# --- Inicio del Script ---
print(f"Optimizando imágenes .webp en '{directorio_raiz}' y subcarpetas...")
print(f"Reglas: Ancho máx={max_ancho}px, Alto máx={max_alto}px, Calidad={calidad_webp}")
print("-" * 30)

# os.walk recorre el árbol de directorios de forma recursiva
for root, dirs, files in os.walk(directorio_raiz):
    for nombre_archivo in files:
        if nombre_archivo.lower().endswith(".webp"):
            ruta_archivo = os.path.join(root, nombre_archivo)

            try:
                with Image.open(ruta_archivo) as img:
                    ancho, alto = img.size
                    
                    # Determinar si la imagen necesita ser redimensionada
                    if ancho > max_ancho or alto > max_alto:
                        # Calcular la proporción para no deformar la imagen
                        ratio = min(max_ancho / ancho, max_alto / alto)
                        nuevo_ancho = int(ancho * ratio)
                        nuevo_alto = int(alto * ratio)
                        
                        # Redimensionar la imagen
                        img_procesada = img.resize((nuevo_ancho, nuevo_alto))
                        
                        # Guardar la imagen redimensionada Y comprimida
                        img_procesada.save(ruta_archivo, 'webp', quality=calidad_webp)
                        print(f"✅ Redimensionado y Comprimido: {ruta_archivo} -> {nuevo_ancho}x{nuevo_alto}")
                    else:
                        # Si no se redimensiona, solo se guarda con la nueva calidad para comprimirla
                        img.save(ruta_archivo, 'webp', quality=calidad_webp)
                        print(f"✨ Comprimido (sin redimensionar): {ruta_archivo}")

            except Exception as e:
                print(f"❌ Error al procesar {ruta_archivo}: {e}")

print("-" * 30)
print("\nProceso finalizado.")