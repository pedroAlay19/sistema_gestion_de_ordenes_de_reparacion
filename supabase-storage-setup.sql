-- ============================================
-- CONFIGURACIÓN DE SUPABASE STORAGE
-- Para Imágenes de Órdenes de Reparación
-- ============================================

-- 1. Crear el bucket (si no existe)
-- NOTA: Esto solo se puede hacer desde la UI de Supabase
-- Ve a Storage → New Bucket → Nombre: "repair-order-images" → Public: YES

-- 2. Habilitar RLS en la tabla storage.objects (si no está habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. ELIMINAR políticas existentes (si las hay)
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

-- 4. CREAR POLÍTICA: Permitir a CUALQUIERA subir imágenes (público)
-- Esto es más permisivo pero funciona para desarrollo
CREATE POLICY "Public upload to repair-order-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'repair-order-images');

-- 5. CREAR POLÍTICA: Permitir a TODOS leer las imágenes
CREATE POLICY "Public read repair-order-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'repair-order-images');

-- 6. CREAR POLÍTICA: Permitir a CUALQUIERA eliminar (opcional, para desarrollo)
CREATE POLICY "Public delete repair-order-images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'repair-order-images');

-- 7. CREAR POLÍTICA: Permitir actualizar
CREATE POLICY "Public update repair-order-images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'repair-order-images');

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
PARA EJECUTAR ESTE SCRIPT:

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a "SQL Editor" en la barra lateral
4. Crea una nueva query
5. Copia y pega TODO este código
6. Haz clic en "Run"

IMPORTANTE:
- Primero debes crear el bucket manualmente desde la UI:
  Storage → Create bucket → Name: "repair-order-images" → Public: YES
  
- Estas políticas son MUY PERMISIVAS (permiten acceso público)
- Son ideales para DESARROLLO
- Para PRODUCCIÓN, deberías usar políticas más restrictivas que verifiquen
  que el usuario esté autenticado

POLÍTICAS PARA PRODUCCIÓN (comentadas):

-- Solo usuarios autenticados pueden subir
CREATE POLICY "Authenticated upload to repair-order-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'repair-order-images');

-- Todos pueden leer (público)
CREATE POLICY "Public read repair-order-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'repair-order-images');

-- Solo usuarios autenticados pueden eliminar sus propias imágenes
CREATE POLICY "Authenticated delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'repair-order-images' 
    AND auth.uid()::text = owner::text
);
*/
